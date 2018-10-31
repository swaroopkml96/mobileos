var contact_table;
var state;
var sub_state;
var contact_textbox = [];
var fname, lname, number;
var fname, lname, number, search_term, search_counter;

function preload(){
	contact_table = loadTable('assets/contacts.csv', 'csv', 'header');
}

function setup() {
	createCanvas(windowWidth, windowHeight);
	state = "all";	
	sub_state = "all";
	fname = "e.g john";
	lname = "e.g naidu";
	number = "e.g 9196483216";
	search_term = "";
	display_pos = createVector(m_width/20, m_height*2.5/10);
	
	// Display for Search
	search_pos = createVector(m_width/100, m_height/100);
	search_width = m_width*3/4;
	search_height = m_height/10;
	search_txt = "Search Contact";
	search = new TextBox(
		search_txt,
		search_pos,
		search_width,
		search_height,
		20,
		CENTER,
		CENTER
	);


	// Display for contact list
	font = 15;
	contact_pos = createVector(m_width/20+ m_width/100, m_height*2.5/10+ m_height/100);
	contact_width = m_width -m_width*2/20;
	contact_height = font+m_height/100;
	contact_txt = "";	
	
	total_height = contact_pos.y+contact_height;
	do{
		contact_textbox.push(new TextBox(
				contact_txt,
				createVector(contact_pos.x, contact_pos.y),
				contact_width,
				contact_height,
				font,
				LEFT,
				CENTER
			)		
		);


		contact_pos.y += contact_height;
		total_height += contact_height;
	}while(total_height <= (m_height*6/10 + m_height*2.5/10)  );
	

	//Search Button
	search_button_pos = createVector(search_width + m_width/100, search_pos.y);
	search_button_action = function() {
		state = "search";
		sub_state = "search"
	}
	search_button = new Button(
		'Search',
		search_button_pos,
		m_width - search_width - 2*m_width/100,
		search_height,
		search_button_action
	);

	//Show Favourite Button
	fav_button_pos = createVector(m_width/10, m_height/7 + m_height/100);
	fav_button_action = function() {
		alert("fav pressed");
	}
	fav_button = new Button(
		'Show Favourites',
		fav_button_pos,
		m_width*4/10,
		m_height/15,
		fav_button_action
	);

	//Show All Button
	all_button_pos = createVector(m_width*4/10+m_width/10+m_width/100, m_height/7 + m_height/100);
	all_button_action = function() {
		alert("all pressed");
		state = "all";
	}
	all_button = new Button(
		'Show All',
		all_button_pos,
		m_width*4/10,
		m_height/15,
		all_button_action
	);

	//Add Button
	add_button_pos = createVector(m_width/20, m_height*8.75/10);
	add_button_action = function() {
		state = "add"
	}
	add_button = new Button(
		'Add Contact',
		add_button_pos,
		m_width*9/10,
		m_height/10,
		add_button_action
	);

	buttons_all = [search_button, fav_button, all_button, add_button];

	// keypad
	keypad_array = [['1','2','3','4','5','6','7','8','9','0'],
					['q','w','e','r','t','y','u','i','o','p'],
					['a','s','d','f','g','h','j','k','l',''],
					['z','x','c','v','b','n','m','','','<']];
	keypad_pos = createVector(0, m_height*1/3);
	keypad = new InputPad(keypad_array, keypad_pos, m_width, m_height*2/3);


	//First Name
	fname_button_pos = createVector(m_width/100, m_height/100);
	fname_button_action = function() {
		drawBlankScreen();
		keypad.flush();
		sub_state = "fname"
	}
	fname_button = new Button(
		'First Name:',
		fname_button_pos,
		m_width*3/10,
		m_height/20,
		fname_button_action
	);

	//Last Name
	lname_button_pos = createVector(m_width/100, m_height/20+m_height*3/100);
	lname_button_action = function() {
		drawBlankScreen();
		keypad.flush();
		sub_state = "lname"
	}
	lname_button = new Button(
		'Last Name:',
		lname_button_pos,
		m_width*3/10,
		m_height/20,
		lname_button_action
	);

	//Number
	num_button_pos = createVector(m_width/100, m_height*2/20+m_height*5/100);
	num_button_action = function() {
		drawBlankScreen();
		keypad.flush();
		sub_state = "num"
	}
	num_button = new Button(
		'Number:',
		num_button_pos,
		m_width*3/10,
		m_height/20,
		num_button_action
	);
	

	//X
	x_button_pos = createVector(m_width*9/10-m_width/100, m_height/100);
	x_button_action = function() {
		drawBlankScreen();
		state = "all";
		sub_state = "all";
		fname = "e.g john";
		lname = "e.g naidu";
		number = "e.g 9196483216";
		txtfname.update_txt(fname);
		txtlname.update_txt(lname);
		txtnum.update_txt(number);
	}
	x_button = new Button(
		'x',
		x_button_pos,
		m_width/10,
		m_height/20,
		x_button_action
	);

	//Save
	save_button_pos = createVector(m_width*9/10-m_width/100, m_height/20+m_height*2/100);
	save_button_action = function() {
		saveContact();
		drawBlankScreen();
		state = "all";
		sub_state = "all";
		fname = "e.g john";
		lname = "e.g naidu";
		number = "e.g 9196483216";
		txtfname.update_txt(fname);
		txtlname.update_txt(lname);
		txtnum.update_txt(number);
	}
	save_button = new Button(
		'OK',
		save_button_pos,
		m_width/10,
		m_height/20,
		save_button_action
	);

	buttons_add = [fname_button, lname_button, num_button, save_button, x_button];

	// Display for First Name
	txtfname_pos = createVector(m_width*3/10+m_width*2/100, m_height/100);
	txtfname_width = m_width*9/10-m_width*2/100;
	txtfname_height = m_height/20;	
	txtfname = new TextBox(
		fname,
		txtfname_pos,
		txtfname_width,
		txtfname_height,
		20,
		LEFT,
		CENTER
	);

	// Display for Last Name
	txtlname_pos = createVector(m_width*3/10+m_width*2/100,m_height/20+m_height*3/100);	
	txtlname = new TextBox(
		lname,
		txtlname_pos,
		txtfname_width,
		txtfname_height,
		20,
		LEFT,
		CENTER
	);

	// Display for Number
	txtnum_pos = createVector(m_width*3/10+m_width*2/100, m_height*2/20+m_height*5/100);	
	txtnum = new TextBox(
		number,
		txtnum_pos,
		txtfname_width,
		txtfname_height,
		20,
		LEFT,
		CENTER
	);

	//X search
	x_search_button_action = function() {
		drawBlankScreen();
		state = "all";
		sub_state = "all";
		search.update_txt("Search Contact");
		search_term = "";
	}
	x_search_button = new Button(
		'x',
		x_button_pos,
		m_width/10,
		m_height/20,
		x_search_button_action
	);

	//run search
	run_search_button_pos = createVector(m_width*9/10-m_width/100, m_height/20+m_height*2/100);
	run_search_button_action = function() {
		drawBlankScreen();
		state = "all";
		sub_state = "search";
		search.update_txt("Search Contact");
	}
	run_search_button = new Button(
		'OK',
		save_button_pos,
		m_width/10,
		m_height/20,
		run_search_button_action
	);

	buttons_search = [x_search_button, run_search_button];
}


