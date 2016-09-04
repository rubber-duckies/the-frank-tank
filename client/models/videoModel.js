import $ from './lib/jquery';

export const Moment = (element, moment, player, userId) => {
  const momentObj = moment;

  const likeWindow = $('<div>').addClass('likeWindow').html(`
    <span class="likeCount">${momentObj.users.length}</span>
    <i class="fa fa-thumbs-up"></i>
  `);

  element.append(likeWindow);

  likeWindow.click((e) => {
    console.log('likeWindow clicked');
    //console.log('like object', momentObj);
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
    .done(function(data) {
      likeWindow.children('.likeCount').html(data.users.length);
      // console.log('like return data', data);
      console.log('like count updated');
    });
    e.stopPropagation();
  });

  element.click(() => {
    // console.log('Like Count', momentObj.users);
    player.seekTo(momentObj.start_time);
  });

  function hitLikeTest(time) {
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
    hitTest: hitLikeTest,
  };
};

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

export const getMoreVideos = (channelId) =>
  $.ajax({
    url: `http://localhost:8000/videos/${channelId}`,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
