/* $Id: frame.js,v 1.18 2011/10/19 19:34:03 mcmlxxix Exp $ */
/**
 	Javascript Frame Library 					
 	for Synchronet v3.15a+ 
 	by Matt Johnson (2011)	

DESCRIPTION:

 	this library is meant to be used in conjunction with other libraries that
 	store display data in a Frame() object or objects
 	this allows for "windows" that can be hidden and closed without 
 	destroying the data behind them.

 	the object itself takes the following parameters:

 		x: 			the coordinate representing the top left corner of the frame (horiz)
 		y: 			the coordinate representing the top left corner of the frame (vert)
 		width: 		the horizontal width of the frame 
 		height: 	the vertical height of the frame
 		attr:		the background color of the frame (displayed when there are no other contents)
		frame:		a frame object representing the parent of the new frame
		
METHODS:

	frame.open()				//populate frame contents in character canvas
	frame.close()				//remove frame contents from character canvas
	frame.draw()				//force a screen update on the frame and it's children
	frame.cycle()				//check the display matrix for updated characters and displays them 
	frame.load(filename)		//load a binary graphic (.BIN) or ANSI graphic (.ANS) file
	frame.bottom()				//push frame to bottom of display stack
	frame.top()					//pull frame to top of display stack
	frame.scroll(x,y)			//scroll frame n spaces in any direction
	frame.scrollTo(x,y)			//scroll frame to absolute offset
	frame.move(x,y)				//move frame n spaces in any direction
	frame.moveTo(x,y)			//move frame to absolute position
	frame.clearline(attr)		//see http://synchro.net/docs/jsobjs.html#console
	frame.cleartoeol(attr)
	frame.putmsg(str)
	frame.clear(attr)
	frame.home()
	frame.center(str)
	frame.crlf()
	frame.getxy()
	frame.gotoxy(x,y)
	frame.pushxy()
	frame.popxy()
	
PROPERTIES:

	frame.x						//x screen position
	frame.y						//y screen position
	frame.width					//frame width
	frame.height				//frame height
	frame.attr					//default attributes for frame
	frame.checkbounds			//toggle true/false to restrict/allow frame movement outside display

USAGE:

	//create a new frame object at screen position 1,1. 80 characters wide by 24 tall
	var frame = load("frame.js",1,1,80,24,BG_BLUE);
	
 	//or it can be done this way.....
 	load("frame.js");
 	var frame = new Frame(1,1,80,24,BG_BLUE);
	
	//add frame to the display canvas
	frame.open();
 
	//add a new frame within the frame object that will display on top at position 10,10
	var subframe = new Frame(10,10,10,10,BG_GREEN,frame);
	
	//add subframe to the display canvas
	subframe.open();
	
	//place cursor at position x:5 y:5 relative to subframe's coordinates
	subframe.gotoxy(5,5);

	//beware this sample infinite loop
 	while(!js.terminated) { 
		//print a message into subframe
		subframe.putmsg("1");
		
		//on first call this will draw the entire initial frame, 
		//as triggered by the open() method call.
		//on subsequent calls this will draw only areas that have changed
		frame.cycle();
		//NOTE: if frames are linked, only one frame needs to be cycled
		//		for all frames to update
	}
	
	//close out the entire frame tree
	frame.close();
	
 */
 
load("sbbsdefs.js");

