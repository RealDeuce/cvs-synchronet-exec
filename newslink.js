// newslink.js

// Synchronet Newsgroup Link/Gateway Module

// Configuration file (in ctrl/newslink.cfg) format:

// ;this line is a comment
// server
// username
// password
// subboard	newsgroup
// subboard newsgroup
// ...

printf("Synchronet NewsLink session started (v1.00 Alpha)");

var cfg_fname = system.ctrl_dir + "newslink.cfg";

load("sbbsdefs.js");

var debug = false;
var reset_ptrs = false;		// Reset export pointers, export all messages
var update_ptrs = false;	// Update export pointers, don't export anything

// Parse arguments
for(i=0;i<argc;i++) {
	if(argv[i].toLowerCase()=="-d")
		debug = true;
	else if(argv[i].toLowerCase()=="-r")
		reset_ptrs = true;
	else if(argv[i].toLowerCase()=="-u")
		update_ptrs = true;
	else
		cfg_fname = argv[i];
}

// Write a string to the server socket
function write(str)
{
	socket.send(str);
}

function writeln(str)
{
	if(debug)
		printf("cmd: %s",str);
	write(str + "\r\n");
}

function readln(str)
{
	rsp = socket.readln();
	if(debug)
		printf("rsp: %s",rsp);
	return(rsp);
}

var server;
var port=119;
var username;
var password;
area = new Array();

/******************************/
/* Read/Parse the Config File */
/******************************/

cfg_file = new File(cfg_fname);
if(!cfg_file.open("r")) {
	printf("!Error %d opening %s",errno,cfg_fname);
	delete cfg_file;
	exit();
}

while(!cfg_file.eof) {
	line = cfg_file.readln();
	if(line==null || line[0] == ';' || !line.length)
		continue;
	str=line.split(/\s+/);
	switch(str[0].toLowerCase()) {
		case "server":
			server=str[1];
			break;
		case "port":
			port=Number(str[1]);
			break;
		case "user":
			username=str[1];
			break;
		case "pass":
			password=str[1];
			break;
		case "area":
			area.push(str);
			break;
		default:
			printf("!UNRECOGNIZED configuration keyword: %s",str[0]);
			break;
	}
}
delete cfg_file;

printf("server: %s",server);
printf("username: %s",username);
printf("password: %s",password);
printf("%ld areas",area.length);

if(server==undefined || !server.length) {
	printf("!No news server specified");
	exit();
}

printf("Connecting to %s port %d ...",server,port);
socket = new Socket();
//socket.debug=true;
if(!socket.connect(server,port)) {
	printf("!Error %d connecting to %s port %d"
		,socket.last_error,server,port);
	delete socket;
	exit();
}
printf("Connected");
readln();

if(username!=undefined && username.length) {
	printf("Authenticating...");
	writeln(format("AUTHINFO USER %s",username));
	readln();
	if(password!=undefined && password.length) {
		writeln(format("AUTHINFO PASS %s",password));
		rsp = readln();
		if(rsp==null || rsp[0]!='2') {
			printf("!Authentication failure: %s", rsp);
			delete socket;
			exit();
		}
	}
	printf("Authenticated");
}

