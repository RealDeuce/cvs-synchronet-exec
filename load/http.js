/* $Id: http.js,v 1.30 2017/01/13 19:51:10 echicken Exp $ */

require('sockdefs.js', 'SOCK_STREAM');
require('url.js', 'URL');

/*
 * TODO Stuff:
 *	Asynchronous requests
 *	Keep-alive support
 *	HTTP/1.1 (chunked, trailers, etc)
 *	Parse response headers
 */

function HTTPRequest(username,password,extra_headers)
{
	/* request properties */
	this.request_headers;
	this.referer;
	this.base;
	this.url;
	this.body;
	
	this.username=username;
	this.password=password;

	this.AddDefaultHeaders=function(){
		// General Headers
		this.request_headers.push("Connection: close");
		if(js.global.client != undefined)
			this.request_headers.push(
				"Via: "+client.protocol.toString().toLowerCase()+"/1.0 "+system.name);
		// Request Headers
		//this.request_headers.push("Accept: text/html,application/xhtml+xml,application/xml,text/*,*/*;q=0.9,*/*;q=0.8;q=0.7;q=0.6");
		this.request_headers.push("Accept: text/*,*/*;q=0.9");
		this.request_headers.push(
			"Accept-Charset: ISO-8859-13,Latin-9,ISO-8859-15,ISO-8859-1,UTF-8;q=0.5,*;q=0.1");
		this.request_headers.push("Accept-Encoding: ");
		this.request_headers.push("Host: "+this.url.host);
		if(this.referer != undefined)
			this.request_headers.push("Referer: "+this.referer);
		this.request_headers.push("User-Agent: SYNXv0.1");
	};

	this.AddExtraHeaders = function () {
		if (typeof extra_headers !== 'object') return;
		var self = this;
		Object.keys(extra_headers).forEach(
			function (e) {
				self.request_headers.push(e + ': ' + extra_headers[e]);
			}
		);
	}

	this.SetupGet=function(url, referer, base) {
		this.referer=referer;
		this.base=base;
		this.url=new URL(url, this.base);
		if(this.url.scheme!='http' && this.url.scheme!='https')
			throw("Unknown scheme! '"+this.url.scheme+"'");
		if(this.url.path=='')
			this.url.path='/';
		if(this.url.query != '');
		this.request="GET "+this.url.request_path+" HTTP/1.0";
		this.request_headers=[];
		this.AddDefaultHeaders();
		this.AddExtraHeaders();
	};

	this.SetupPost=function(url, referer, base, data) {
		this.referer=referer;
		this.base=base;
		this.url=new URL(url, this.base);
		if(this.url.scheme!='http' && this.url.scheme!='https')
			throw("Unknown scheme! '"+this.url.scheme+"'");
		if(this.url.path=='')
			this.url.path='/';
		if(this.url.query != '');
		this.request="POST "+this.url.request_path+" HTTP/1.0";
		this.request_headers=[];
		this.AddDefaultHeaders();
		this.AddExtraHeaders();
		this.body=data;
		this.request_headers.push("Content-Type: application/x-www-form-urlencoded");
		this.request_headers.push("Content-Length: "+data.length);
	};

	this.SendRequest=function() {
		var i;

		function do_send(sock, str) {
			var sent = 0;
			var ret;

			while (sent < str.length) {
				sock.poll(60, true);
				ret = sock.send(str);
				if (ret === 0 || ret === null || ret === false)
					return false;
				if (ret === true)
					return true;
				sent += ret;
			}
			return true;
		}

		if((this.sock=new Socket(SOCK_STREAM))==null)
			throw("Unable to create socket");
		if(!this.sock.connect(this.url.host, this.url.port?this.url.port:(this.url.scheme=='http'?80:443))) {
			this.sock.close();
			throw("Unable to connect");
		}
		if(this.url.scheme=='https')
			this.sock.ssl_session=true;
		if(!do_send(this.sock, this.request+"\r\n"))
			throw("Unable to send request: " + this.request);
		for(i in this.request_headers) {
			if(!do_send(this.sock, this.request_headers[i]+"\r\n"))
				throw("Unable to send headers");
		}
		if(!do_send(this.sock, "\r\n"))
			throw("Unable to terminate headers");
		if(this.body != undefined) {
			if(!do_send(this.sock, this.body))
				throw("Unable to send body");
		}
	};

	this.ReadStatus=function() {
		this.status_line=this.sock.recvline(4096);
		if(this.status_line==null)
			throw("Unable to read status");
	};

	this.ReadHeaders=function() {
		var header='';
		var m;
		this.response_headers=[];

		for(;;) {
			header=this.sock.recvline(4096, 120);
			if(header==null)
				throw("Unable to receive headers");
			if(header=='')
				return;
			this.response_headers.push(header);
			m=header.match(/^Content-length:\s+([0-9]+)$/i);
			if(m!=null)
				this.contentlength=parseInt(m[1]);
		}
	};

	this.ReadBody=function() {
		var ch;
		var lastlen=0;
		var len=this.contentlength;
		if(len==undefined)
			len=1024;

		this.body='';
		while((ch=this.sock.recv(len))!=null && ch != '') {
			this.body += ch.toString();
			len -= ch.length;
			if(len < 1)
				len=1024;
			js.flatten_string(this.body);
		}
	};

	this.ReadResponse=function() {
		this.ReadStatus();
		this.ReadHeaders();
		this.ReadBody();
	};

	this.BasicAuth=function(username,password) {
		if(username && password) {
			this.username=username;
			this.password=password;
		}
		if(this.username && this.password) {
			var auth = base64_encode(this.username + ":" + this.password);
			this.request_headers.push("Authorization: Basic " + auth);
		}
	}
	
	this.Get=function(url, referer, base) {
		this.SetupGet(url,referer,base);
		this.BasicAuth();
		this.SendRequest();
		this.ReadResponse();
		return(this.body);
	};

	this.Post=function(url, data, referer, base) {
		this.SetupPost(url,referer,base,data);
		this.BasicAuth();
		this.SendRequest();
		this.ReadResponse();
		return(this.body);
	};

	this.Head=function(url, referer, base) {
		var i;
		var m;
		var ret={};

		this.SetupGet(url,referer,base);
		this.request = this.request.replace(/^GET/, 'HEAD');
		this.BasicAuth();
		this.SendRequest();
		this.ReadResponse();
		for(i in this.response_headers) {
			m = this.response_headers[i].match(/^(.*?):\s*(.*?)\s*$/);
			if (m) {
				if (ret[m[1]] == undefined)
					ret[m[1]] = [];
				ret[m[1]].push(m[2]);
			}
		}
		return(ret);
	};
}
