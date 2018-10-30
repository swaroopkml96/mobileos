/*
TODO
- Snap ✅
- Filters ✅
- Timer ✅
- Brightness/Contrast ✅
- Tint ✅
- Face detection
*/
var ready = false;
var main_overlay;
var bc_overlay;
var tint_overlay;
var timer_overlay;
var active_overlay;

class CamStream {
	/*
	Sliders should be in this order:
	Index 	Name		Range
	0		Brightness 	0-255
	1		Contrast 	0-3
	2		Red tint 	0-255
	3		Green tint 	0-255
	4		Blue tint 	0-255
	5		B/W 		0-255		
	6		Solarize 	2-10
	
	Selectors should be in this order:
	Index 	Name
	0 		Gray
	1 		Invert
	*/
	constructor(pos, width, height, sliders, selectors) {
		this.pos = pos;
		this.width = width;
		this.height = height;
		this.sliders = sliders;
		this.selectors = selectors;
		this.ready = false;
		this.img = createImage(640, 480);

		let ready_callback = function() {
			ready = true;
		}
		this.video = createCapture(VIDEO, ready_callback);
		this.video.hide();
	}
	save_frame() {
		save(this.img, 'pic.jpg');
	}
	draw() {
		if (ready) {
			this.video.loadPixels();
			this.img.loadPixels();
			for (let h = 0; h < this.video.height; h++) {
				for (let w = 0; w < this.video.width; w++) {
					let index = (w + h*this.video.width) * 4;
					let r = this.video.pixels[index];
					let g = this.video.pixels[index+1];
					let b = this.video.pixels[index+2];
					let a = this.video.pixels[index+3];

					// Adjusting brightness and contrast
					if (this.sliders[0].is_custom() || this.sliders[1].is_custom()){
						r = clamp((r-128)*this.sliders[1].get()+128+this.sliders[0].get());
						g = clamp((g-128)*this.sliders[1].get()+128+this.sliders[0].get());
						b = clamp((b-128)*this.sliders[1].get()+128+this.sliders[0].get());
					}

					// Adjusting tint
					if (this.sliders[2].is_custom() || this.sliders[3].is_custom() || this.sliders[4].is_custom()) {
						r = r + this.sliders[2].get();
						g = g + this.sliders[3].get();
						b = b + this.sliders[4].get();
					}

					// Solarize
					if (this.sliders[6].is_custom()){
						let avg = (r+g+b)/3;
						let threshold = this.sliders[6].get();
						if (avg > threshold) {
							r = 255 - r;
							g = 255 - g;
							b = 255 - b;
						}
					}

					// Gray
					if (this.selectors[0].is_selected()) {
						let avg = (r+g+b)/3;
						r = avg;
						g = avg;
						b = avg;
					}

					// Black and white
					if (this.sliders[5].is_custom()){
						let threshold = this.sliders[5].get();
						let avg = (r+g+b)/3;
						if (avg > threshold) {
							r = 255;
							g = 255;
							b = 255;
						}
						else {
							r = 0;
							g = 0;
							b = 0;
						}
					}

					// Invert
					if (this.selectors[1].is_selected()) {
						r = 255 - r;
						g = 255 - g;
						b = 255 - b;
					}

					this.img.pixels[index] = r;
					this.img.pixels[index+1] = g;
					this.img.pixels[index+2] = b;
					this.img.pixels[index+3] = a;

				}
			}
			this.img.updatePixels();
			image(this.img, this.pos.x, this.pos.y, this.width, this.height);
		}
	}
};

