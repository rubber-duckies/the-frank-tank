import $ from './lib/jquery';

const NavModel = {};

NavModel.changeChannel = (channelId) => {
  console.log('Great Success! Channel ID: ', channelId);
  const channelUrl = `/channel/${
    channelId === 1 ||
    channelId === 2 ||
    channelId === 3
    ? channelId
    : 'default'
  }`;
  return $.ajax({
    url: channelUrl,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export default NavModel;
