// import $ from './lib/jquery';

const MixtapeModel = {};

MixtapeModel.getVideoLikesByUser = function (userId) {
  return $.ajax({
    url: '/mixtape/user/' + userId,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  });
}

// Returns a Moment Iterator for the currently logged in user
MixtapeModel.getMomentIteratorForUser = function () {
  return $.ajax({
    url: '/mixtape',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  })
  .then(function (likes) {
    return createMomentIterator(likes);
  })
  .fail(function (err) {
    console.log(err);
    return null;
  });
}

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
    },
    reset: function () {
      currentVideo = -1;
      currentMoment = -1;
    }
  };
  return iterator;
}

export default MixtapeModel;
