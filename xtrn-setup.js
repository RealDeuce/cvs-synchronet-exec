// $Id: xtrn-setup.js,v 1.7 2020/04/25 09:22:01 rswindell Exp $
// vi: tabstop=4

load('sbbsdefs.js');
load('frame.js');
load('tree.js');

js.on_exit('console.attributes = ' + console.attributes);
js.on_exit('bbs.sys_status = ' + bbs.sys_status);

bbs.sys_status|=SS_MOFF;

const frame = new Frame(1, 1, console.screen_columns, console.screen_rows, BG_BLUE|WHITE);
const main_frame = new Frame(1, 2, frame.width, frame.height - 2, BG_BLACK|LIGHTGRAY, frame);
const tree_frame = new Frame(1, main_frame.y + 1, Math.floor(main_frame.width / 2), main_frame.height - 2, BG_BLACK|LIGHTGRAY, main_frame);
const info_frame = new Frame(tree_frame.width + 1, main_frame.y + 1, main_frame.width - tree_frame.width - 1, main_frame.height - 2, BG_BLACK|WHITE, main_frame);
info_frame.word_wrap = true;
const tree = new Tree(tree_frame);

frame.putmsg('External Program Setup');
frame.gotoxy(1, frame.height);
frame.putmsg('[Up/Down/Home/End] to navigate, [Enter] to select, [Q] to quit');

tree.colors.fg = LIGHTGRAY;
tree.colors.bg = BG_BLACK;
tree.colors.lfg = WHITE;
tree.colors.lbg = BG_CYAN;
tree.colors.kfg = LIGHTCYAN;

var longest = 0;
directory(system.exec_dir + '../xtrn/*', GLOB_ONLYDIR).forEach(function (e) {
    const ini = e + '/install-xtrn.ini';
    if (!file_exists(ini)) return;
    const f = new File(ini);
    if (!f.open('r')) {
		alert("Error " + f.error + " opening " + f.name);
		return;
	}
    const xtrn = f.iniGetObject();
    f.close();
	if(!xtrn.Name) {
		alert("Skipping file with no 'Name' value: " + f.name);
		return;
	}
    const item = tree.addItem(xtrn.Name, function () {
		console.clear(LIGHTGRAY);
        js.exec('install-xtrn.js', {}, e);
		console.pause();
		frame.invalidate();
    });
    item.__xtrn_setup = xtrn;
    if (xtrn.Name.length > longest) longest = xtrn.Name.length;
});

tree_frame.width = longest + 1;
info_frame.x = tree_frame.width + 2;
info_frame.width = main_frame.width - tree_frame.width - 2;

console.clear(BG_BLACK|LIGHTGRAY);
frame.open();
tree.open();
frame.cycle();

var key;
var xtrn;
var high_water = 0;
console.ungetstr(KEY_UP);
while (!js.terminated) {
    key = console.getkey();
    if (key.toLowerCase() == 'q') break;
    tree.getcmd(key);
    function crlf() {
		info_frame.cleartoeol();
		info_frame.crlf();
    }
    if (key == KEY_UP || key == KEY_DOWN || key == KEY_HOME || key == KEY_END) {
        xtrn = tree.currentItem.__xtrn_setup;
        info_frame.home();
        info_frame.putmsg('\x01h\x01w' + xtrn.Name);
		crlf();
        if (xtrn.Desc) {
			info_frame.cleartoeol();
			info_frame.putmsg('\x01n\x01w' + xtrn.Desc);
			crlf();
		}
		crlf();
        if (xtrn.By) {
			info_frame.putmsg('\x01h\x01cBy\x01w:');
			crlf();
			info_frame.putmsg('\x01w' + xtrn.By);
			crlf();
			crlf();
		}
        if (xtrn.Cats) {
			info_frame.putmsg('\x01h\x01cCategories\x01w:');
			crlf();
			info_frame.putmsg('\x01n' + xtrn.Cats);
			crlf();
			crlf();
		}
        if (xtrn.Subs) {
			info_frame.putmsg('\x01h\x01cSubcategories\x01w:');
			crlf();
			info_frame.putmsg('\x01n' + xtrn.Subs);
			crlf();
		}
		var y = info_frame.cursor.y;
		while(high_water > y) {
			crlf();
			high_water--;
		}
		high_water = y;
    }
    if (frame.cycle()) console.gotoxy(console.screen_columns, console.screen_rows);
}

frame.close();