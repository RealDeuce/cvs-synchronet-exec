// Used for handling the input of /X commands

// $Id: getkeye.js,v 1.2 2010/07/09 21:09:47 deuce Exp $

if(js.global.K_UPPER==undefined)
	load("sbbsdefs.js");

function getkeye()
{
	var key;
	var key2;

	while(1) {
		key=console.getkey(K_UPPER);
		if(key=='/') {
			print(key);
			key2=console.getkey(K_UPPER);
			if(key2=="\b" || key2=="\e") {
				print("\b \b");
				continue;
			}
			key=key+key2;
		}
		break;
	}
	return(key);
}
