export default function changeChannel(channelId, userId) {
  console.log('Great Success!');
  if (!userId) {
    userId = 1;
  }
  $.ajax({
    url: '/channel',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: JSON.stringify({
      channel_id: channelId,
      user_id: userId,
    }),
  }).done((data) => {
    console.log(data);
  });
}
