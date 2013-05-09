/* $Id: wget.js,v 1.3 2013/05/09 08:49:22 art Exp $ */

load("http.js");

var url = argv[0];	// First argument is the URL (required).
var outfile;		// Pass a second argument as the outfile (optional).
var filename=backslash(js.startup_dir);

if (argv[1]) {
	outfile = argv[1];
	filename += outfile;
} else {
	filename += file_getname(url);
}

print("Writing to file: " + filename);

var file = new File(filename);

if(!file.open("w"))
	print("error " + file.error + " opening " + file.name);
else {
	var contents = new HTTPRequest().Get(url);
	file.write(contents);
	file.close();
}
