// This file contains all variables, methods, and classes needed in common by all apps

var m_width = 400;
var m_height = 600;

function draw_outline(){
	noFill();
	stroke(100);
	strokeWeight(3);
	rect(0, 0, m_width, m_height);
}

class TextBox {
	constructor(txt, pos, width, height, txt_size, horiz_align=CENTER, vert_align=CENTER) {
		this.txt = txt;
		this.pos = pos;
		this.width = width;
		this.height = height;
		this.txt_size = txt_size;
		this.horiz_align = horiz_align;
		this.vert_align = vert_align;
	}

	draw() {
		fill(0);
		noStroke();
		textSize(this.txt_size);
		textAlign(this.horiz_align, this.vert_align);
		text(this.txt, this.pos.x, this.pos.y, this.width, this.height);
	}

	update_txt(txt) {
		this.txt = txt;
	}
};

class Button {
	// A rectangular clickable region which performs action() on click.
	/* Examples:
		Button with text: (lighblue, orange)
			Button(name, pos, width, height, action)
		Button with text: c1: default color, c2: when pressed
			Button(name, pos, width, height, action, 'text', default_color, onclick_color)
		Button with image: (pass mode='image')
			Button(name, pos, width, height, action, 'image', default_img_path, onclick_img_path)
	*/
	constructor(name,pos,width,height,action,mode='text',def='lightblue',onclick='orange') {
		this.name = name;
		this.pos = pos;
		this.width = width;
		this.height = height;
		this.action = action;
		this.mode = mode;

		// console.log(mode);


		if (this.mode == "text") {
			this.def = color(def);
			this.onclick = color(onclick);
			this.current = this.def;
			this.txt_box = new TextBox(
				this.name,
				this.pos,
				this.width,
				this.height,
				18
			);
		}
		else {
			this.def = loadImage(def);
			this.onclick = loadImage(onclick);
			this.current = this.def;
		}
		
	}
	draw() {
		if (this.mode == "text"){
			fill(this.current);
			stroke(0);
			rect(this.pos.x, this.pos.y, this.width, this.height);
			this.txt_box.draw();
			this.current = this.def;
		}
		else {
			image(this.current, this.pos.x, this.pos.y, this.width, this.height);
			this.current = this.def;
		}
	}
	isin(x, y){
		// Returns true if (x, y) is inside the button region
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
	click() {
		this.current = this.onclick;
		return this.action();
	}
};

class InputPad {
	// An array of Button objects, can be created using an array of names
	// Accumulates and provides access to, a string of previous inputs
	constructor(button_array, pos, width, height) {
		this.pos = pos;
		this.width = width;
		this.height = height;
		this.buttons = this.make_button_list(button_array);
		this.current_string = "";
	}

	make_button_list(button_array) {
		let buttons = [];
		let button_width = this.width / button_array[0].length;
		let button_height = this.height / button_array.length;
		
		for (var i = 0; i < button_array.length; i++) {
			for (var j = 0; j < button_array[i].length; j++) {
				let button_name = button_array[i][j];
				let button_pos = createVector(
					this.pos.x+j*button_width,
					this.pos.y+i*button_height
				);
				let button_action = function() {
					return this.name;
				}
				let button = new Button(
					button_name,
					button_pos,
					button_width,
					button_height,
					button_action
				);
				buttons.push(button);
			}
		}

		return buttons;
	}

	draw() {
		for (var i = 0; i < this.buttons.length; i++) {
			this.buttons[i].draw();
		}
	}

	isin(x, y){
		// Returns true if (x, y) is inside the region
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
		//console.log('CLICKED');
		for (var i = 0; i < this.buttons.length; i++) {
			if (this.buttons[i].isin(x, y)) {
				//console.log(this.buttons[i].name);
				let char = this.buttons[i].click();
				this.current_string = this.current_string + char;
				//console.log(this.current_string);
			}
		}
	}

	read_input() {
		return this.current_string;
	}

	flush() {
		this.current_string = "";
	}

	backspace() {
		this.current_string = this.current_string.substring(0, this.current_string.length-2);
	}

	feed(input) {
		this.current_string = input;
	}
};
