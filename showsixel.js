// $Id: showsixel.js,v 1.2 2018/02/04 05:15:06 rswindell Exp $

load('cterm_libs.js');

if(console.cterm_version >= 1189) {
	var image=new File(argv[0]);
	if (image.exists) {
		if (image.open("rb", true)) {
			var readlen = console.output_buffer_level + console.output_buffer_space;
			readlen /= 2;
			console.clear();
			while (!image.eof) {
				var imagedata=image.read(readlen);
				while(console.output_buffer_space < imagedata.length)
					mswait(1);
				console.write(imagedata);
			}
			image.close();
		}
	}
}
