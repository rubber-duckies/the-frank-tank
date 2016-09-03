import $ from './lib/jquery';

export const Moment = (element, moment, player) => {
  const momentObj = moment;

  const likeWindow = $('<div>').addClass('likeWindow').html(`
    ${momentObj.users.length}
    <i class="fa fa-thumbs-up"></i>
  `);

  element.append(likeWindow);

  likeWindow.click((e) => {
    console.log('likeWindow clicked');
    e.stopPropagation();
  });

  element.click(() => {
    console.log('Like Count', momentObj.users);
    player.seekTo(momentObj.start_time);
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

export const sendLike = (newLike) => {
  return $.ajax({
    url: 'http://localhost:8000/likes/create',
    method: 'POST',
    dataType: 'application/json',
    data: JSON.stringify(newLike),
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