/* Export and Import Messages */
printf("Scanning %lu message bases...",area.length);
for(i in area) {
	
	if(!socket.is_connected) {
		printf("Disconnected");
		break;
	}

	printf("%s",area[i].toString());
	
	sub = area[i][1];
	newsgroup = area[i][2];
	printf("sub: %s, newsgroup: %s",sub,newsgroup);
	msgbase = new MsgBase(sub);
	if(msgbase == null) {
		printf("!ERROR opening msgbase: %s",sub);
		continue;
	}

	/*********************/
	/* Read Pointer File */
	/*********************/
	export_ptr = 0;
	import_ptr = 0;
	ptr_fname = msgbase.file + ".snl";
	ptr_file = new File(ptr_fname);
	if(ptr_file.open("r")) {
		export_ptr = ptr_file.readBin();
		printf("%s export ptr: %ld",sub,export_ptr);
		import_ptr = ptr_file.readBin();
		printf("%s import ptr: %ld",sub,import_ptr);
	}
	ptr_file.close();

	if(reset_ptrs)
		ptr = 0;
	else if(update_ptrs)
		ptr = msgbase.last_msg;
	else 
		ptr = export_ptr;

	if(ptr < msgbase.first_msg)
		ptr = msgbase.first_msg;
	else
		ptr++;

	/*************************/
	/* EXPORT Local Messages */
	/*************************/
	for(;socket.is_connected && ptr<=msgbase.last_msg;ptr++) {
		hdr = msgbase.get_msg_header(false,ptr);
		if(hdr == null)
			continue;
		if(hdr.attr&MSG_DELETE)	/* marked for deletion */
			continue;
		if(hdr.attr&MSG_MODERATED && !(hdr.attr&MSG_VALIDATED))
			continue;
		if(hdr.attr&MSG_PRIVATE)/* no private messages on NNTP */
			continue;
		if(hdr.from_net_type==NET_INTERNET)	/* no dupe loop */
			continue;

		body = msgbase.get_msg_body(false, ptr
				,true /* remove ctrl-a codes */);
		if(body == null) {
			printf("!FAILED to read message number %ld",ptr);
			continue;
		}

		writeln("POST");
		rsp = readln();
		if(rsp==null || rsp[0]!='3') {
			printf("!POST failure: %s",rsp);
			break;
		}

		if(hdr.from_net_type)
			writeln(format("From: \"%s\" <%s@%s>"
				,hdr.from,hdr.from,hdr.from_net_addr));
		else if(hdr.from.indexOf(' ')>0)
			writeln(format("From: \"%s\"@%s"
				,hdr.from,system.inetaddr));
		else
			writeln(format("From: %s@%s"
				,hdr.from,system.inetaddr));
		writeln("Subject: " + hdr.subject);
		writeln("Message-ID: " + hdr.id);
		writeln("Date: " + hdr.date);
		writeln("References: " + hdr.reply_id);
		writeln("Newsgroups: " + newsgroup);
		writeln("");
		write(body);
		writeln(".");
		rsp = readln();
		if(rsp==null || rsp[0]!='2') {
			printf("!POST failure: %s",rsp);
			break;
		}
		printf("Posted message %lu to newsgroup: %s",ptr,newsgroup);
	}
	if(ptr > msgbase.last_msg)
		ptr = msgbase.last_msg;
	export_ptr = ptr;

	/***************************/
	/* IMPORT Network Messages */
	/***************************/	

	ptr = import_ptr;
	if(ptr < 0) {
		printf("Fixing %s import ptr: %ld",newsgroup,ptr);
		ptr = 0;
	}

	writeln(format("GROUP %s",newsgroup));
	rsp = readln();
	if(rsp==null || rsp[0]!='2') {
		printf("!GROUP %s failure: %s",newsgroup,rsp);
		delete ptr_file;
		delete msgbase;
		continue;
	}
	str = rsp.split(' ');
	last_msg = Number(str[3]);

	printf("%s import ptr: %ld, last_msg: %ld",newsgroup,ptr,last_msg);

	if(ptr > last_msg)
		ptr = last_msg;
	for(ptr++;socket.is_connected && ptr<=last_msg;ptr++) {
		writeln(format("ARTICLE %lu",ptr));
		rsp = readln();
		if(rsp==null || rsp[0]!='2') {
			printf("!ARTICLE %lu failure: %s",ptr,rsp);
			continue;
		}
		body="";
		header=true;
		var hdr=new Object();
		while(socket.is_connected) {

			line = socket.recvline(512 /*maxlen*/, 300 /*timeout*/);

			if(line==null) {
				printf("!TIMEOUT waiting for text line");
				break;
			}

			//printf("msgtxt: %s",line);

			if(line==".") {
//				printf("End of message text");
				break;
			}
			if(line=="" && header) {
				header=false;
				continue;
			}

			if(!header) {	/* Body text, append to 'body' */
				if(line.charAt(0)=='.')
					line=line.slice(1);		// Skip prepended dots
				body += line;
				body += "\r\n";
				continue;
			}
			//printf(line);

			/* Parse header lines */
			if((sp=line.indexOf(':'))==-1)
				continue;

			data=line.slice(sp+1);
			while(data.charAt(0)==' ')	// skip prepended spaces
				data=data.slice(1);

			line=line.substr(0,sp);
			while(line.charAt(0)==' ')	// skip prepended spaces
				line=line.slice(1);

			switch(line.toLowerCase()) {
				case "from":
					hdr.from=data;
					break;
				case "date":
					hdr.date=data;
					break;
				case "subject":
					hdr.subject=data;
					break;
				case "message-id":
					hdr.id=data;
					break;
				case "references":
					hdr.reply_id=data;
					break;
				/* TODO: Parse date field */
			}
		}
		if(hdr.id.indexOf('@' + system.inetaddr)!=-1)	// avoid dupe loop
			continue;
		hdr.from_net_type=NET_INTERNET;
		hdr.from_net_addr=hdr.from;
		if(msgbase.save_msg(hdr,body)) 
			printf("Message %lu imported into %s",ptr,sub);
	}
	if(ptr > last_msg)
		ptr = last_msg;
	import_ptr = ptr;

	/* Save Pointers */
	if(!ptr_file.open("w"))
		printf("!ERROR %d creating/opening %s",errno,ptr_fname);
	else {
		ptr_file.writeBin(export_ptr);
		ptr_file.writeBin(import_ptr);
		ptr_file.close();
	}
	delete ptr_file;
	delete msgbase;
}

delete socket;

printf("Synchronet NewsLink session complete");

/* End of newslink.js */
