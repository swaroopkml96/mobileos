/*
TODO
- Snap ✅
- Exposure control
- Timer
- Brightness/Contrast
- Tint
- Face detection
*/
var ready = false;

let camera_brightness = 0;  // Range -255 to 255
let camera_contrast = 1;  // Range 0 to 128

class Slider {
	constructor(pos, width, height, background_color, fill_color, init_value, range) {
		this.pos = pos;
		this.width = width;
		this.height = height;
		this.background_color = color(background_color);
		this.fill_color = color(fill_color);
		this.value = init_value;
	}

	draw() {
		let fill_width = map(this.value, range[0], range[1], 0, this.width);
		stroke(0);
		fill(this.background_color);
		rect(this.pos.x, this.pos.y, this.width, this.height);
		fill(this.fill_color);
		rect(this.pos.x, this.pos.y, fill_width, this.height);
	}
}

function setup() {
	frameRate(10);
	createCanvas(windowWidth, windowHeight);

	function video_ready() {
		ready = true;
	}
	video = createCapture(VIDEO, video_ready);
	video.hide();

	snap_button_size = 80;
	snap_button_pos = createVector(
		m_width/2-snap_button_size/2,
		m_height-snap_button_size-snap_button_size/2
		);
	snap_button_action = function() {
		console.log("SNAP");
		save(video.get(), 'pic.jpg');
	}
	snap_button = new Button(
		'Snap',
		snap_button_pos,
		snap_button_size,
		snap_button_size,
		snap_button_action,
		'image',
		'assets/camera_snap.png',
		'assets/camera_snap_purple.png'
	);

	bc_button_size = 30;
	bc_button_pos = createVector(
		m_width/10,
		m_height/10
		);
	bc_button_action = function() {
		console.log("BC");
	}
	bc_button = new Button(
		'bc',
		bc_button_pos,
		bc_button_size,
		bc_button_size,
		bc_button_action,
		'image',
		'assets/bc.png',
		'assets/bc_inverted.png'
	);

	b_slider_pos = createVector(m_width/5, m_height/10);
	b_slider_width = m_width*3/5;
	b_slider_height = m_height/10;
	b_slider_bcolor = 'black';
	b_slider_fcolor = 'white';
	b_slider_init_value = 0;
	b_slider_range = [-255, 255];
	b_slider = new Slider(
		b_slider_pos,
		b_slider_width,
		b_slider_height,
		b_slider_bcolor,
		b_slider_fcolor,
		b_slider_init_value,
		b_slider_range
		);

	main_buttons = [snap_button, bc_button];
	main_sliders = [];

	bc_buttons = [];
	bc_sliders = [b_slider];

}

function draw() {
	background(255);
	draw_outline();

	if (ready) {
		//image(video, 0, 0, m_width, m_height);
		video.loadPixels();
		for (var h = 0; h < video.height; h++) {
			for (var w = 0; w < video.width; w++) {
				index = (w + h*video.width) * 4;
				let r = video.pixels[index];
				let g = video.pixels[index+1];
				let b = video.pixels[index+2];
	
				r = clamp((r-128)*camera_contrast+128+camera_brightness);
				g = clamp((g-128)*camera_contrast+128+camera_brightness);
				b = clamp((b-128)*camera_contrast+128+camera_brightness);

				video.pixels[index] = r;
				video.pixels[index+1] = g;
				video.pixels[index+2] = b;
			}
		}
		video.updatePixels();
		image(video, 0, 0, m_width, m_height);
	}

	for (var i = 0; i < main_buttons.length; i++) {
		main_buttons[i].draw();
	}
}

function mousePressed() {
	for (var i = 0; i < main_buttons.length; i++) {
		if (main_buttons[i].isin(mouseX, mouseY)) {
			main_buttons[i].click();
		}
	}
}

function clamp(x) {
	if (x < 0){
		return 0;
	}
	else if (x > 255) {
		return 255;
	}
	else {
		return x;
	}
}