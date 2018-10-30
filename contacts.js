var contact_table;
var contact_textbox = [];

function preload(){
	contact_table = loadTable('assets/contacts.csv', 'csv', 'header');
}

function setup() {
	createCanvas(windowWidth, windowHeight);
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
		alert("search pressed");
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
		alert("add pressed");
	}
	add_button = new Button(
		'Add Contact',
		add_button_pos,
		m_width*9/10,
		m_height/10,
		add_button_action
	);

	buttons = [search_button, fav_button, all_button, add_button];
}


function draw_boarder(pos, width, height){
	noFill();
	stroke(100);
	strokeWeight(3);
	rect(pos.x, pos.y, width, height);
}

function draw() {
	draw_outline();
	// draw_boarder(search_pos,search_width,search_height);
	draw_boarder(display_pos, m_width -m_width*2/20, m_height*6/10);
	search.draw();

	for (var i = 0; i < buttons.length; i++) {
		buttons[i].draw();
	}

	drawAllContactList();
}

function mousePressed() {
	for (var i = 0; i < buttons.length; i++) {
		if (buttons[i].isin(mouseX, mouseY)) {
			buttons[i].click();
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