class Overlay {
	constructor(pos, width, height, bcolor, textfields, buttons, sliders, selectors=[]) {
		this.pos = pos;
		this.width = width;
		this.height = height;
		this.bcolor = bcolor;
		this.textfields = textfields;
		this.buttons = buttons;
		this.sliders = sliders;
		this.selectors = selectors;
	}
	draw() {
		noStroke();
		fill(this.bcolor);
		rect(this.pos.x, this.pos.y, this.width, this.height);

		for (var i = 0; i < this.textfields.length; i++) {
			this.textfields[i].draw();
		}
		for (var i = 0; i < this.buttons.length; i++) {
			this.buttons[i].draw();
		}
		for (var i = 0; i < this.sliders.length; i++) {
			this.sliders[i].draw();
		}
		for (var i = 0; i < this.selectors.length; i++) {
			this.selectors[i].draw();
		}
	}
	isin(x, y) {
		// Returns true if (x, y) is inside the slider region
		if (
			x > this.pos.x &&
			x < this.pos.x+this.width &&
			y > this.pos.y &&
			y < this.pos.y+this.height
		) {
			return true;
		}
		return false;
	}
	click(x, y) {
		for (var i = 0; i < this.buttons.length; i++) {
			if (this.buttons[i].isin(x, y)) {
				this.buttons[i].click();
			}
		}
		for (var i = 0; i < this.sliders.length; i++) {
			if (this.sliders[i].isin(x, y)) {
				this.sliders[i].click(x, y);
			}
		}
		for (var i = 0; i < this.selectors.length; i++) {
			if (this.selectors[i].isin(x, y)) {
				this.selectors[i].click();
			}
		}
	}
}

