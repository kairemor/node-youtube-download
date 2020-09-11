http = require("http");
stream = require("./stream");
req = require('request');
qs = require('querystring');
//variable to store home page as string
homepage = "<html>\
		<body>\
		<form method='post'>\
		<input name=url2 id=url2 placeholder='Paste Youtube Video link'></input>\
		<input type=submit value='Download'></input>\
		</form>\
		</body> \
		</html>\
		";
//what do when server is requested
function onRequest(request, response) {
	//let check what kind of response the client is giving
	switch (request.method) {
		//if client is requesting  for file
		case "GET":
			//we shall respond with home page
			response.writeHead(200, {
				'Content-Type': "text/html"
			});
			response.write(homepage);
			break;
			//if client is sending data
		case "POST":
			console.log(request)
			//we shall respond with download if url is correct
			var body = '';
			request.on('data', function (data) {
				//start receiving data from client in chunks
				body += data;
			});
			request.on('end', function (data) {
				//after all data is sent to server
				var obj = qs.parse(body);
				var url = obj.url2;
				if (url.includes('youtube') && url.includes('http')) {
					stream.download(response, req, qs, url);
				} else {
					//we shall respond with home page
					response.writeHead(200, {
						'Content-Type': "text/html"
					});
					response.write(homepage);

				}
			});
			break;

		default:
			//we shall respond with home page
			response.write(200, {
				'Content-Type': "text/html"
			});
			response.write(homepage);

	}


}
//create server on port 8000
http.createServer(onRequest).listen(8000);