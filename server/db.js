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

Some background URLs for the default channel:
  Kill the PacMan    : https://i.imgur.com/fa7mUp8.jpg
  Portal             : https://i.imgur.com/gx9XCkA.jpg
  Circuits(current)  : https://i.imgur.com/PmqssGZ.jpg

*/

const _ = require('underscore');
const config = require('../knexfile');

const env = 'development';
const knex = require('knex')(config[env]);

knex.migrate.latest([config]);

/*
  Welcome to
   ___  _ _  _ _   _ _ _  _  ___  _ _   ___  ___  ___  __ __  _  ___  ___  ___  _
  | __>| | || \ | | | | || ||_ _|| | | | . \| . \| . ||  \  \| |/ __>| __>/ __>| |
  | _> | ' ||   | | | | || | | | |   | |  _/|   /| | ||     || |\__ \| _> \__ \|_/
  |_|  `___'|_\_| |__/_/ |_| |_| |_|_| |_|  |_\_\`___'|_|_|_||_|<___/|___><___/<_>

*/

/*
  ***********************************************************************

  What do I do?

  ***********************************************************************
*/

knex.getVideosByChannel = (channelId) =>
  knex('videos').where('channel_id', channelId)
  .then(videos => {
    const videosArray = videos;
    videos.forEach((video, index) => {
      videosArray[index].time_based_likes = [];
    });
    return videosArray;
  });

/*
  ***********************************************************************

  What do I do?

  ***********************************************************************
*/

knex.getUserLikesArray = (likeId) =>
  knex.select('user_id').from('likes_by_user').where('likes_id', likeId)
  .then(userLikes => userLikes.map(element => element.user_id));

/*
  ***********************************************************************

  What do I do?

  ***********************************************************************
*/

knex.getAllLikes = () => {
  let likesArray = [];

  return knex('likes')
  .then(likes => {
    likesArray = likes;
    return Promise.all(likesArray.map(like => knex.getUserLikesArray(like.id)));
  })
  .then(userIds => {
    const tempArray = likesArray;
    tempArray.forEach((like, index) => {
      likesArray[index].users = userIds[index];
    });
    return likesArray;
  });
};

/*
  ***********************************************************************

  What do I do?

  ***********************************************************************
*/

knex.getLikesByChannel = (channelId) => {
  let likesArray = [];

  return knex('likes').where('channel_id', channelId)
  .then((likes) => {
    likesArray = likes;
    return Promise.all(likes.map(like => knex.getUserLikesArray(like.id)));
  })
  .then(userIds => {
    const tempArray = likesArray;
    tempArray.forEach((like, index) => {
      likesArray[index].users = userIds[index];
    });
    return likesArray;
  });
};

/*
  ***********************************************************************

  What do I do?

  ***********************************************************************
*/

knex.getDefaultChannel = () => {
  const channelResObj = {
    id: 0,
    name: 'default',
    background: 'https://i.imgur.com/PmqssGZ.jpg',
  };

  let likesArray = [];
  let videosArray = [];

  return knex.getAllLikes()
  .then(likes => {
    likesArray = likes;
    return knex('videos');
  })
  .then(videos => {
    videosArray = videos;
    videos.forEach((video, index) => {
      videosArray[index].time_based_likes = []
        .concat(likesArray.filter(like => like.video_id === video.id));
    });
    channelResObj.videos = _.shuffle(videosArray).slice(0, 6);
    return channelResObj;
  });
};

/*
  ***********************************************************************

  What do I do?

  ***********************************************************************
*/

knex.getChannelById = (channelId) => {
  let channelResObj = {};
  let likesArray = [];
  let videosArray = [];

  // Build channel object by channel id
  return knex.getLikesByChannel(channelId)
  .then(likes => {
    likesArray = likes;
    return knex.getVideosByChannel(channelId);
  })
  .then(videos => {
    videosArray = videos;
    videos.forEach((video, index) => {
      videosArray[index].time_based_likes = video.time_based_likes
      .concat(likesArray.filter(e => e.video_id === video.id));
    });
    return knex('channels').where('id', channelId);
  })
  .then(channel => {
    channelResObj = channel[0];
    channelResObj.videos = videosArray;
    return channelResObj;
  });
};

/*
  ***********************************************************************

  What do I do?

  ***********************************************************************
*/

knex.addVideo = (videoUrl, channelId) => {
  const videoObj = {
    url: videoUrl,
    channel_id: channelId,
  };

  return knex('videos').where(videoObj)
  .then(videos => {
    if (videos.length) {
      throw videos[0];
    } else {
      return videoObj;
    }
  })
  .then(video => knex('videos').insert(video))
  .then(() => knex.select('id').from('videos').where(videoObj))
  .then(id => {
    videoObj.id = id[0].id;
    return videoObj;
  })
  .catch(video => video);
};

/*
  ***********************************************************************

  What do I do?

  ***********************************************************************
*/

