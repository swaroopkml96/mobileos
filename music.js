//Array of song lists & playlist art
var songs=["assets/Songs/Ondu Malebillu.mp3","assets/Songs/Something Just Like This.mp3","assets/Songs/Too good at goodbye.mp3"];
var poster = ["assets/Album/1.jpeg","assets/Album/2.jpeg","assets/Album/3.jpeg"];

var songTitle = document.getElementById("songTitle");
var fillBar = document.getElementById("fill");

var song = new Audio();
var currentSong = 0;    // this point to the current song

window.onload = playSong;

//Play song function

function playSong()
{
song.src = songs[currentSong];  //set the source of 0th song
songTitle.textContent = songs[currentSong].substring(13); // set the title of song
song.play();    // play the song
}

// Creating Play/Pause function

function playOrPauseSong()
{
  if(song.paused)
  {
    song.play();
    $("#play img").attr("src","assets/Album/Pause.png");
  }
  else
  {
    song.pause();
    $("#play img").attr("src","assets/Album/Play.png");
  }
}

//update for seekbar
song.addEventListener('timeupdate',function()
{
    //Update the fillbar id by calculating current time
    var position = song.currentTime / song.duration;
    fillBar.style.width = position * 100 +'%';
}
);

//Next function
//****** Having issue in album art changing when going to next/previous song ********
function next()
{
  currentSong++;
  if(currentSong > 2)
  {
    currentSong = 0;
  }
  playSong();
  $("#play img").attr("src","assets/Album/Pause.png");
  $("#image img").attr("src",poster[currentSong].substring(13));
  $("#bg img").attr("src",poster[currentSong].substring(13));
}
//Going back to previous one
function pre()
{
  currentSong--;
  if(currentSong < 0)
  {
    currentSong = 2;
  }
  playSong();
  $("#play img").attr("src","assets/Album/Pause.png");
  $("#image img").attr("src",poster[currentSong].substring(13));
  $("#bg img").attr("src",poster[currentSong].substring(13));
}

function gohome()
{
  window.location.href="homescreen.html";
}

// List of songs ...
// function setup() {
// 	createCanvas(windowWidth, windowHeight);
// }
//
// function initAudio(){
// 	var audio, dir, ext, mylist;
// 	dir = "audio/";
// 	ext = ".mp3";
// 	// Audio Object
// 	audio = new Audio();
// 	audio.src = dir+"Jam_On_It"+ext;
// 	audio.play();
// 	// Event Handling
// 	mylist = document.getElementById("mylist");
// 	mylist.addEventListener("change", changeTrack);
// 	// Functions
// 	function changeTrack(event){
// 		audio.src = dir+event.target.value+ext;
// 	    audio.play();
// 	}
// }
// window.addEventListener("load", initAudio);


//Audio track list with play button
// function _(id){
// 	return document.getElementById(id);
// }
// function audioApp(){
// 	var audio = new Audio();
// 	var audio_folder = "Songs/";
// 	var audio_ext = ".mp3";
// 	var audio_index = 1;
// 	var is_playing = false;
// 	var playingtrack;
// 	var trackbox = _("trackbox");
// 	var tracks = {
// 	    "track1":["Ondu Malebillu", "Ondu Malebillu"],
// 		"track2":["Something Just Like This", "Something Just Like This"],
// 		"track3":["Too good at goodbye", "Too good at goodbye"]
// 	};
// 	for(var track in tracks){
// 		var tb = document.createElement("div");
// 		var pb = document.createElement("button");
// 		var tn = document.createElement("div");
// 		tb.className = "trackbar";
// 		pb.className = "playbutton";
// 		tn.className = "trackname";
// 		tn.innerHTML = audio_index+". "+tracks[track][0];
// 		pb.id = tracks[track][1];
// 		pb.addEventListener("click", switchTrack);
// 		tb.appendChild(pb);
// 		tb.appendChild(tn);
// 		trackbox.appendChild(tb);
// 		audio_index++;
// 	}
// 	audio.addEventListener("ended",function(){
// 	    _(playingtrack).style.background = "url(Album/play_btn.png)";
// 		playingtrack = "";
// 		is_playing = false;
// 	});
// 	function switchTrack(event){
// 		if(is_playing){
// 		    if(playingtrack != event.target.id){
// 			    is_playing = true;
// 				_(playingtrack).style.background = "url(Album/play_btn.png)";
// 			    event.target.style.background = "url(Album/Pause_btn.png)";
// 			    audio.src = audio_folder+event.target.id+audio_ext;
// 	            audio.play();
// 			} else {
// 			    audio.pause();
// 			    is_playing = false;
// 				event.target.style.background = "url(Album/play_btn.png)";
// 			}
// 		} else {
// 			is_playing = true;
// 			event.target.style.background = "url(Album/Pause_btn.png)";
// 			if(playingtrack != event.target.id){
// 				audio.src = audio_folder+event.target.id+audio_ext;
// 			}
// 	        audio.play();
// 		}
// 		playingtrack = event.target.id;
// 	}
// }
// window.addEventListener("load", audioApp);