function draw_boarder(pos, width, height){
	noFill();
	stroke(100);
	strokeWeight(3);
	rect(pos.x, pos.y, width, height);
}

function draw() {
	draw_outline();
	
	if(state == "all" && sub_state == "all") {
		draw_boarder(display_pos, m_width -m_width*2/20, m_height*6/10);
		search.draw();
		for (var i = 0; i < buttons_all.length; i++) {
			buttons_all[i].draw();
		}
		drawAllContactList();
	} else if(state == "all" && sub_state == "search") {
		draw_boarder(display_pos, m_width -m_width*2/20, m_height*6/10);
		search.draw();
		for (var i = 0; i < buttons_all.length; i++) {
			buttons_all[i].draw();
		}
		drawSearchContactList();
	} else if(state == "add"){
		drawAddContact();
	} else if(state == "search") {
		drawSearchContact();
	}
}

function mousePressed() {
	if(state == "all") {
		for (var i = 0; i < buttons_all.length; i++) {
			if (buttons_all[i].isin(mouseX, mouseY)) {
				buttons_all[i].click();
			}
		}

	} else if(state == "add") {
		for (var i = 0; i < buttons_add.length; i++) {
			if (buttons_add[i].isin(mouseX, mouseY)) {
				buttons_add[i].click();
			}
		}
		if(sub_state == "fname") {
			if (keypad.isin(mouseX, mouseY)) {
				keypad.click(mouseX, mouseY);
			}
		} else if(sub_state == "lname") {
			if (keypad.isin(mouseX, mouseY)) {
				keypad.click(mouseX, mouseY);
			}
		} else if(sub_state == "num") {
			if (keypad.isin(mouseX, mouseY)) {
				keypad.click(mouseX, mouseY);
			}
		}

	} else if(state == "search") {
		if (keypad.isin(mouseX, mouseY)) {
			keypad.click(mouseX, mouseY);		
		}
		for (var i = 0; i < buttons_search.length; i++) {
			if (buttons_search[i].isin(mouseX, mouseY)) {
				buttons_search[i].click();
			}
		}
	}
	
}

