const data = {
  channel_id: 1,
  channel_name: 'land',
  background: '../../assets/land_background.jpg',
  videos: [{
    url: 'OMflBAXJJKc',
    time_based_likes: [{
      id: 1,
      start: 43,
      stop: 48,
      video_id: 1,
      users: [1, 2, 4],
    }, {
      id: 2,
      start: 74,
      stop: 82,
      video_id: 2,
      users: [2, 3, 4],
    }],
  }, {
    url: 'x76VEPXYaI0',
    time_based_likes: [{
      id: 3,
      start: 38,
      stop: 42,
      video_id: 2,
      users: [1, 3, 4],
    }],
  }, {
    url: 'evj6y2xZCnM',
    time_based_likes: [{
      id: 4,
      start: 70,
      stop: 73,
      video_id: 3,
      users: [2, 5],
    }],
  }],
};

let player;
let totalTime;
let seek = false;
let offset = 0;
let momentList = [];

let Moment = function (element, moment) {
  let momentObj = moment;

  element.click(() => {
    console.log('Like Count', momentObj.users);
  });

  function hitTest(time) {
    if (time > momentObj.start && time < momentObj.stop) {
      console.log('hit', momentObj.id);
      return true;
    } else {
      return false;
    }
  }

  return {
    render: element,
    hitTest: hitTest,
  };
};


export function playerInit() {

  // elements
  const playHead = document.getElementById('playHead');
  const timeline = document.getElementById('timeline');
  const controls = document.getElementById('playerControls');
  const firstScriptTag = document.getElementsByTagName('script')[0];
  const tag = document.createElement('script');

  playHead.addEventListener('mousedown', () => {
    seek = true;
    // player.pauseVideo();
  });

  playHead.addEventListener('mouseup', () => {
    seek = false;
    const seekTime = player.getDuration() * offset; // changed player.getDuration() to totalTime
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

  // $.ajax({
  //   url: 'http://localhost:8000/channel',
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   data: JSON.stringify({
  //     channel_id: 1,
  //     user_id: 1,
  //   }),
  // }).then(function(data) {
  //   console.log(data);
  // });
}

export function onReady(event) {
  event.target.playVideo();
  event.target.mute();
  totalTime = event.target.getDuration();
  player = event.target;

  data.videos[0].time_based_likes.forEach(moment => {
    let newMoment = new Moment($('<div>').html(moment.likes), moment);
    let mWidth = (moment.stop - moment.start) / totalTime;
    let mLeft = moment.start / totalTime;
    $('#moments').append(newMoment.render);
    momentList.push(newMoment);
    newMoment.render.addClass('moment');
    newMoment.render.css({
      position: 'absolute',
      left: `${mLeft * 100}%`,
      width: `${mWidth * 100}%`,
    });
  });
}

export function onStateChange(event) {
  if (event.data === YT.PlayerState.PLAYING) {
    window.setInterval(() => {
      const percent = (event.target.getCurrentTime() / totalTime) * 100;

      momentList.forEach(moment => {
        moment.hitTest(event.target.getCurrentTime());
      });

      if (!seek) {
        playHead.style.left = `${percent}%`;
      }
    }, 1000);
  }
}
