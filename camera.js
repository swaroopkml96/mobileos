/*
TODO
- Snap
- Exposure control
- Timer
- Brightness/Contrast
- Tint
- Face detection
*/
var ready = false;

function setup() {
	frameRate(10);
	createCanvas(windowWidth, windowHeight);

	function video_ready() {
		ready = true;
	}
	video = createCapture(VIDEO, video_ready);
	video.hide();

	snap_button_size = 100;
	snap_button_pos = createVector(m_width/2, m_height-snap_button_size-snap_button_size/2);
	snap_button_action = function() {
		console.log("SNAP");
		save(video.get(), 'pic.jpg');
	}
	snap_button = new Button(
		'Snap',
		snap_button_pos,
		snap_button_size,
		snap_button_size,
		snap_button_action
	);

	buttons = [snap_button];

}

function draw() {
	background(255);
	draw_outline();

	if (ready) {
		//image(video, 0, 0, m_width, m_height);
		video.loadPixels();
		// for (var h = 0; h < video.height; h++) {
		// 	for (var w = 0; w < video.width; w++) {
		// 		index = (w + h*video.width) * 4;
		// 		video.pixels[index] = min(255, video.pixels[index]*2);
		// 		video.pixels[index+1] = min(255, video.pixels[index]*2);
		// 		video.pixels[index+2] = min(255, video.pixels[index]*2);
		// 	}
		// }
		video.updatePixels();
		image(video, 0, 0, m_width, m_height);
	}

	for (var i = 0; i < buttons.length; i++) {
		buttons[i].draw();
	}
}

function mousePressed() {
	for (var i = 0; i < buttons.length; i++) {
		if (buttons[i].isin(mouseX, mouseY)) {
			buttons[i].click();
		}
	}
}