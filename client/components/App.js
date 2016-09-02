import React from 'react';
import PlayerWindow from './PlayerWindow';
import NavBar from './NavBar';
import NavModel from '../models/navModel';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: 'Joe',
      background: '',
      videos: [],
      channel: '',
      channel_id: 'default',
    };
  }

  componentDidMount() {
    NavModel.changeChannel(this.state.channel_id)
    .then(channelObj => {
      this.setState({
        background: channelObj.background,
        videos: channelObj.videos,
        channel: channelObj.name,
      });
      $('body').css('background-image', `url(${this.state.background})`);
    });
  }

  // now defunct?
  setChannel(channelObj) {
    this.setState({
      background: channelObj.background,
      videos: channelObj.videos,
      channel: channelObj.name,
    });
    $('body').css('background-image', `url(${this.state.background})`);
  }

  changeChannel(channelId) {
    NavModel.changeChannel(channelId)
    .then(channelObj => {
      this.setState({
        background: channelObj.background,
        videos: channelObj.videos,
        channel: channelObj.name,
        channel_id: channelId,
      });
      $('body').css('background-image', `url(${this.state.background})`);
    });
  }

  render() {
    return (
      <div>
        <header>
          <div className="container">
            <div className="row column">
              <h1>The Frank Tank</h1>
              <NavBar changeChannel={(channelId) => this.changeChannel(channelId)} />
            </div>
          </div>
        </header>

        <div className="container">
          <div className="row column">
            <h2>{this.state.name}</h2>
            <PlayerWindow videos={this.state.videos} channel_id={this.state.background} id={this.state.id} />
          </div>
        </div>
      </div>
    );
  }
}
