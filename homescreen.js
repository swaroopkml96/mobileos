function setup() {
	createCanvas(windowWidth, windowHeight);

	button_size = m_width/4;
	music_button_size=m_width/4;

	
	dialer_button_pos = createVector(0, m_height-button_size);
	dialer_button_action = function() {
		window.location.replace("dialer.html");
	}
	dialer_button = new Button(
		'Dialer',
		dialer_button_pos,
		button_size,
		button_size,
		dialer_button_action,
		'image',
		'assets/cal.png',
	);

	contacts_button_pos = createVector(button_size, m_height-button_size);
	contacts_button_action = function() {
		window.location.replace("contacts.html");
	}
	contacts_button = new Button(
		'Contacts',
		contacts_button_pos,
		button_size,
		button_size,
		contacts_button_action,
		'image',
		'assets/cont.png',
	);

	calc_button_pos = createVector(2*button_size, m_height-button_size);
	calc_button_action = function() {
		window.location.replace("calculator.html");
	}
	calc_button = new Button(
		'Calculator',
		calc_button_pos,
		button_size,
		button_size,
		calc_button_action,
		'image',
		'assets/calcci.png',
		'assets/calci.png'
	);

	camera_button_pos = createVector(3*button_size, m_height-button_size);
	camera_button_action = function() {
		window.location.replace("camera.html");
	}
	camera_button = new Button(
		'Camera',
		camera_button_pos,
		button_size,
		button_size,
		camera_button_action,
		'image',
		'assets/camera.png',
		'assets/camera_clicked.png'
	);

	music_button_pos = createVector(0, m_height-2*music_button_size);
	music_button_action = function() {
		window.location.replace("music.html");
	}
	music_button = new Button(
		'Music',
		music_button_pos,
		music_button_size,
		music_button_size,
		music_button_action,
		'image',
		'assets/mus.png',
		'assets/musi.png'
	);

	buttons = [dialer_button, contacts_button, calc_button, camera_button, music_button];
	wall = loadImage('assets/wall.png');
}

function draw() {
	draw_outline();
	image(wall,0,0,m_width,m_height);
	// Temporary
	//fill(0);
	//noStroke();
	//textSize(24);
	//textAlign(CENTER, CENTER)
	//text('Homescreen', m_width/2, m_height/2);
	

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
