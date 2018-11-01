function setup() {
	createCanvas(windowWidth, windowHeight);

	// Number pad
	numpad_array = [['C','(',')','D'],
					['1','2','3','+'],
					['4','5','6','-'],
					['7','8','9','*'],
					['.','0','%','/'],
					['M','MR','RES','=']];
	numpad_pos = createVector(0, 1/3*m_height);
	numpad = new InputPad(numpad_array, numpad_pos, m_width, m_height*2/3);

	mem = '0';
	res_error = false;

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

	// Display for result, mem state
	state_pos = createVector(m_width/40, m_height/60);
	state_txt = "";
	state = new TextBox(
		state_txt,
		state_pos,
		m_width,
		m_height/6,
		12,
		LEFT,
		TOP
	);

	// Display for error state
	error_state_pos = createVector(0, m_height/60);
	error_state_txt = "";
	error_state = new TextBox(
		error_state_txt,
		error_state_pos,
		m_width-m_width/40,
		m_height/6,
		12,
		RIGHT,
		TOP
	);
}

function draw() {
	background(255);
	draw_outline();
	line(0, m_height/6, m_width, m_height/6);
	numpad.draw();

	let e = numpad.read_input();

	// If expression has M, remember result
	if (e.length > 0 && e[e.length-1] == "M") {
		mem = res_txt;
		e = e.slice(0, e.length-1);
		numpad.backspace(1);
	}

	else if (e.length > 0 && e[e.length-1] == "D") {
		if (e.slice(e.length-4,e.length-1) == "RES") {
			e = e.slice(0, e.length-4);
			numpad.backspace(4);
		}
		else if (e.slice(e.length-3,e.length-1) == "MR") {
			e = e.slice(0, e.length-3);
			numpad.backspace(3);
		}
		else{
			e = e.slice(0, e.length-2);
			numpad.backspace(2);
		}
	}
	else if (e.length > 0 && e[e.length-1] == "C") {
		e = e.slice(0, e.length-1);
		res_txt = '0';
		numpad.flush();
	}
	else if (e.length > 0 && e[e.length-1] == "=") {
		// Complete expression
		e = e.slice(0, e.length-1);
		init1 = 'let RES=' + res_txt + ';';
		init2 = 'let MR=' + mem + ';';
		let expr = init1 + init2 + '0;' + e;
		console.log(expr);
		try {
			res_txt = eval(expr);
			res_error = false;
		}
		catch(err) {
			console.log(err.message)
			res_txt = '0';
			numpad.flush();
			res_error = true;
		}
		numpad.flush();
	}
	
	display_txt = e;
	display.update_txt(display_txt);
	display.draw();

	res.update_txt(res_txt);
	res.draw();

	state.update_txt("RES="+res_txt+" "+"MR="+mem);
	state.draw();

	if (res_error) {
		error_state_txt = "ERROR";
	}
	else {
		error_state_txt = "";
	}
	error_state.update_txt(error_state_txt);
	error_state.draw();
}

function mousePressed() {
	if (numpad.isin(mouseX, mouseY)) {
		numpad.click(mouseX, mouseY);
	}
}