function Frame(x,y,width,height,attr,frame) {

	/* object containing data matrix and frame pointer */
	function Canvas(frame,display) {
		this.frame = frame;
		this.display = display;
		this.__defineGetter__("xoff",function() {
			return this.frame.x - this.display.x;
		});
		this.__defineGetter__("yoff",function() {
			return this.frame.y - this.display.y;
		});
		this.hasData = function(x,y) {
			if(x-this.xoff < 0 || y - this.yoff < 0)
				return undefined;
			if(x-this.xoff >= this.frame.width || y - this.yoff >= this.frame.height)
				return undefined;
			return true;
		}
	}
	
	/* object representing screen positional and dimensional limits and canvas stack */
	function Display(x,y,width,height) {
		/* private properties */
		var properties = {
			x:undefined,
			y:undefined,
			width:undefined,
			height:undefined,
			canvas:{},
			update:{}
		}

		/* protected properties */
		this.__defineGetter__("x", function() {
			return properties.x;
		});
		this.__defineSetter__("x", function(x) {
			if(x == undefined)
				properties.x = 1;
			else if(isNaN(x))
				throw("invalid x coordinate: " + x);
			else 
				properties.x = x;
		});
		this.__defineGetter__("y", function() {
			return properties.y;
		});
		this.__defineSetter__("y", function(y) {
			if(y == undefined)
				properties.y = 1;
			else if(isNaN(y) || y < 1 || y > console.screen_rows)
				throw("invalid y coordinate: " + y);
			else 
				properties.y = y;
		});
		this.__defineGetter__("width", function() {
			return properties.width;
		});
		this.__defineSetter__("width", function(width) {
			if(width == undefined)
				properties.width = console.screen_columns;
			else if(isNaN(width) || (x + width - 1) > (console.screen_columns))
				throw("invalid width: " + width);
			else 
				properties.width = width;
		});
		this.__defineGetter__("height", function() {
			return properties.height;
		});
		this.__defineSetter__("height", function(height) {
			if(height == undefined)
				properties.height = console.screen_rows;
			else if(isNaN(height) || (y + height - 1) > (console.screen_rows))
				throw("invalid height: " + height);
			else
				properties.height = height;
		});
		
		/* public methods */
		this.cycle = function() {
			var updates = getUpdateList();
			if(updates.length > 0) {
				var lasty = undefined;
				var lastx = undefined;
				var lastid = undefined;
				for each(var u in updates) {
					var posx = u.x + properties.x;
					var posy = u.y + properties.y;
					if(posx < 1 ||  posy < 1 || posx > console.screen_columns 
						|| posy > console.screen_rows)
						continue;
					if(lasty !== u.y || lastx == undefined || (u.x - lastx) != 1)
						console.gotoxy(posx,posy);
					if(lastid !== u.id)
						console.attributes = undefined;
					drawChar(u.ch,u.attr,posx,posy);
					lastx = u.x;
					lasty = u.y;
					lastid = u.id;
				}
				properties.update = {};
				console.attributes=undefined;
				return true;
			}
			return false;
 		}
		this.draw = function() {
			for(var y = 0;y<this.height;y++) {
				for(var x = 0;x<this.width;x++) {
					updateChar(x,y);
				}
			}
			this.cycle();
		}
		this.open = function(frame) {
			var canvas = new Canvas(frame,this);
			properties.canvas[frame.id] = canvas;
			this.updateFrame(frame);
		}
		this.close = function(frame) {
			this.updateFrame(frame);
			delete properties.canvas[frame.id];
		}
		this.top = function(frame) {
			var canvas = properties.canvas[frame.id];
			delete properties.canvas[frame.id];
			properties.canvas[frame.id] = canvas;
			this.updateFrame(frame);
		}
		this.bottom = function(frame) {
			for(var c in properties.canvas) {
				if(c == frame.id)
					continue;
				var canvas = properties.canvas[c];
				delete properties.canvas[c];
				properties.canvas[c] = canvas;
			}
			this.updateFrame(frame);
		}
		this.updateFrame = function(frame) {
			var xoff = frame.x - this.x;
			var yoff = frame.y - this.y;
			for(var y = 0;y<frame.height;y++) {
				for(var x = 0;x<frame.width;x++) {
					updateChar(xoff + x,yoff + y);
				}
			}
		}
		this.updateChar = function(frame,x,y) {
			var xoff = frame.x - this.x;
			var yoff = frame.y - this.y;
			updateChar(xoff + x,yoff + y);
		}
				
		/* private functions */
		function updateChar(x,y) {
			if(!properties.update[y])
				properties.update[y] = {};
			properties.update[y][x] = 1;
		}
		function getUpdateList() {
			var list = [];
			for(var y in properties.update) {
				for(var x in properties.update[y]) {
					var c = getTopCanvas(x,y);
					list.push(getData(c,x,y));
				}
			}
			return list.sort(updateSort);
		}
		function getData(c,x,y) {
			var d = {};
			if(c) {
				d = c.frame.getData(x-c.xoff,y-c.yoff);
				if(!d.attr)
					d.attr = c.frame.attr;
				d.id = c.frame.id;
			}
			d.x = Number(x);
			d.y = Number(y);
			return d;
		}
		function updateSort(a,b) {
			if(a.y == b.y)
				return a.x-b.x;
			return a.y-b.y;
		}
		function drawChar(ch,attr,xpos,ypos) {
			if(attr)
				console.attributes = attr;
			if(xpos == console.screen_columns && ypos == console.screen_rows) 
				console.cleartoeol();
			else if(ch == undefined)
				console.write(" ");
			else 
				console.write(ch);
		}
		function getTopCanvas(x,y) {
			var top = undefined;
			for each(var c in properties.canvas) {
				if(c.hasData(x,y))
					top = c;
			}
			return top;
		}

		/* initialize display properties */
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		log(LOG_DEBUG,format("new display initialized: %sx%s at %s,%s",this.width,this.height,this.x,this.y));
	}
	
	/* character/attribute pair representing a screen position and its contents */
	function Char(ch,attr) {
		this.ch = ch;
		this.attr = attr;
	}
	
	/* private properties */
	var properties = {
		x:undefined,
		y:undefined,
		width:undefined,
		height:undefined,
		attr:undefined,
		display:undefined,
		data:[],
		id:0
	}
	var relations = {
		parent:undefined,
		child:[]
	}
	var position = {
		cursor:{x:0,y:0},
		offset:{x:0,y:0},
		stored:{x:0,y:0},
		checkbounds:true
	}
		
	/* protected properties */
	this.__defineGetter__("id", function() {
		if(relations.parent)
			return relations.parent.id+""+properties.id;
		return properties.id;
	});
	this.__defineGetter__("parent", function() {
		return relations.parent;
	});
	this.__defineGetter__("child", function() {
		return relations.child;
	});
	this.__defineSetter__("child", function(frame) {
		relations.child.push(frame);
	});
	this.__defineGetter__("display", function() {
		return properties.display;
	});
	this.__defineGetter__("attr", function() {
		return properties.attr;
	});
	this.__defineSetter__("attr", function(attr) {
		properties.attr = attr;
	});
	this.__defineGetter__("name", function() {
		return properties.name;
	});
	this.__defineSetter__("name", function(name) {
		properties.name = name;
	});
	this.__defineGetter__("x", function() { 
		if(properties.x == undefined)
			return properties.display.x; 
		return properties.x;
	});
	this.__defineSetter__("x", function(x) {
		if(x == undefined)
			return;
		if(!checkX(x))
			throw("invalid x coordinate: " + x);
		properties.x = x;
	});
	this.__defineGetter__("y", function() { 
		if(properties.y == undefined)
			return properties.display.y; 
		return properties.y;
	});
	this.__defineSetter__("y", function(y) {
		if(y == undefined)
			return;
		if(!checkY(y))
			throw("invalid y coordinate: " + y);
		properties.y = y;
	});
	this.__defineGetter__("width", function() {
		if(properties.width == undefined)
			return properties.display.width;
		return properties.width;
	});
	this.__defineSetter__("width", function(width) {
		if(width == undefined)
			return;
		if(!checkWidth(this.x,width))
			throw("invalid width: " + width);
		properties.width = width;
	});
	this.__defineGetter__("height", function() {
		if(properties.height == undefined)
			return properties.display.height;
		return properties.height;
	});
	this.__defineSetter__("height", function(height) {
		if(height == undefined)
			return;
		if(!checkHeight(this.y,height))
			throw("invalid height: " + height);
		properties.height = height;
	});
	this.__defineGetter__("checkbounds", function() {
		return position.checkbounds;
	});
	this.__defineSetter__("checkbounds", function(bool) {
		if(typeof bool == "boolean")
			position.checkbounds=bool;
	});

	/* public methods */
	this.getData = function(x,y) {
		return properties.data[x + position.offset.x][y + position.offset.y];
	}
	this.setData = function(x,y,ch,attr) {
		if(ch)
			properties.data[x + position.offset.x][y + position.offset.y].ch = ch;
		if(attr)
			properties.data[x + position.offset.x][y + position.offset.y].attr = attr;
	}
	this.bottom = function() {
		for each(var c in relations.child) 
			c.bottom();
		properties.display.bottom(this);
	}
	this.top = function() {
		properties.display.top(this);
		for each(var c in relations.child) 
			c.top();
	}
	this.open = function() {
		properties.display.open(this);
		for each(var c in relations.child) 
			c.open();
	}
	this.refresh = function() {
		properties.display.updateFrame(this);
		for each(var c in relations.child) 
			c.refresh();
	}
	this.close = function() {
		for each(var c in relations.child) 
			c.close();
		properties.display.close(this);
	}
	this.move = function(x,y) {
		var nx = undefined;
		var ny = undefined;
		if(checkX(this.x+x) && checkWidth(this.x+x,this.width))
			nx = this.x+x;
		if(checkY(this.y+y) && checkHeight(this.y+y,this.height))
			ny = this.y+y;
		if(nx == undefined && ny == undefined)
			return;
		properties.display.updateFrame(this);
		if(nx !== undefined)
			this.x=nx;
		if(ny !== undefined)
			this.y=ny;
		properties.display.updateFrame(this);
		for each(var c in relations.child) 
			c.move(x,y);
	}
	this.moveTo = function(x,y) {
		var nx = undefined;
		var ny = undefined;
		if(checkX(x))
			nx = x;
		if(checkY(y))
			ny = y;
		if(nx == undefined && ny == undefined)
			return;
		properties.display.updateFrame(this);
		if(nx !== undefined)
			this.x=nx;
		if(ny !== undefined)
			this.y=ny;
		properties.display.updateFrame(this);
		for each(var c in relations.child) 
			c.moveTo(x + (c.x - this.x), y + (c.y - this.y));
	}
	this.draw = function() {
		this.refresh();
		this.cycle();
	}
	this.cycle = function() {
		return properties.display.cycle();
	}
	this.load = function(filename,width,height) {
		var f=new File(filename);
		switch(file_getext(filename).substr(1).toUpperCase()) {
		case "ANS":
			if(!(f.open("r",true,4096)))
				return(false);
			var lines=f.readAll(4096);
			f.close();
			var attr = this.attr;
			var bg = BG_BLACK;
			var fg = LIGHTGRAY;
			var i = 0;

			var y = 0;
			while(lines.length > 0) {	
				var x = 0;
				var line = lines.shift();
				while(line.length > 0) {
					/* check line status */
					if(x >= this.width) {
						x = 0;
						y++;
					}
					/* parse an attribute sequence*/
					var m = line.match(/^\x1b\[(\d+);?(\d*);?(\d*)m/);
					if(m !== null) {
						line = line.substr(m.shift().length);
						if(m[0] == 0) {
							bg = BG_BLACK;
							fg = LIGHTGRAY;
							i = 0;
							m.shift();
						}
						if(m[0] == 1) {
							i = HIGH;
							m.shift();
						}
						if(m[0] >= 40) {
							switch(Number(m.shift())) {
							case 40:
								bg = BG_BLACK;
								break;
							case 41:
								bg = BG_RED;
								break;
							case 42: 
								bg = BG_GREEN;
								break;
							case 43:
								bg = BG_BROWN;
								break;
							case 44:
								bg = BG_BLUE;
								break;
							case 45:
								bg = BG_MAGENTA;
								break;
							case 46:
								bg = BG_CYAN;
								break;
							case 47:
								bg = BG_LIGHTGRAY;
								break;
							}
						}
						if(m[0] >= 30) {
							switch(Number(m.shift())) {
							case 30:
								fg = BLACK;
								break;
							case 31:
								fg = RED;
								break;
							case 32:
								fg = GREEN;
								break;
							case 33:
								fg = BROWN;
								break;
							case 34:
								fg = BLUE;
								break;
							case 35:
								fg = MAGENTA;
								break;
							case 36:
								fg = CYAN;
								break;
							case 37:
								fg = LIGHTGRAY;
								break;
							}
						}
						attr = bg + fg + i;
						continue;
					}
					/* parse a positional sequence */
					var n = line.match(/^\x1b\[(\d+)C/);
					if(n !== null) {
						line = line.substr(n.shift().length);
						x+=Number(n.shift());
						continue;
					}
					/* set character and attribute */
					var ch = line[0];
					line = line.substr(1);
					if(!properties.data[x])
						properties.data[x]=[];
					properties.data[x][y]=new Char(ch,attr);
					x++;
				}
				y++;
			}
			this.open();
			break;
		case "BIN":
			if(width == undefined || height == undefined)
				throw("unknown graphic dimensions");
			if(!(f.open("rb",true,4096)))
				return(false);
			for(var y=0; y<height; y++) {
				for(var x=0; x<width; x++) {
					var c = new Char();
					if(f.eof)
						return(false);
					c.ch = f.read(1);
					if(f.eof)
						return(false);
					c.attr = f.readBin(1);
					c.id = this.id;
					if(!properties.data[x])
						properties.data[x]=[];
					properties.data[x][y] = c;
				}
			}
			f.close();
			this.open();
			break;
		default:
			throw("unsupported filetype");
			break;
		}
	}
	this.scroll = function(x,y) {
		/* default: add a new line to the data matrix */
		if(x == undefined && y == undefined) {
			for(var x = 0;x<this.width;x++) {
				for(var y = 0;y<this.height;y++) 
					properties.display.updateChar(this,x,y);
				properties.data[x].push(new Char());
			}
			position.offset.y++;
		}
		/* otherwise, adjust the x/y offset */
		else {
			if(typeof x == "number")
				position.offset.x += x;
			if(typeof y == "number")
				position.offset.y += y;
			if(position.offset.x < 0)
				position.offset.x = 0;
			else if(position.offset.x + this.width > properties.data.length)
				position.offset.x = properties.data.length - this.width;
			if(position.offset.y < 0)
				position.offset.y = 0;
			else if(position.offset.y + this.height > properties.data[0].length)
				position.offset.y = properties.data[0].length - this.height;
		}
	}
	this.scrollTo = function(x,y) {
		if(typeof x == "number")
			position.offset.x = x;
		if(typeof y == "number")
			position.offset.y = y;
		if(position.offset.x < 0)
			position.offset.x = 0;
		else if(position.offset.x + this.width > properties.data.length)
			position.offset.x = properties.data.length - this.width;
		if(position.offset.y < 0)
			position.offset.y = 0;
		else if(position.offset.y + this.height > properties.data[0].length)
			position.offset.y = properties.data[0].length - this.height;
	}

	/* console method emulation */
	this.home = function() {
		position.cursor.x = 0;
		position.cursor.y = 0;
	}
	this.clear = function(attr) {
		if(attr != undefined)
			this.attr = attr;
		for(var x = 0;x<this.width;x++) {
			for(var y = 0;y<this.height;y++) {
				properties.data[x][y].ch = undefined;
				properties.data[x][y].attr = this.attr;
				properties.display.updateChar(this,x,y);
			}
		}
		this.home();
	}
	this.clearline = function(attr) {
		if(attr == undefined)
			attr = this.attr;
		for(var x = 0;x<this.width;x++) {
			properties.display.updateChar(this,x,y);
			properties.data[x][y].ch = undefined;
			properties.data[x][y].attr = attr;
		}
	}
	this.cleartoeol = function(attr) {
		if(attr == undefined)
			attr = this.attr;
		for(var x = position.cursor.x;x<this.width;x++) {
			properties.display.updateChar(this,x,y);
			properties.data[x][y].ch = undefined;
			properties.data[x][y].attr = attr;
		}
	}
	this.crlf = function() {
		position.cursor.x = 0;
		if(position.cursor.y < this.height-1) 
			position.cursor.y += 1;
		else {}
	}
	this.putmsg = function(str) {
		str = str.toString().split('');
		var control_a = false;
		var curattr = this.attr;
		var pos = position.cursor;

		while(str.length > 0) {
			var ch = str.shift();
			if(control_a) {
				var k = ch;
				if(k)
					k = k.toUpperCase();
				switch(k) {
				case '\1':	/* A "real" ^A code */
					putChar.call(this,ch,curattr);
					pos.x++;
					break;
				case 'K':	/* Black */
					curattr=(curattr)&0xf8;
					break;
				case 'R':	/* Red */
					curattr=((curattr)&0xf8)|RED;
					break;
				case 'G':	/* Green */
					curattr=((curattr)&0xf8)|GREEN;
					break;
				case 'Y':	/* Yellow */
					curattr=((curattr)&0xf8)|BROWN;
					break;
				case 'B':	/* Blue */
					curattr=((curattr)&0xf8)|BLUE;
					break;
				case 'M':	/* Magenta */
					curattr=((curattr)&0xf8)|MAGENTA;
					break;
				case 'C':	/* Cyan */
					curattr=((curattr)&0xf8)|CYAN;
					break;
				case 'W':	/* White */
					curattr=((curattr)&0xf8)|LIGHTGRAY;
					break;
				case '0':	/* Black */
					curattr=(curattr)&0x8f;
					break;
				case '1':	/* Red */
					curattr=((curattr)&0x8f)|(RED<<4);
					break;
				case '2':	/* Green */
					curattr=((curattr)&0x8f)|(GREEN<<4);
					break;
				case '3':	/* Yellow */
					curattr=((curattr)&0x8f)|(BROWN<<4);
					break;
				case '4':	/* Blue */
					curattr=((curattr)&0x8f)|(BLUE<<4);
					break;
				case '5':	/* Magenta */
					curattr=((curattr)&0x8f)|(MAGENTA<<4);
					break;
				case '6':	/* Cyan */
					curattr=((curattr)&0x8f)|(CYAN<<4);
					break;
				case '7':	/* White */
					curattr=((curattr)&0x8f)|(LIGHTGRAY<<4);
					break;
				case 'H':	/* High Intensity */
					curattr|=HIGH;
					break;
				case 'I':	/* Blink */
					curattr|=BLINK;
					break;
				case 'N':	/* Normal (ToDo: Does this do ESC[0?) */
					curattr=this.attr;
					break;
				case '-':	/* Normal if High, Blink, or BG */
					if(curattr & 0xf8)
						curattr=this.attr;
					break;
				case '_':	/* Normal if blink/background */
					if(curattr & 0xf0)
						curattr=this.attr;
					break;
				case '[':	/* CR */
					pos.x=0;
					break;
				case ']':	/* LF */
					pos.y++;
					break;
				default:	/* Other stuff... specifically, check for right movement */
					if(ch.charCodeAt(0)>127) {
						pos.x+=ch.charCodeAt(0)-127;
						if(pos.x>=this.width)
							pos.x=this.width-1;
					}
					break;
				}
				control_a = false;
			}
			else {
				switch(ch) {
				case '\1':		/* CTRL-A code */
					control_a = true;
					break;
				case '\7':		/* Beep */
					break;
				case '\r':
					pos.x=0;
					break;
				case '\n':
					pos.y++;
					break;
				default:
					putChar.call(this,ch,curattr);
					pos.x++;
					break;
				}
			}
		}
	}
	this.center = function(str) {
		position.cursor.x = Math.ceil(this.width/2) - Math.ceil(console.strlen(strip_ctrl(str))/2);
		if(position.cursor.x < 0)
			position.cursor.x = 0;
		this.putmsg(str);
	}
	this.gotoxy = function(x,y) {
		if(typeof x == "object" && x.x && x.y) {
			position.cursor.x = x.x-1;
			position.cursor.y = x.y-1;
			return;
		}
		if(x <= this.width)
			position.cursor.x = x-1;
		if(y <= this.height)
			position.cursor.y = y-1;
	}
	this.getxy = function() {
		var xy = {
			x:position.cursor.x+1,
			y:position.cursor.y+1
		}
		return xy;
	}
	this.pushxy = function() {
		position.stored.x = position.cursor.x;
		position.stored.y = position.cursor.y;
	}
	this.popxy = function() {
		position.cursor.x = position.stored.x;
		position.cursor.y = position.stored.y;
	}
	
	/* private functions */
	function checkX(x) {
		if(	isNaN(x) || (position.checkbounds &&  
			(x > properties.display.x + properties.display.width || 
			x < properties.display.x)))
			return false;
		return true;
	}
	function checkY(y) {
		if( isNaN(y) || (position.checkbounds && 
			(y > properties.display.y + properties.display.height || 
			y < properties.display.y)))
			return false;
		return true;
	}
	function checkWidth(x,width) {
		if(	width < 1 || isNaN(width) || (position.checkbounds && 
			x + width > properties.display.x + properties.display.width))
			return false;
		return true;
	}
	function checkHeight(y,height) {
		if( height < 1 || isNaN(height) || (position.checkbounds && 
			y + height > properties.display.y + properties.display.height))
			return false;
		return true;
	}
	function putChar(ch,attr) {
		if(position.cursor.x >= this.width) {
			position.cursor.x=0;
			position.cursor.y++;
		}
		if(position.cursor.y >= this.height) {	
			this.scroll();
			position.cursor.y--;
		}
		if(ch)
			properties.data
			[position.cursor.x + position.offset.x]
			[position.cursor.y + position.offset.y].ch = ch;
		if(attr)
			properties.data
			[position.cursor.x + position.offset.x]
			[position.cursor.y + position.offset.y].attr = attr;
		properties.display.updateChar(this,position.cursor.x,position.cursor.y);
	}
	function init(x,y,width,height,attr,frame) {
		if(frame instanceof Frame) {
			properties.id = frame.child.length;
			properties.display = frame.display;
			position.checkbounds = frame.checkbounds;
			relations.parent = frame;
			frame.child = this;
		}
		else {
			properties.display = new Display(x,y,width,height);
		}

		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.attr = attr;
		
		for(var w=0;w<this.width;w++) {
			properties.data.push(new Array(this.height));
			for(var h=0;h<this.height;h++) {
				properties.data[w][h] = new Char();
			}
		}
		//log(LOG_DEBUG,format("new frame initialized: %sx%s at %s,%s",this.width,this.height,this.x,this.y));
	}
	init.apply(this,arguments);
}

if(argc >= 4)
	frame = new Frame(argv[0],argv[1],argv[2],argv[3],argv[4],argv[5]);
