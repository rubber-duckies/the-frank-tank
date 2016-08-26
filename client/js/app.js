var totalTime;

$(document).foundation();

// This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// This function creates an <iframe> (and YouTube player)
// after the API code downloads.
var player;
function onYouTubeIframeAPIReady() {
  player = new YT.Player('player', {
    height: '390',
    width: '640',
    videoId: 'RGXraFHbwD8',
    playerVars: {
      controls: 0, // hide player controls
      //start: 10, // set player start time
      //end: 20, // set player end time
      iv_load_policy: 3, // hide annotations
      rel: 0, // hide related videos
      showinfo: 0, // hide video title
    },
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
}

// The API will call this function when the video player is ready.
function onPlayerReady(event) {
  event.target.playVideo();
  event.target.mute();
  totalTime = event.target.getDuration();
}

// The API calls this function when the player's state changes.
// The function indicates that when playing a video (state=1),
// the player should play for six seconds and then stop.
var done = false;
function onPlayerStateChange(event) {
  if (event.data == YT.PlayerState.PLAYING && !done) {
    window.setInterval(function() {
      var percent = (event.target.getCurrentTime()/totalTime)*100;

      //var marker = document.getElementById('marker');
      if (!seek) {
        playHead.style.left = percent+'%';
      }
    }, 1000);
  }
}
function stopVideo() {
  player.stopVideo();
}





// elements
var playHead = document.getElementById('playHead');
var timeline = document.getElementById('timeline');
var controls = document.getElementById('playerControls');
var info = document.getElementById('info');

var seek = false;
var offset = 0;

playHead.addEventListener('mousedown', function(e) {
  seek = true;
  //player.pauseVideo();
});

playHead.addEventListener('mouseup', function(e) {
  seek = false;
  var seekTime = player.getDuration() * offset;
  console.log(player.getDuration() + ' * ' + offset + ' = ' + seekTime);
  player.seekTo(seekTime, true);
});

controls.addEventListener('mousemove', function(e) {
  var userOffset = (e.clientX - (timeline.offsetLeft + controls.offsetLeft));
  offset = (userOffset) / timeline.offsetWidth;
  console.log(offset);
  if (offset > 1) {
    offset = 1;
  }
  
  if (offset < 0) {
    offset = 0;
  }
  
  if (seek) { 
    var offsetString = ((offset) * 100) +'%';
    playHead.style.left = offsetString;
    info.innerHTML = offsetString;
  }
});