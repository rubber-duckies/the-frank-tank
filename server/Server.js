//Todo: Get shit done
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