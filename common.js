// This file contains all variables, methods, and classes needed in common by all apps


var m_width = 400;
var m_height = 600;

function draw_outline(){
	noFill();
	stroke(100);
	strokeWeight(3);
	rect(0, 0, m_width, m_height);
}

class Button {
	constructor(name, pos, size, action) {
		this.pos = pos;
		this.size = size;
		this.name = name;
		this.action = action;
	}
	draw() {
		fill(100, 100, 255);
		stroke(0);
		rect(this.pos.x, this.pos.y, this.size, this.size);

		fill(0);
		noStroke();
		textSize(16);
		text(this.name, this.pos.x, this.pos.y, this.size, this.size);
	}
	isin(x, y){
		if (
			x > this.pos.x &&
			x < this.pos.x+this.size &&
			y > this.pos.y &&
			y < this.pos.y+this.size
		) {
			return true;
		}
		return false;
	}
	click() {
		console.log(this.name)
		//this.action();
	}
};
