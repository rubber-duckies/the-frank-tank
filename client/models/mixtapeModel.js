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

export default MixtapeModel;
