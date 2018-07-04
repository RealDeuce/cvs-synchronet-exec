// dyndns.js

// Client for Synchronet dynamic DNS service (yourbbs.synchro.net)

// $Id: dyndns.js,v 1.15 2018/07/04 05:42:41 rswindell Exp $

// usage: ?dyndns <password> [ip_address] [-mx address]

const REVISION = "$Revision: 1.15 $".split(' ')[1];

printf("Synchronet Dynamic DNS Client %s\r\n", REVISION);

host_list=["dyndns.synchro.net", "rob.synchro.net", "bbs.synchro.net", "cvs.synchro.net"];

function writeln(str)
{
	sock.send(str + "\r\n");
	print(str);
}

var options=load({}, "modopts.js", "dyndns");
if(!options)
	options = {};

var mx_record = options.mx;
var ip_address = options.ip;
var ip6_address = options.ip6;
var host_name = system.qwk_id;

for(i=1;i<argc;i++) {
	switch (argv[i].toLowerCase()) {
		case "-mx":
			mx_record = argv[++i];
			break;
		case "-hn":
			host_name = argv[++i];
			break;
		case "-ip6":
		case "-ipv6":
			ip6_address = argv[++i];
			break;
		default:
			ip_address = argv[i];
	}
}


		
for(h in host_list) {
	sock = new Socket();
	if( (this.server != undefined) &&
	    !sock.bind(0,server.interface_ip_address)) {
		printf("Error %lu binding socket to %s\r\n"
			,sock.last_error,server.interface_ip_address);
		continue;
	}
	if(!sock.connect(host_list[h],8467)) {
		sock.close();
		printf("Error %lu connecting to %s\r\n",sock.last_error,host_list[h]);
		continue;
	}
	var count=0;
	while(sock.is_connected && count++<10) {
		str=sock.readline();
		if(str == null)
			break;
		print(str);
		switch(str) {
			case "id?":
				writeln(host_name);
				break;
			case "pw?":
				writeln(argv[0]);
				break;
			case "ip?":
				if(ip_address)
					writeln(ip_address);
				else
					writeln("");
				break;
			case "ip6?":
				if(ip6_address)
					writeln(ip6_address);
				else
					writeln("");
				break;
			case "mx?":
				if(mx_record)
					writeln(mx_record);
				else
					writeln("");
				break;
			default:
				writeln("");
				break;
		}
	}
	break;
}
