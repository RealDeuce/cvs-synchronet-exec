// dyndns.js

// Client for Synchronet dynamic DNS service (yourbbs.synchro.net)

// $Id: dyndns.js,v 1.2 2003/07/27 10:34:23 rswindell Exp $

// usage: ?dyndns <password>

const REVISION = "$Revision: 1.2 $".split(' ')[1];

printf("Synchronet Dynamic DNS Client %s\r\n", REVISION);

host_list=["vert.synchro.net", "rob.synchro.net", "bbs.synchro.net", "cvs.synchro.net"];

function writeln(str)
{
	sock.send(str + "\r\n");
	print(str);
}

for(h in host_list) {
	sock = new Socket();
	if(!sock.connect(host_list[h],8467)) {
		printf("Error %lu connecting to %s\r\n",sock.last_error,host_list[h]);
		continue;
	}
	while(sock.is_connected) {
		str=sock.readline();
		print(str);
		switch(str) {
			case "id?":
				writeln(system.qwk_id);
				break;
			case "pw?":
				writeln(argv[0]);
				break;
			default:
				writeln("");
				break;
		}
	}
	break;
}