function setup() {
	frameRate(10);
	canvas = createCanvas(windowWidth, windowHeight);

	// Main overlay
	snap_button_size = 80;
	snap_button_pos = createVector(
		m_width/2-snap_button_size/2,
		m_height-snap_button_size-snap_button_size/2
	);
	snap_button_action = function() {
		console.log("SNAP");
		cam.save_frame();
	}
	snap_button_action = snap_button_action;
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
		//mode = 'bc';
		active_overlay = bc_overlay;
	}
	bc_button = new Button(
		'bc',
		bc_button_pos,
		bc_button_size,
		bc_button_size,
		bc_button_action,
		'image',
		'assets/bc.png',
		'assets/bc_clicked.png'
	);

	tint_button_size = 30;
	tint_button_pos = createVector(
		m_width/10,
		2*m_height/10
	);
	tint_button_action = function() {
		console.log("TINT");
		//mode = 'bc';
		active_overlay = tint_overlay;
	}
	tint_button = new Button(
		'tint',
		tint_button_pos,
		tint_button_size,
		tint_button_size,
		tint_button_action,
		'image',
		'assets/tint.png',
		'assets/tint_clicked.png'
	);

	timer_button_size = 30;
	timer_button_pos = createVector(
		m_width/10,
		3*m_height/10
	);
	timer_button_action = function() {
		console.log("TIMER");
		//mode = 'bc';
		active_overlay = timer_overlay;
	}
	timer_button = new Button(
		'timer',
		timer_button_pos,
		timer_button_size,
		timer_button_size,
		timer_button_action,
		'image',
		'assets/timer.png',
		'assets/timer_clicked.png'
	);

	effects_button_size = 30;
	effects_button_pos = createVector(
		m_width/10,
		4*m_height/10
	);
	effects_button_action = function() {
		console.log("Effects");
		//mode = 'bc';
		active_overlay = effects_overlay;
	}
	effects_button = new Button(
		'effects',
		effects_button_pos,
		effects_button_size,
		effects_button_size,
		effects_button_action,
		'image',
		'assets/effects.png',
		'assets/effects_clicked.png'
	);

	main_pos = createVector(0, 0);
	main_width = m_width;
	main_height = m_height;
	main_bcolor = color(255, 0);
	main_textfields = [];
	main_buttons = [snap_button, bc_button, tint_button, timer_button, effects_button];
	main_sliders = [];
	main_overlay = new Overlay(
		main_pos,
		main_width,
		main_height,
		main_bcolor,
		main_textfields,
		main_buttons,
		main_sliders
	);

	// Brightness/contrast overlay
	b_slider_pos = createVector(m_width/5, 2*m_height/10);
	b_slider_width = m_width*3/5;
	b_slider_height = m_height/20;
	b_slider_bcolor = 'black';
	b_slider_fcolor = 'orange';
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

	b_txt = new TextBox(
		'Brightness',
		createVector(b_slider_pos.x, b_slider_pos.y - b_slider_height),
		b_slider_width,
		b_slider_height,
		20,
		LEFT,
		CENTER,
		'white',
		'white',
		0
	);

	c_slider_pos = createVector(m_width/5, 4*m_height/10);
	c_slider_width = m_width*3/5;
	c_slider_height = m_height/20;
	c_slider_bcolor = 'black';
	c_slider_fcolor = 'white';
	c_slider_init_value = 1;
	c_slider_range = [0, 3];
	c_slider = new Slider(
		c_slider_pos,
		c_slider_width,
		c_slider_height,
		c_slider_bcolor,
		c_slider_fcolor,
		c_slider_init_value,
		c_slider_range
	);

	c_txt = new TextBox(
		'Contrast',
		createVector(c_slider_pos.x, c_slider_pos.y - c_slider_height),
		c_slider_width,
		c_slider_height,
		20,
		LEFT,
		CENTER,
		'white',
		'white',
		0
	);

	bc_reset_action = function() {
		b_slider.reset();
		c_slider.reset();
	}
	bc_reset = new Button(
		'RESET',
		createVector(m_width*7/10, m_height*6/10),
		m_width/5,
		m_height/10,
		bc_reset_action,
		'text',
		'rgba(255,255,255,0.3)',
		'rgba(255,255,255,0.8)'
	);

	bc_pos = createVector(m_width/10, m_height/10);
	bc_width = m_width*4/5;
	bc_height = 6*m_height/10;
	bc_bcolor = color(0, 100);
	bc_textfields = [b_txt, c_txt];
	bc_buttons = [bc_reset];
	bc_sliders = [b_slider, c_slider];
	bc_overlay = new Overlay(
		bc_pos,
		bc_width,
		bc_height,
		bc_bcolor,
		bc_textfields,
		bc_buttons,
		bc_sliders
	);

	// Tint overlay
	red_slider_pos = createVector(m_width/5, 2*m_height/10);
	red_slider_width = m_width*3/5;
	red_slider_height = m_height/20;
	red_slider_bcolor = 'black';
	red_slider_fcolor = 'rgb(200, 100, 100)';
	red_slider_init_value = 0;
	red_slider_range = [0, 255];
	red_slider = new Slider(
		red_slider_pos,
		red_slider_width,
		red_slider_height,
		red_slider_bcolor,
		red_slider_fcolor,
		red_slider_init_value,
		red_slider_range
	);
	red_txt = new TextBox(
		'Red',
		createVector(red_slider_pos.x, red_slider_pos.y - red_slider_height),
		red_slider_width,
		red_slider_height,
		20,
		LEFT,
		CENTER,
		'white',
		'white',
		0
	);

	green_slider_pos = createVector(m_width/5, 4*m_height/10);
	green_slider_width = m_width*3/5;
	green_slider_height = m_height/20;
	green_slider_bcolor = 'black';
	green_slider_fcolor = 'lightgreen';
	green_slider_init_value = 0;
	green_slider_range = [0, 255];
	green_slider = new Slider(
		green_slider_pos,
		green_slider_width,
		green_slider_height,
		green_slider_bcolor,
		green_slider_fcolor,
		green_slider_init_value,
		green_slider_range
	);
	green_txt = new TextBox(
		'Green',
		createVector(green_slider_pos.x, green_slider_pos.y - green_slider_height),
		green_slider_width,
		green_slider_height,
		20,
		LEFT,
		CENTER,
		'white',
		'white',
		0
	);

	blue_slider_pos = createVector(m_width/5, 6*m_height/10);
	blue_slider_width = m_width*3/5;
	blue_slider_height = m_height/20;
	blue_slider_bcolor = 'black';
	blue_slider_fcolor = 'lightblue';
	blue_slider_init_value = 0;
	blue_slider_range = [0, 255];
	blue_slider = new Slider(
		blue_slider_pos,
		blue_slider_width,
		blue_slider_height,
		blue_slider_bcolor,
		blue_slider_fcolor,
		blue_slider_init_value,
		blue_slider_range
	);
	blue_txt = new TextBox(
		'Blue',
		createVector(blue_slider_pos.x, blue_slider_pos.y - blue_slider_height),
		blue_slider_width,
		blue_slider_height,
		20,
		LEFT,
		CENTER,
		'white',
		'white',
		0
	);

	tint_reset_action = function() {
		red_slider.reset();
		green_slider.reset();
		blue_slider.reset();
	}
	tint_reset = new Button(
		'RESET',
		createVector(m_width*7/10, m_height*8/10),
		m_width/5,
		m_height/10,
		tint_reset_action,
		'text',
		'rgba(255,255,255,0.3)',
		'rgba(255,255,255,0.8)'
	);

	tint_pos = createVector(m_width/10, m_height/10);
	tint_width = m_width*4/5;
	tint_height = 8*m_height/10;
	tint_bcolor = color(0, 100);
	tint_textfields = [red_txt, blue_txt, green_txt];
	tint_buttons = [tint_reset];
	tint_sliders = [red_slider, blue_slider, green_slider];
	tint_overlay = new Overlay(
		tint_pos,
		tint_width,
		tint_height,
		tint_bcolor,
		tint_textfields,
		tint_buttons,
		tint_sliders
	);

	timer_action = function(s) {
		return function() {
			active_overlay = main_overlay;
			setTimeout(function() {cam.save_frame();}, s*1000);
		}
	}

	timer_3_seconds = new Button(
		'3',
		createVector(m_width*2/10, m_height/2),
		m_width/5,
		m_height/10,
		timer_action(3),
		'text',
		'rgba(255,255,255,0.3)',
		'rgba(255,255,255,0.8)'
	);

	timer_5_seconds = new Button(
		'5',
		createVector(m_width*4/10, m_height/2),
		m_width/5,
		m_height/10,
		timer_action(5),
		'text',
		'rgba(255,255,255,0.3)',
		'rgba(255,255,255,0.8)'
	);

	timer_10_seconds = new Button(
		'10',
		createVector(m_width*6/10, m_height/2),
		m_width/5,
		m_height/10,
		timer_action(10),
		'text',
		'rgba(255,255,255,0.3)',
		'rgba(255,255,255,0.8)'
	);

	timer_txt = new TextBox(
		'Set time',
		createVector(m_width*2/10, m_height/3),
		m_width*4/5,
		m_height*1/6,
		24,
		LEFT,
		CENTER,
		'white',
		'white',
		0
	);

	timer_pos = createVector(m_width/10, m_height/4);
	timer_width = m_width*4/5;
	timer_height = m_height*2/4;
	timer_bcolor = color(0, 100);
	timer_textfields = [timer_txt];
	timer_buttons = [timer_3_seconds, timer_5_seconds, timer_10_seconds];
	timer_sliders = [];
	timer_overlay = new Overlay(
		timer_pos,
		timer_width,
		timer_height,
		timer_bcolor,
		timer_textfields,
		timer_buttons,
		timer_sliders
	);

	// Effects overlay

	gray_txt = new TextBox(
		'Gray',
		createVector(m_width/5, 2*m_height/10),
		m_width/3,
		m_height/20,
		20,
		LEFT,
		BOTTOM,
		'white',
		'white',
		0
	);
	gray_selector = new Selector(
		false,
		createVector(gray_txt.pos.x+gray_txt.width, gray_txt.pos.y),
		m_width/10,
		m_width/10,
		'assets/check_yes.png',
		'assets/check_no.png'
		);

	invert_txt = new TextBox(
		'Invert',
		createVector(m_width/5, 3*m_height/10),
		m_width/3,
		m_height/20,
		20,
		LEFT,
		BOTTOM,
		'white',
		'white',
		0
	);
	invert_selector = new Selector(
		false,
		createVector(invert_txt.pos.x+invert_txt.width, invert_txt.pos.y),
		m_width/10,
		m_width/10,
		'assets/check_yes.png',
		'assets/check_no.png'
		);

	bw_slider_pos = createVector(m_width/5, 5*m_height/10);
	bw_slider_width = m_width*3/5;
	bw_slider_height = m_height/20;
	bw_slider_bcolor = 'black';
	bw_slider_fcolor = 'white';
	bw_slider_init_value = 128;
	bw_slider_range = [0, 255];
	bw_slider = new Slider(
		bw_slider_pos,
		bw_slider_width,
		bw_slider_height,
		bw_slider_bcolor,
		bw_slider_fcolor,
		bw_slider_init_value,
		bw_slider_range
	);
	bw_txt = new TextBox(
		'Black and White',
		createVector(bw_slider_pos.x, bw_slider_pos.y - bw_slider_height),
		bw_slider_width,
		bw_slider_height,
		20,
		LEFT,
		CENTER,
		'white',
		'white',
		0
	);

	solarize_slider_pos = createVector(m_width/5, 7*m_height/10);
	solarize_slider_width = m_width*3/5;
	solarize_slider_height = m_height/20;
	solarize_slider_bcolor = 'black';
	solarize_slider_fcolor = 'lightblue';
	solarize_slider_init_value = 255;
	solarize_slider_range = [0, 255];
	solarize_slider = new Slider(
		solarize_slider_pos,
		solarize_slider_width,
		solarize_slider_height,
		solarize_slider_bcolor,
		solarize_slider_fcolor,
		solarize_slider_init_value,
		solarize_slider_range
		);
		solarize_txt = new TextBox(
		'Solarize',
		createVector(solarize_slider_pos.x, solarize_slider_pos.y - solarize_slider_height),
		solarize_slider_width,
		solarize_slider_height,
		20,
		LEFT,
		CENTER,
		'white',
		'white',
		0
	);

	effects_reset_action = function() {
		bw_slider.reset();
		solarize_slider.reset();
		gray_selector.reset();
		invert_selector.reset();
	}
	effects_reset = new Button(
		'RESET',
		createVector(m_width*7/10, m_height*8/10),
		m_width/5,
		m_height/10,
		effects_reset_action,
		'text',
		'rgba(255,255,255,0.3)',
		'rgba(255,255,255,0.8)'
	);

	effects_pos = createVector(m_width/10, m_height/10);
	effects_width = m_width*4/5;
	effects_height = 8*m_height/10;
	effects_bcolor = color(0, 100);
	effects_textfields = [gray_txt, invert_txt, bw_txt, solarize_txt];
	effects_buttons = [effects_reset];
	effects_sliders = [bw_slider, solarize_slider];
	effects_selectors = [gray_selector, invert_selector];
	effects_overlay = new Overlay(
		effects_pos,
		effects_width,
		effects_height,
		effects_bcolor,
		effects_textfields,
		effects_buttons,
		effects_sliders,
		effects_selectors
	);

	// Camera stream
	cam_pos = createVector(0, 0);
	cam_width = m_width;
	cam_height = m_height;
	sliders = [b_slider, c_slider, red_slider, green_slider, blue_slider, bw_slider, solarize_slider];
	selectors = [gray_selector, invert_selector];
	cam = new CamStream(cam_pos, cam_width, cam_height, sliders, selectors);

	active_overlay = main_overlay;

}

function draw() {
	background(255);
	draw_outline();
	cam.draw();
	active_overlay.draw();
}

function mousePressed() {
	if (active_overlay.isin(mouseX, mouseY)) {
		active_overlay.click(mouseX, mouseY);
	}
	else {
		active_overlay = main_overlay;
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