var password = '1369';
function setup() {
	createCanvas(windowWidth, windowHeight);

	// Number pad
	numpad_array = [['1','2','3'],
					['4','5','6'],
					['7','8','9'],
					['','0','<']];
	numpad_pos = createVector(0, 1/3*m_height);
	numpad = new InputPad(numpad_array, numpad_pos, m_width, m_height*2/3);

	// Display for expression
	display_pos = createVector(0, 0);
	display_txt = "";
	display = new TextBox(
		display_txt,
		display_pos,
		m_width,
		m_height/3,
		48,
		CENTER,
		CENTER
	);

	title_pos = createVector(0, 0);
	title_txt = "Enter your 4 digit pin";
	title = new TextBox(
		title_txt,
		title_pos,
		m_width,
		m_height/3-m_height/20,
		16,
		CENTER,
		BOTTOM
	);
	//img = loadImage('assets/ash.png');
}

function draw() {
	background(255);
	draw_outline();
	//image(img,0,0,m_width,m_height);
	//line(0, m_height/6, m_width, m_height/6);
	numpad.draw();
	
	display_txt = numpad.read_input();
	if (display_txt[display_txt.length-1] == '<') {
		numpad.backspace();
		display_txt = display_txt.slice(0, display_txt.length-1);
	}
	let stars = '';
	for (let i = 0; i < display_txt.length; i++) {
		stars = stars + '*';
	}
	display.update_txt(stars);
	display.draw();

	title.draw();

	if (display_txt.length == 4) {
		if (display_txt == password) {
			//console.log('CORRECT');
			window.location.replace('homescreen.html');
			noLoop();
		}
		else {
			console.log('INCORRECT');
			title.update_txt('Access denied!')
			numpad.flush();
		}
	}
	else if (display_txt.length >=1) {
		title.update_txt('Enter your 4 digit pin');
	}

}

function mousePressed() {
	if (numpad.isin(mouseX, mouseY)) {
		numpad.click(mouseX, mouseY);
	}
}