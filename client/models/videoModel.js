import $ from './lib/jquery';

// moments are highlight clips within a currently playing video
export const Moment = (element, moment, player, userId) => {
  const momentObj = moment;

  const likeWindow = $('<div>').addClass('likeWindow').html(`
    <i class="fa fa-thumbs-up"></i>
    <span class="likeCount">${momentObj.users.length}</span>
  `);

  element.append(likeWindow);

  likeWindow.click((e) => {
    $.ajax({
      url: 'http://localhost:8000/likes/update',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: JSON.stringify({
        user_id: userId,
        likes_id: momentObj.id,
      }),
    })
    .done((data) => {
      likeWindow.children('.likeCount').html(data.users.length);
      console.log('like count updated');
    });
    e.stopPropagation();
  });

  element.click(() => {
    player.seekTo(momentObj.start_time);
  });

  function hitLikeTest(time) {
    if (time > momentObj.start_time && time < momentObj.stop_time) {
      likeWindow.addClass('active');
      return true;
    } else {
      likeWindow.removeClass('active');
      return false;
    }
  }

  return {
    render: element,
    hitTest: hitLikeTest,
  };
};

// update like count for a specific moment
export const sendLike = (newLike) => {
  return $.ajax({
    url: 'http://localhost:8000/likes/create',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    // dataType: 'application/json',
    data: JSON.stringify(newLike),
  });
};

// get more videos from DB
export const getMoreVideos = (channelId) =>
  $.ajax({
    url: `http://localhost:8000/videos/${channelId}`,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