function drawAllContactList(){
	for(var i = 0; i<contact_textbox.length ;i++){
		if(i < contact_table.getRowCount()){
			contact_textbox[i].update_txt(
				contact_table.get(i, 'fname')+ " "+
				contact_table.get(i, 'lname')+ " : "+
				contact_table.get(i, 'number')
			);
		}
		contact_textbox[i].draw();
	}
}

function drawAddContact() {
	drawBlankScreen();
	for (var i = 0; i < buttons_add.length; i++) {
		buttons_add[i].draw();
	}	
	if(sub_state == "fname") {
		keypad.draw();
		fname = keypad.read_input();
		if (fname.length > 0 && fname[fname.length-1] == "<") {
			keypad.backspace();
		}
		txtfname.update_txt(fname);
	} else if(sub_state == "lname") {
		keypad.draw();
		if (lname.length > 0 && lname[lname.length-1] == "<") {
			keypad.backspace();
		}
		lname = keypad.read_input();
		txtlname.update_txt(lname);
	} else if(sub_state == "num") {
		keypad.draw();
		if (number.length > 0 && number[number.length-1] == "<") {
			keypad.backspace();
		}
		number = keypad.read_input();
		txtnum.update_txt(number);
	}
	txtfname.draw();
	txtlname.draw();
	txtnum.draw();
}

function drawBlankScreen(){
	fill(255);
	stroke(100);
	strokeWeight(3);
	rect(0, 0, m_width, m_height);
	draw_outline();
}

function saveContact() {
	var newRow = contact_table.addRow();
	newRow.setString('fname', fname);
	newRow.setString('lname', lname);
	newRow.setString('number', number);
	newRow.setString('fav', 0);
}

function drawSearchContact() {
	drawBlankScreen();
	draw_boarder(search_pos,search_width,search_height);	
	for (var i = 0; i < buttons_search.length; i++) {
		buttons_search[i].draw();
	}
	keypad.draw();
	if (search_term.length > 0 && search_term[search_term.length-1] == "<") {
		keypad.backspace();
	}
	search_term = keypad.read_input();
	search.update_txt(search_term);	
	search.draw();
}

function drawSearchContactList() {
	for(var i = 0; i<contact_textbox.length ;i++){
		contact_textbox[i].update_txt("");
	}
	for(var i = 0; i<contact_textbox.length ;i++){
		if(i < contact_table.getRowCount()){
			if(contact_table.get(i, 'fname') == search_term) {
				contact_textbox[i].update_txt(
					contact_table.get(i, 'fname')+ " "+
					contact_table.get(i, 'lname')+ " : "+
					contact_table.get(i, 'number')
				);
			}
		}		
	}
}