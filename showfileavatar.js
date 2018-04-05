// $Id: showfileavatar.js,v 1.3 2018/04/05 02:22:01 rswindell Exp $

const FM_ANON			=(1<<1);
const USER_ANSI         =(1<<1);

// Avatar support here:
if(!(bbs.file_attr&FM_ANON) && console.term_supports(USER_ANSI)) {
	var Avatar = load({}, 'avatar_lib.js');
	Avatar.draw(null, bbs.file_uploader, null, /* above: */true, /* right-justified: */true);
	console.attributes = 7;	// Clear the background attribute as the next line might scroll, filling with BG attribute
}