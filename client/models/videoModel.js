let player;
let totalTime;
let seek = false;
let offset = 0;
let momentList = [];

const Moment = (element, moment) => {
  const momentObj = moment;

  const likeWindow = $('<div>').addClass('likeWindow').html(`
    ${momentObj.users.length}
    <i class="fa fa-thumbs-up"></i>
  `);

  element.append(likeWindow);

  element.click(() => {
    console.log('Like Count', momentObj.users);
  });

  function hitTest(time) {
    if (time > momentObj.start_time && time < momentObj.stop_time) {
      //console.log('hit', momentObj.id);
      likeWindow.addClass('active');
      return true;
    } else {
      likeWindow.removeClass('active');
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
  });

  playHead.addEventListener('mouseup', () => {
    seek = false;
    const seekTime = totalTime * offset; // changed player.getDuration() to totalTime
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
}

export function onReady(data, event) {
  event.target.playVideo();
  //console.log(event.target.getPlayerState());
  event.target.mute();
  totalTime = event.target.getDuration();
  player = event.target;


  $('#moments').html('');
  data.time_based_likes.forEach(moment => {
    let newMoment = new Moment($('<div>').html(''), moment);
    let mWidth = (moment.stop_time - moment.start_time) / totalTime;
    let mLeft = moment.start_time / totalTime;
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
  console.log('playerState', event.target.getPlayerState());
  totalTime = event.target.getDuration();

  if (event.target.getPlayerState() === 1) {
    window.setInterval(() => {
      const percent = (event.target.getCurrentTime() / totalTime) * 100;

      $('#timeElapsed').html(Math.ceil(event.target.getCurrentTime()));
      $('#totalTime').html(Math.ceil(totalTime));
      $('#percentageComplete').html(`${Math.ceil(percent)}%`);

      momentList.forEach(moment => {
        moment.hitTest(event.target.getCurrentTime());
      });

      if (!seek) {
        playHead.style.left = `${percent}%`;
      }
    }, 1000);
  }

  if (event.target.getPlayerState() === 5) {
    event.target.playVideo();
  }
}
