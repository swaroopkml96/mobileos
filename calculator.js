function setup() {
	createCanvas(windowWidth, windowHeight);

	// Number pad
	numpad_array = [['C','(',')','D'],
					['1','2','3','+'],
					['4','5','6','-'],
					['7','8','9','*'],
					['.','0',',','/'],
					['M','MR','RES','=']];
	numpad_pos = createVector(0, 1/3*m_height);
	numpad = new InputPad(numpad_array, numpad_pos, m_width, m_height*2/3);

	mem = 0;

	// Display for expression
	display_pos = createVector(0, 0);
	display_txt = "";
	display = new TextBox(
		display_txt,
		display_pos,
		m_width,
		m_height/6,
		24,
		RIGHT,
		BOTTOM
	);

	// Display for result
	res_pos = createVector(0, m_height/6);
	res_txt = "0";
	res = new TextBox(
		res_txt,
		res_pos,
		m_width,
		m_height/6,
		24,
		RIGHT,
		BOTTOM
	);
}

function draw() {
	background(255);
	draw_outline();
	line(0, m_height/6, m_width, m_height/6);
	numpad.draw();

	let init1 = "let RES="+String(res_txt)+";"
	let init2 = "let MR="+String(mem)+";"
	let e = init1+init2+numpad.read_input();
	if (e.length > 0 && e[e.length-1] == "C") {
		numpad.flush();
	}
	if (e.length > 0 && e[e.length-1] == "D") {
		numpad.backspace();
	}
	if (e.length > 0 && e[e.length-1] == "M") {
		mem = res_txt;
		numpad.backspace();
	}
	if (e.length > 0 && e[e.length-1] == "=") {
		// Complete expression
		console.log(e);
		res_txt = eval(e.substring(0, e.length-1));
		numpad.flush();
	}
	
	display_txt = numpad.read_input();
	display.update_txt(display_txt);
	display.draw();

	res.update_txt(res_txt);
	res.draw();
}

function mousePressed() {
	if (numpad.isin(mouseX, mouseY)) {
		numpad.click(mouseX, mouseY);
	}
}