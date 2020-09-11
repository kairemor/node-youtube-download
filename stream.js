//lets capture the video id
function getID(url) {
	var id = ''
	//if url is given
	if (url.includes('=')) {
		id = url.split('=')[1];
	}

	return id;
}
//let download the video
function download(response, req, qs, url) {
	var id = getID(url);
	//if id is not given
	if (id == '') {
		return 0;
	}
	// "http://youtube.com/get_video_info?video_id=
	//request youtube to give us video info
	req.get("http://youtube.com/get_video_info?video_id=" + id, function (err, resp2, body) {
		//ensure everything went well
		if (!err) {
			var data = qs.parse(body);
			var streams = data['url_encoded_fmt_stream_map'];
			streams = streams.split(',');
			for (var i in streams) {
				var stream = streams[i];
				var dt = qs.parse(stream);
				var type = dt['type'];
				var quality = dt['quality'];
				//check the video type and quality we want, in this case MP4 and medium quality
				if (type.includes('video/mp4') && quality.includes('medium')) {
					//video link
					var link = dt['url'];
					//request video stream from youtube
					stream = req.get(link);
					//video name
					var title = 'downloadVideo.mp4';
					//stream video to client as a download
					response.writeHead(200, {
						'Content-Type': 'application/octet-stream',
						'Content-Disposition': 'attachment;filename=' + title
					});
					stream.pipe(response);
				}
			}
		}
	});
}

module.exports.download = download;