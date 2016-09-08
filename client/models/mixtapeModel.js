import $ from './lib/jquery';

const MixtapeModel = {};

var videoData;

MixtapeModel.getVideoLikesByUser = function (userId) {
  return $.ajax({
    url: '/mixtape/user/' + userId,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  }).then(function (likes) {
    videoData = likes;
    return likes;
  }).fail(function (err) {
    videoData = null;
    throw err;
  });
};

MixtapeModel.getMomentIteratorByUser = function (userId) {
  return MixtapeModel.getVideoLikesByUser(userId)
    .then(function (likes) {
      return createMomentIterator(likes);
    })
    .fail(function (err) {
      console.log(err);
      return null
    });
}

function createMomentIterator (likes) {
  var currentVideo = -1;
  var currentMoment = -1;
  var iterator = {
    // Checks if there is another video URL
    hasNextVideo: function () {
      return currentVideo + 1 < likes.length;
    },
    // Returns next video URL
    nextVideo: function () {
      if (!iterator.hasNextVideo()) {
        return null;
      }
      currentVideo += 1;
      currentMoment = -1;
      return likes[currentVideo].url;
    },
    hasNextMoment: function () {
      return likes[currentVideo] &&
        currentMoment + 1 < likes[currentVideo].moments.length;
    },
    nextMoment: function () {
      if (!iterator.hasNextMoment()) {
        return null;
      }
      currentMoment += 1;
      return likes[currentVideo].moments[currentMoment];
    }
  };
  return iterator;
}

export default MixtapeModel;
