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

Using PostgreSQL.  Minimal installation instructions:

# Using Homebrew from terminal:

  -brew update
  -brew install postgresql
  -brew services start postgres
  -createdb greenfield_vplayer

# Not using Homebrew:

  -install Homebrew
  -see above

# Don't want to use Homebrew

  -good luck with that

*/

const config = require('../knexfile');

const env = 'development';
const knex = require('knex')(config[env]);

knex.migrate.latest([config]);

// Welcome to FUN WITH PROMISES!

knex.getLikesByVideo = (videoId) => knex('likes').where('video_id', videoId);

knex.getAllUsers = () => knex('users');

knex.getVideosByChannel = (channelId) => knex('videos').where('channel_id', channelId)
  .then(videosArray => {
    videosArray.forEach(video => {
      video.time_based_likes = [];
    });
    return videosArray;
  });

knex.getUserLikesArray = (likeId) =>
  knex.select('user_id').from('likes_by_user').where('likes_id', likeId)
  .then(userLikes => userLikes.map(element => element.user_id));

knex.getLikesByChannel = (channelId) => {
  let arrayOfLikes = [];
  return knex('likes').where('channel_id', channelId)
  .then((likesArray) => {
    arrayOfLikes = likesArray;
    return Promise.all(likesArray.map(like => knex.getUserLikesArray(like.id)));
  })
  .then(userIds => {
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
  return knex.getLikesByChannel(channelId)
  .then(likesArray => {
    arrayOfLikes = likesArray;
    return knex.getVideosByChannel(channelId);
  })
  .then(videosArray => {
    videosArray.forEach(video => {
      video.time_based_likes = video.time_based_likes
      .concat(arrayOfLikes.filter(e => e.video_id === video.id));
    });
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
    channel_id: like.channel_id,
  };

  const userId = like.user_id;

  return knex('likes').where(likeObj)
  .then(data => {
    if (data.length) {
      likeObj.id = data[0].id;
      throw knex.getUserLikesArray(data[0].id);
    } else {
      return likeObj;
    }
  })
  .then(newLike => knex('likes').insert(newLike))
  .then(() => knex.select('id').from('likes').where(likeObj))
  .then(id => {
    likeObj.id = id[0].id;
    likeObj.users = [userId];
    return knex('likes_by_user').insert({ user_id: userId, likes_id: id[0].id });
  })
  .then(() => likeObj)
  .catch((userIdArray) =>
    userIdArray.then(idArray => {
      likeObj.users = idArray;
      return likeObj;
    })
  );
};

knex.updateLike = (obj) => knex('likes_by_user').where(obj)
  .then(queryData => {
    if (queryData.length) {
      throw knex.getUserLikesArray(queryData[0].likes_id);
    } else {
      console.log('after query: ', obj);
      return knex('likes_by_user').insert(obj);
    }
  })
  .then(() => knex.getUserLikesArray(obj.likes_id))
  .then(userIdArray => ({ id: obj.likes_id, users: userIdArray }))
  .catch(userIdArray =>
    userIdArray.then(idArray => ({ id: obj.likes_id, users: idArray })));

// The init function for populating the database with dummy information
knex.initDB = () => Promise.all([
  knex('channels').insert({ id: 1, name: 'land', background: 'https://i.ytimg.com/vi/shTUk4WNWVU/maxresdefault.jpg' }),
  knex('users').insert([
    { name: 'Joe' },
    { name: 'Frank' },
    { name: 'Rob' },
    { name: 'Ryan' },
    { name: 'Gilbert' },
  ]),
  knex('videos').insert([
    { url: 'OMflBAXJJKc', channel_id: 1 },
    { url: 'x76VEPXYaI0', channel_id: 1 },
    { url: 'evj6y2xZCnM', channel_id: 1 },
  ]),
  knex('likes').insert([
    { start_time: 43, stop_time: 48, video_id: 1, channel_id: 1 },
    { start_time: 74, stop_time: 82, video_id: 1, channel_id: 1 },
    { start_time: 38, stop_time: 42, video_id: 2, channel_id: 1 },
    { start_time: 70, stop_time: 90, video_id: 3, channel_id: 1 },
  ]),
  knex('likes_by_user').insert([
    { user_id: 1, likes_id: 1 },
    { user_id: 1, likes_id: 3 },
    { user_id: 2, likes_id: 1 },
    { user_id: 2, likes_id: 2 },
    { user_id: 2, likes_id: 4 },
    { user_id: 3, likes_id: 2 },
    { user_id: 3, likes_id: 3 },
    { user_id: 4, likes_id: 1 },
    { user_id: 4, likes_id: 2 },
    { user_id: 4, likes_id: 3 },
  ]),
]);

knex.clear = () => Promise.all([
  knex('channels').delete(),
  knex('users').delete(),
  knex('videos').delete(),
  knex('likes').delete(),
  knex('likes_by_user').delete(),
  knex('ignores').delete(),
]);

module.exports = knex;
