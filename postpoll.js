// $Id: postpoll.js,v 1.6 2017/07/17 22:58:04 rswindell Exp $

load('sbbsdefs.js');

var i;
var basecode;
var option = [];

for(i in argv) {
    if(argv[i].charAt(0) != '-') {
        if(!basecode)
                basecode = argv[i];
		continue;
	}
	var arg = argv[i].slice(1).toLowerCase();
	var val = true
	var eq = arg.indexOf('=');

	if(eq > 0) {
		val = arg.substring(eq+1);
		arg = arg.substring(0,eq);
	}
	option[arg] = val;
}

if(!basecode && js.global.bbs)
	basecode = bbs.cursub_code;

while(!basecode)
        basecode = prompt("message base");

if(msg_area.sub[basecode.toLowerCase()].settings&SUB_NOVOTING) {
	alert("No voting allowed in sub-board: " + basecode);
	exit();
}
var msgbase = MsgBase(basecode);
if(!msgbase.open()) {
        alert("Error " + msgbase.last_error + " opening " + basecode);
        exit();
}

print("Posting Poll to sub-board: " + basecode);

var poll = { field_list: [] };
if(!(poll.subject = prompt("Poll question")))
	exit();

var comment;
while(comment = prompt("Comment [done]")) poll.field_list.push({ type: SMB_COMMENT, data: comment});

var count=0;
var answer;
while(count < MSG_POLL_MAX_ANSWERS && (answer = prompt("Answer "+ (++count) + " [done]")))
	poll.field_list.push({ type: SMB_POLL_ANSWER, data: answer});

print();
print("Results Visibility:");
print("0 = voters only (and pollster)");
print("1 = everyone always");
print("2 = everyone once poll is closed (and pollster)");
print("3 = pollster only");
var results = parseInt(prompt("Results"));
poll.auxattr = results << 30;
if(js.global.bbs) {
	poll.from = user.alias;
	poll.from_ext = user.number;
} else {
	poll.from = system.operator;
	poll.from_ext = 1;
}
if(option["votes"])
	poll.votes = option["votes"];
print("posted from: " + poll.from);
poll.to = "All";
if(!msgbase.add_poll(poll))
	alert("Error " + msgbase.status + " " + msgbase.last_error);
