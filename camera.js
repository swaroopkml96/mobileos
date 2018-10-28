function setup() {
	createCanvas(windowWidth, windowHeight);
}

function draw() {
	background(255);
	draw_outline();

	// Temporary
	fill(0);
	noStroke();
	textSize(24);
	text('Camera', m_width/2, m_height/2);

}