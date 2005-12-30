/*
 * Generic lightbar interface.
 * $Id: lightbar.js,v 1.9 2005/12/30 17:58:04 deuce Exp $
 */

/* ToDo: Support multiple columns */
//if(SYS_CLOSED==undefined)
	load("sbbsdefs.js");

/*
 * Lightbar object
 * Properties:
 *  xpos: Horizontal position of lightbar menu (1-based)
 *  xpos: Vertical position of lightbar menu (1-based)
 *  items: an array of objects each having the following properties:
 *         text - The displayed text.  A | prefixes a hotkey
 *         retval - The value to return if this is selected
 *       OPTIONAL Properties:
 *         width - The width of this item.  If not specified, is the width of
 *                 the text.  Otherwise, the text is truncated or padded with
 *				   spaces to fit the width.
 *  direction: 0 for vertical, 1 for horizontal.
 *			   Horizontal menus always have one space of padding added between
 *             items.
 *  fg: Foreground colour of a non-current item
 *  bg: Background colour of a non-current item
 *  hfg: Foreground colour of a current item
 *  hbg: Background colour of a current item
 *  kfg: Hotkey forground colour for non-current item
 *  khfg: Hotkey foreground colour for current item
 *  current: Index of currently highlighted item
 *  align: If width is greater than the text length, a zero indicates the text
 *         should be left-aligned, a 1 indicates it should be right-aligned, and
 *         a 2 indicates it should be centered.
 */
function Lightbar(items)
{
	this.fg=7;
	this.bg=1;
	this.xpos=1;
	this.ypos=1;
	this.direction=0;
	this.hfg=1;
	this.hbg=7;
	this.kfg=15;
	this.khfg=15;
	this.current=0;
	this.align=0;
	this.force_width=-1;
	this.getval=Lightbar_getval;
	this.clear=Lightbar_clearitems;
	this.add=Lightbar_additem;
	this.failsafe_getval=Lightbar_failsafe_getval;
	if(items==undefined)
		this.items=new Array();
	else
		this.items=items;
}

function Lightbar_additem(txt, retval, width)
{
	var item=new Object;

	if(txt==undefined) {
		alert("Text of item undefined!");
		return;
	}
	item.text=txt;
	if(retval!=undefined)
		item.retval=retval;
	if(width!=undefined)
		item.width=width;
	this.items.push(item);
}

function Lightbar_clearitems()
{
	this.items=new Array();
}

function Lightbar_failsafe_getval()
{
	var retval;
	for(i=0; i<this.items.length; i++) {
		if(this.items[i] != undefined && this.items[i].text != undefined) {
			writeln((i+1)+": "+this.items[i].text);
		}
	}
	write("Choose an option: ");
	i=console.getnum(i);
	if(this.items[i]==undefined)
		return(null);
	if(this.items[i].retval==undefined)
		return(undefined);
	this.current=i;
	retval=this.items[i].retval;

	return(retval);
}

/*
 * Super-Overlord Lightbar method... draws and returns selected value.
 */
