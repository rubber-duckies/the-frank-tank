/*
      THE DATABASE SPIDER

               (
                )
               (
        /\  .-"""-.  /\
       //\\/  ,,,  \//\\
       |/\| ,;;;;;, |/\|
       //\\\;-"""-;///\\
      //  \/   .   \/  \\
     (| ,-_| \ | / |_-, |)
       //`__\.-.-./__`\\
      // /.-(() ())-.\ \\
     (\ |)   '---'   (| /)
      ` (|           |) `
        \)           (/

          HSK HSK HSK
        GIMME THE DATAZ

Using PostgreSQL.  Installation instructions:

*/

const config = require('../knexfile');

const env = 'development';
const knex = require('knex')(config[env]);

knex.migrate.latest([config]);

knex.getVideosByChannel = (channelId) => knex('videos').where('channel_id', channelId)
  .then(videosArray => {
    videosArray.forEach(video => {
      video.time_based_likes = [];
    });
    return videosArray;
  });

knex.getLikesByVideo = (videoId) => knex('likes').where('video_id', videoId);

knex.getUserLikesArray = (likeId) =>
  knex.select('user_id').from('likes_by_user').where('likes_id', likeId);

knex.getAllUsers = () => knex('users');

knex.getAllLikes = () => {
  let arrayOfLikes = [];
  return knex('likes')
  .then((likesArray) => {
    arrayOfLikes = likesArray;
    return Promise.all(likesArray.map(like => knex.getUserLikesArray(like.id)));
  })
  .then(userLikes => {
    const userIds = userLikes.map(user => user.map(element => element.user_id));
    arrayOfLikes.forEach((like, index) => {
      like.users = userIds[index];
    });
    return arrayOfLikes;
  });
};

knex.getChannelById = (channelId) => {
  let channelResObj = {};
  let arrayOfLikes = [];
  let arrayOfVideos = [];

  // Build channel object by channel id
  return knex.getAllLikes()
  .then(likesArray => {
    arrayOfLikes = likesArray;
    return knex.getVideosByChannel(channelId);
  })
  .then(videosArray => {
    videosArray.forEach(video => {
      video.time_based_likes = video.time_based_likes
      .concat(arrayOfLikes.filter(e => e.video_id === video.id));
    });
    return videosArray;
  })
  .then(videosArray => {
    arrayOfVideos = videosArray;
    return knex('channels').where('id', channelId);
  })
  .then(channel => {
    channelResObj = channel[0];
    channelResObj.videos = arrayOfVideos;
    return channelResObj;
  });
};

knex.createLike = (like) => {
  const likeObj = {
    start_time: like.start,
    stop_time: like.stop,
    video_id: like.video_id,
  };
  const userId = like.user_id;
  return knex('likes').insert(likeObj)
  .then(id => knex('likes_by_user').insert({ user_id: userId }).where('like_id', id[0]))
  .then(id => {
    console.log('Like created!', id);
    return id[0];
  });
};

// knex.init = () => Promise.all([
//   knex('channels').insert({ id: 1, name: 'land', background: 'https://i.ytimg.com/vi/shTUk4WNWVU/maxresdefault.jpg' }),
// ]);

knex.clear = () => Promise.all([
  knex('channels').delete(),
  knex('users').delete(),
  knex('videos').delete(),
  knex('likes').delete(),
  knex('likes_by_user').delete(),
  knex('ignores').delete(),
]);

module.exports = knex;
