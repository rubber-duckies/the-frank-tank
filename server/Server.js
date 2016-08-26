// Todo: Get shit done
// '/' -> index.html

// '/channel/*element*' <-get- sorted by element, # of views
// '/channel' <-get- sorted by # of likes, maybe randomized?

// {
//   channel_id: id
//   channel_name: name,
//   background: image asset,
//   videos: [{
//     url: youtube link,
//     time_based_likes: [{
//       start: start timestamp,
//       stop: stop timestamp,
//       likes: number of likes,
//       url_id: current youtube link id,
//       likes: [user ids]
//     }]
//   }]
// }

// '/likes' <-get-

// {
//   start: start time,
//   stop: stop time,
//   like_id: current like id,
//   url_id: current youtube link id
//   likes: [user ids]
// }

// '/likes/create' -post->

// {
//   start: start time,
//   stop: stop time,
//   user_id: current user id
//   url_id: current youtube link id
// }

// '/likes/update' -post->

// {
//   like_id: current like id,
//   user_id: current user id
// }

const express = require('express');

const path = require('path');

const bodyParser = require('body-parser');

const app = express();

const serverUrl = process.env.PORT || 8000;

// background image url: https://i.ytimg.com/vi/shTUk4WNWVU/maxresdefault.jpg

const channelObj = [
  { id: 1, name: 'land', background: 'https://i.ytimg.com/vi/shTUk4WNWVU/maxresdefault.jpg' },
];

const usersObj = [
  { id: 1, name: 'Joe' },
  { id: 2, name: 'Frank' },
  { id: 3, name: 'Rob' },
  { id: 4, name: 'Ryan' },
  { id: 5, name: 'Gilbert' },
];

const videosObj = [
  { id: 1, url: 'OMflBAXJJKc', channel_id: 1 },
  { id: 2, url: 'x76VEPXYaI0', channel_id: 1 },
  { id: 3, url: 'evj6y2xZCnM', channel_id: 1 },
];

const likesObj = [
  { id: 1, start: 43, stop: 48, video_id: 1, users: [1, 2, 4] },
  { id: 2, start: 74, stop: 82, video_id: 1, users: [2, 3, 4] },
  { id: 3, start: 38, stop: 42, video_id: 2, users: [1, 3, 4] },
  { id: 4, start: 70, stop: 90, video_id: 3, users: [2, 5] },
];

const dummyObj = {
  channel_id: 1,
  channel_name: 'land',
  background: path.join(__dirname, '../assets/land_background.jpg'),
  videos: [{
    url: 'OMflBAXJJKc',
    time_based_likes: [{
      start: 43,
      stop: 48,
      video_id: 1,
      likes: [1, 2, 4],
    }, {
      start: 74,
      stop: 82,
      url_id: 2,
      likes: [2, 3, 4],
    }],
  }, {
    url: 'x76VEPXYaI0',
    time_based_likes: [{
      start: 38,
      stop: 42,
      video_id: 2,
      likes: [1, 3, 4],
    }],
  }, {
    url: 'evj6y2xZCnM',
    time_based_likes: [{
      start: 70,
      stop: 73,
      video_id: 3,
      likes: [2, 5],
    }],
  }],
};

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, '../client')));
app.use(express.static(path.join(__dirname, '../assets')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/Index.html'));
});

app.post('/channel', (req, res) => {
  res.send(dummyObj);
});

app.post('/likes/create', (req, res) => {
  res.send();
});

app.post('/likes/update', (req, res) => {
  const userId = +req.body.user_id;
  const likeId = +req.body.like_id;

  const currentLikeObj = likesObj.filter(element => element.id === likeId)[0];

  currentLikeObj.users.push(userId);
  currentLikeObj.users = currentLikeObj.users
    .filter((element, index, array) => array.indexOf(element) === index)
    .sort((a, b) => (a - b));

  res.send(JSON.stringify({ id: currentLikeObj.id, users: currentLikeObj.users }));
});

app.listen(serverUrl);
console.log('Listening on port: ' + serverUrl);

