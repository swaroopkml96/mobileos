//Array of song lists & playlist art
var songs=["Songs/Ondu Malebillu.mp3","Songs/Something Just Like This.mp3","Songs/Too good at goodbye.mp3"];
var poster = ["1.jpeg","2.jpeg","3.jpeg"];

var songTitle = document.getElementById("songTitle");
var fillBar = document.getElementById("fill");

var song = new Audio();
var currentSong = 0;    // this point to the current song

window.onload = playSong;

//Play song function

function playSong()
{
song.src = songs[currentSong];  //set the source of 0th song
songTitle.textContent = songs[currentSong].substring(6); // set the title of song
song.play();    // play the song
}

// Creating Play/Pause function

function playOrPauseSong()
{
  if(song.paused)
  {
    song.play();
    $("#play img").attr("src","Pause.png");
  }
  else
  {
    song.pause();
    $("#play img").attr("src","Play.png");
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
  $("#play img").attr("src","Pause.png");
  $("#image img").attr("src",poster[currentSong]);
  $("#bg img").attr("src",poster[currentSong]);
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
  $("#play img").attr("src","Pause.png");
  $("#image img").attr("src",poster[currentSong]);
  $("#bg img").attr("src",poster[currentSong]);
}