knex.createLike = (like) => {
  const likeObj = {
    start_time: like.start_time,
    stop_time: like.stop_time,
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

/*
  ***********************************************************************

  What do I do?

  ***********************************************************************
*/

knex.updateLike = (obj) =>
  knex('likes_by_user').where(obj)
  .then(queryData => {
    if (queryData.length) {
      throw knex.getUserLikesArray(queryData[0].likes_id);
    } else {
      return knex('likes_by_user').insert(obj);
    }
  })
  .then(() => knex.getUserLikesArray(obj.likes_id))
  .then(userIdArray => ({ id: obj.likes_id, users: userIdArray }))
  .catch(userIdArray =>
    userIdArray.then(idArray => ({ id: obj.likes_id, users: idArray })));

/*
  ***********************************************************************

  What do I do?

  ***********************************************************************
*/

knex.initDB = () => Promise.all([
  knex('channels').insert([
    { id: 1, name: 'land', background: 'https://i.ytimg.com/vi/shTUk4WNWVU/maxresdefault.jpg' },
    { id: 2, name: 'sea', background: 'https://upload.wikimedia.org/wikipedia/commons/5/53/GabrielMedina-001.jpg' },
    { id: 3, name: 'air', background: 'https://i.ytimg.com/vi/apYEQlGlUAY/maxresdefault.jpg' },
  ]),
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
    { url: '5XpU5M0ZCKM', channel_id: 2 },
    { url: '-hfKtUT4ISs', channel_id: 2 },
    { url: 'JYYsAxC0Dic', channel_id: 2 },
    { url: 'rbFvzRsDBN4', channel_id: 3 },
    { url: '-C_jPcUkVrM', channel_id: 3 },
    { url: 'FHtvDA0W34I', channel_id: 3 },
  ]),
  knex('likes').insert([
    { start_time: 43, stop_time: 48, video_id: 1, channel_id: 1 },
    { start_time: 74, stop_time: 82, video_id: 1, channel_id: 1 },
    { start_time: 38, stop_time: 42, video_id: 2, channel_id: 1 },
    { start_time: 70, stop_time: 90, video_id: 3, channel_id: 1 },
    { start_time: 29, stop_time: 52, video_id: 4, channel_id: 2 },
    { start_time: 80, stop_time: 98, video_id: 4, channel_id: 2 },
    { start_time: 147, stop_time: 157, video_id: 5, channel_id: 2 },
    { start_time: 11, stop_time: 34, video_id: 6, channel_id: 2 },
    { start_time: 20, stop_time: 38, video_id: 7, channel_id: 3 },
    { start_time: 52, stop_time: 80, video_id: 7, channel_id: 3 },
    { start_time: 170, stop_time: 194, video_id: 7, channel_id: 3 },
    { start_time: 95, stop_time: 116, video_id: 8, channel_id: 3 },
    { start_time: 47, stop_time: 64, video_id: 9, channel_id: 3 },
  ]),
  knex('likes_by_user').insert([
    { user_id: 1, likes_id: 1 },
    { user_id: 2, likes_id: 1 },
    { user_id: 4, likes_id: 1 },
    { user_id: 2, likes_id: 2 },
    { user_id: 3, likes_id: 2 },
    { user_id: 4, likes_id: 2 },
    { user_id: 1, likes_id: 3 },
    { user_id: 3, likes_id: 3 },
    { user_id: 4, likes_id: 3 },
    { user_id: 2, likes_id: 4 },
    { user_id: 5, likes_id: 4 },
    { user_id: 1, likes_id: 5 },
    { user_id: 3, likes_id: 5 },
    { user_id: 4, likes_id: 5 },
    { user_id: 2, likes_id: 6 },
    { user_id: 4, likes_id: 6 },
    { user_id: 5, likes_id: 6 },
    { user_id: 1, likes_id: 7 },
    { user_id: 2, likes_id: 7 },
    { user_id: 2, likes_id: 8 },
    { user_id: 4, likes_id: 8 },
    { user_id: 5, likes_id: 8 },
    { user_id: 1, likes_id: 9 },
    { user_id: 2, likes_id: 9 },
    { user_id: 2, likes_id: 10 },
    { user_id: 3, likes_id: 10 },
    { user_id: 4, likes_id: 10 },
    { user_id: 2, likes_id: 11 },
    { user_id: 5, likes_id: 11 },
    { user_id: 2, likes_id: 12 },
    { user_id: 3, likes_id: 12 },
    { user_id: 4, likes_id: 12 },
    { user_id: 5, likes_id: 12 },
    { user_id: 2, likes_id: 13 },
    { user_id: 3, likes_id: 13 },
    { user_id: 4, likes_id: 13 },
  ]),
]);

/*
  ***********************************************************************

  What do I do?

  ***********************************************************************
*/

knex.clear = () => Promise.all([
  knex('channels').truncate(),
  knex('users').truncate(),
  knex('videos').truncate(),
  knex('likes').truncate(),
  knex('likes_by_user').truncate(),
  knex('ignores').truncate(),
]);

/*
  ***********************************************************************

  What do I do?

  ***********************************************************************
*/

knex.runInitDB = () =>
  knex.clear()
  .then(() => knex.initDB())
  .then(() => 'Database initialized!');

module.exports = knex;