function Lightbar_getval(current)
{
	var attr=this.bg<<4|this.fg;
	var cattr=this.hbg<<4|this.hfg;
	var kattr=this.bg<<4|this.kfg;
	var kcattr=this.hbg<<4|this.khfg;
	var ret=undefined;

	if(current!=undefined)
		this.current=current;
	if(!(user.settings & USER_ANSI)) {
		return(this.failsafe_getval());
	}
	if(!(user.settings & USER_COLOR)) {
		return(this.failsafe_getval());
	}

	if(this.direction < 0 || this.direction > 1) {
		alert("Unknown lightbar direction!");
		return(this.failsafe_getval());
	}

	/* Check that a vertical lightbar fits on the screen */
	if(this.direction==0 && (this.ypos+this.items.length-1 > console.screen_rows)) {
		alert("Screen too short for lightbar!");
		return(this.failsafe_getval());
	}

	/* Ensure current is valid */
	if(this.current<0 || this.current >= this.items.length) {
		alert("current parameter is out of range!");
		this.current=0;
		if(this.items.length<=0)
			return(null);
	}
	var orig_cur=this.current;
	while(this.items[this.current].retval==undefined) {
		this.current++;
		if(this.current==this.items.length)
			this.current=0;
		if(this.current==orig_cur) {
			alert("No items with a return value!");
			return(undefined);
		}
	}

	/* Check that a horizontal lightbar fits on the screen */
	if(this.direction==1) {
		var end=this.xpos;
		var i;
		for(i=0; i<this.items.length; i++) {
			if(this.force_width>0) {
				end+=this.force_width+1;
				continue;
			}
			if(this.items[i].width==undefined) {
				if(this.items[i]==undefined) {
					alert("Sparse items array!");
					return(null);
				}
				if(this.items[i].text==undefined) {
					alert("No text for item "+i+"!");
					return(this.failsafe_getval());
				}
				var cleaned=this.items[i].text;
				cleaned=cleaned.replace(/\|/g,'');
				end+=cleaned.length+1;
			}
			else {
				end+=this.items[i].width
			}
		}
	}

	/* Main loop */
	while(1) {
		var i;
		var j;

		/* Draw items */
		var curx=this.xpos;
		var cury=this.ypos;
		var cursx=this.xpos;
		var cursy=this.ypos;
		var item_count=0;
		for(i=0; i<this.items.length; i++) {
			var width;
			var cleaned=this.items[i].text;

			cleaned=cleaned.replace(/\|/g,'');
			if(this.force_width>0)
				width=this.force_width;
			else {
				width=cleaned.length;
				if(this.items[i]==undefined) {
					alert("Sparse items array!");
					return(this.failsafe_getval());
				}
				if(this.items[i].text==undefined) {
					alert("No text for item "+i+"!");
					return(this.failsafe_getval());
				}
				if(this.items[i].width!=undefined)
					width=this.items[i].width;
			}
			console.gotoxy(curx, cury);
			if(i==this.current) {
				cursx=curx;
				cursy=cury;
			}
			j=0;
			if(cleaned.length < width) {
				if(this.align==1) {
					if(this.current==i)
						console.attributes=cattr;
					else
						console.attributes=attr;
					for(;j<width-cleaned.length;j++)
						console.write(' ');
				}
				if(this.align==2) {
					if(this.current==i)
						console.attributes=cattr;
					else
						console.attributes=attr;
					for(;j<(width-cleaned.length)/2;j++)
						console.write(' ');
				}
			}
			for(; j<this.items[i].text.length; j++) {
				if(width > -1 && j > width)
					break;
				if(this.items[i].text.substr(j,1)=='|') {
					if(this.current==i)
						console.attributes=kcattr;
					else
						console.attributes=kattr;
					j++;
				}
				else {
					if(this.current==i)
						console.attributes=cattr;
					else
						console.attributes=attr;
				}
				console.write(this.items[i].text.substr(j,1));
			}
			if(this.current==i)
				console.attributes=cattr;
			else
				console.attributes=attr;
			while(j<width) {
				console.write(" ");
				j++;
			}
			if(this.direction==0)
				cury++;
			else {
				console.attributes=attr;
				console.write(" ");
				curx+=width+1;
			}
			if(this.items[i].retval!=undefined)
				item_count++;
		}
		if(item_count==0) {
			alert("No items with a return value!");
			return(undefined);
		}
		console.gotoxy(cursx,cursy);
		if(ret!=undefined)
			return(ret);

		/* Get input */
		var key=console.getkey(K_UPPER);
		switch(key) {
			case KEY_UP:
				if(this.direction==0) {
					do {
						if(this.current==0)
							this.current=this.items.length;
						this.current--;
					} while(this.items[this.current].retval==undefined);
				}
				break;
			case KEY_DOWN:
				if(this.direction==0) {
					do {
						this.current++;
						if(this.current==this.items.length)
							this.current=0;
					} while(this.items[this.current].retval==undefined);
				}
				break;
			case KEY_LEFT:
				if(this.direction==1) {
					do {
						if(this.current==0)
							this.current=this.items.length;
						this.current--;
					} while(this.items[this.current].retval==undefined);
				}
				break;
			case KEY_RIGHT:
				if(this.direction==1) {
					do {
						this.current++;
						if(this.current==this.items.length)
							this.current=0;
					} while(this.items[this.current].retval==undefined);
				}
				break;
			case KEY_HOME:
				this.current=0;
				while(this.items[this.current].retval==undefined) {
					this.current++;
					if(this.current==this.items.length)
						this.current=0;
				}
				break;
			case KEY_END:
				this.current=this.items.length-1;
				while(this.items[this.current].retval==undefined) {
					if(this.current==0)
						this.current=this.items.length;
					this.current--;
				}
				break;
			case '\r':
			case '\n':
				if(this.items[this.current].retval==undefined)
					return(undefined);
				return(this.items[this.current].retval);
				break;
			default:
				for(i=0; i<this.items.length; i++) {
					if(this.items[i].text.indexOf('|'+key)!=-1) {
						if(this.items[i].retval==undefined)
							continue;
						this.current=i;
						/* Let it go through once more to highlight */
						ret=this.items[this.current].retval;
						break;
					}
				}
				break;
		}
	}
}
