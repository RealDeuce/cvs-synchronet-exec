/* Example Dynamic-HTML Content Parser */

/* $Id: xjs_handler.js,v 1.1 2005/04/16 07:37:31 rswindell Exp $ */

var file = new File(http_request.real_path);
if(!file.open("r")) {
	writeln("!ERROR " + file.error + " opening " + http_request.real_path);
	exit();
}
var text = file.readAll();
file.close();
write(text.join(" ").replace(/<%([^%]*)%>/g, function (str, arg) { return eval(arg); } ));
