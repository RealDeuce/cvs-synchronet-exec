// mailproc_util.js

// Utility functions for Synchronet external mail processors

// $Id: mailproc_util.js,v 1.4 2004/04/02 12:37:10 rswindell Exp $

// Parses raw RFC822-formatted messages for use with SMTP Mail Processors
// Returns an array of header fields parsed from the msgtxt
// msgtxt is an array of lines from the source (RFC822) message text
function parse_msg_header(msgtxt)
{
	var last_field;
	var hdr={};

	for(i in msgtxt) {
		if(msgtxt[i].length==0)	// Header terminator
			break;
		var match = msgtxt[i].match(/(\S+)\s*:\s*(.*)/);
		if(match)
			hdr[last_field=match[1].toLowerCase()]=match[2];
		else if(last_field)		// Folded header field
			hdr[last_field]+=msgtxt[i];
	}	
		
	return(hdr);
}

function get_msg_body(msgtxt)
{
	var body = new Array();
	var hdr = true;

	for(i in msgtxt) {
		if(msgtxt[i].length==0)	{ // Header terminator
			hdr = false;
			continue;
		}
		if(!hdr)
			body.push(msgtxt[i]);
	}
	return(body);
}
		