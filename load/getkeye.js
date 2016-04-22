// Used for handling the input of /X commands

// $Id: getkeye.js,v 1.4 2016/04/22 09:32:47 deuce Exp $

load('require.js', "sbbsdefs.js", 'K_UPPER');

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
