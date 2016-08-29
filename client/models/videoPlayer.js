let player;
let totalTime;
let seek = false;
let offset = 0;

// elements
const playHead = document.getElementById('playHead');
const timeline = document.getElementById('timeline');
const controls = document.getElementById('playerControls');
const firstScriptTag = document.getElementsByTagName('script')[0];
const tag = document.createElement('script');

tag.src = 'https://www.youtube.com/iframe_api';
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// The API will call this function when the video player is ready.
function onPlayerReady(event) {
  event.target.playVideo();
  event.target.mute();
  totalTime = event.target.getDuration();
}

// The API calls this function when the player's state changes.
// The function indicates that when playing a video (state=1),
// the player should play for six seconds and then stop.
function onPlayerStateChange(event) {
  if (event.data === YT.PlayerState.PLAYING) {
    window.setInterval(() => {
      const percent = (event.target.getCurrentTime() / totalTime) * 100;

      if (!seek) {
        playHead.style.left = `${percent}%`;
      }
    }, 1000);
  }
}

// This function creates an <iframe> (and YouTube player)
// after the API code downloads.
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
      onReady: onPlayerReady,
      onStateChange: onPlayerStateChange,
    }
  });
}

playHead.addEventListener('mousedown', () => {
  seek = true;
  // player.pauseVideo();
});

playHead.addEventListener('mouseup', () => {
  seek = false;
  const seekTime = player.getDuration() * offset;
  player.seekTo(seekTime, true);
});

controls.addEventListener('mousemove', (e) => {
  const userOffset = (e.clientX - (timeline.offsetLeft + controls.offsetLeft));
  offset = (userOffset) / timeline.offsetWidth;
  if (offset > 1) {
    offset = 1;
  }

  if (offset < 0) {
    offset = 0;
  }

  if (seek) {
    const offsetString = `${(offset * 100)}%`;
    playHead.style.left = offsetString;
  }
});

$.ajax({
  url: '/channel',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  data: JSON.stringify({
    channel_id: 1,
    user_id: 1,
  }),
}).then(function(data) {
  console.log(data);
});
