// mailproc_util.js

// Utility functions for Synchronet external mail processors

// $Id: mailproc_util.js,v 1.3 2003/10/23 00:10:29 rswindell Exp $

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