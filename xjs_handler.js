/* Example Dynamic-HTML Content Parser */

/* $Id: xjs_handler.js,v 1.8 2006/08/09 20:27:34 deuce Exp $ */

var xjs_filename;

if(this.http_request!=undefined)	/* Requested through web-server */
	xjs_filename = http_request.real_path;
else
	xjs_filename = argv[0];

var last_cwd='';

xjs_load(xjs_filename);

function xjs_load(filename) {
	if(last_cwd != '') {
		if(filename.search(/^((\/)|([A-Za-z]:[\/\\]))/)==-1)
			filename=last_cwd+'/'+filename;
	}
	var cwd=filename;
	cwd=cwd.replace(/[^\\\/]*$/,'');
	var ssjs_filename=filename+".ssjs";

	// Probably a race condition on Win32
	if(file_exists(ssjs_filename)) {
		if(file_date(ssjs_filename)<=file_date(filename)) {
			file_remove(ssjs_filename);
		}
	}

	if(!file_exists(ssjs_filename)) {
		var file = new File(filename);
		if(!file.open("r",true,8192)) {
			writeln("!ERROR " + file.error + " opening " + filename);
			exit();
		}
		var text = file.readAll(8192);
		file.close();

		var script="";

		var in_xjs=false;
		for (line in text) {
			var str=text[line];
			while(str != '') {
				if(!in_xjs) {
					if(str=='<?xjs' || str=='<?') {
						in_xjs=true;
						str='';
					}
					else {
						if(str.search(/<\?(xjs)?\s+/)==-1) {
							script += "writeln("+escape_quotes(str)+");";
							str='';
						}
						else {
							str=str.replace(/^(.*?)<\?(xjs)?\s+/,
								function (str, p1, p2, offset, s) {
									if(p1 != '')
										script += "write("+escape_quotes(p1)+");";
									in_xjs=true;
									return '';
								}
							);
						}
					}
				}
				else {
					if(str.search(/\?>/)==-1) {
						script += str;
						str='';
					}
					else {
						str=str.replace(/^(.*?)\?>/,
							function (str, p1, offset, s) {
								script += p1+";";
								in_xjs=false;
								return '';
							}
						);
					}
				}
			}
			script += '\n';
		}

		var f=new File(ssjs_filename);
		if(f.open("w",false)) {
			f.write(script);
			f.close();
		}
	}

	last_cwd=cwd;

	load(ssjs_filename);
}

function escape_quotes(arg) {
	return("'"+arg.replace(/'/g,"'+"+'"'+"'"+'"+'+"'")+"'");
}
