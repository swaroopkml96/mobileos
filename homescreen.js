function setup() {
	createCanvas(windowWidth, windowHeight);
	
	button_size = m_width/3;

	contacts_button_pos = createVector(0, m_height-button_size);
	contacts_button_action = function() {
		window.location.replace("contacts.html");
	}
	contacts_button = new Button(
		'Contacts',
		contacts_button_pos,
		button_size,
		contacts_button_action
	);

	calc_button_pos = createVector(button_size, m_height-button_size);
	calc_button_action = function() {
		window.location.replace("calculator.html");
	}
	calc_button = new Button(
		'Calculator',
		calc_button_pos,
		button_size,
		calc_button_action
	);

	camera_button_pos = createVector(2*button_size, m_height-button_size);
	camera_button_action = function() {
		window.location.replace("camera.html");
	}
	camera_button = new Button(
		'Camera',
		camera_button_pos,
		button_size,
		camera_button_action
	);

	buttons = [contacts_button, calc_button, camera_button];

}

function draw() {
	draw_outline();

	// Temporary
	fill(0);
	noStroke();
	textSize(24);
	text('Homescreen', m_width/2, m_height/2);

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