import React from 'react';
import PlayerWindow from './PlayerWindow';
import NavBar from './NavBar';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: 'Frank',
      background: '',
      videos: [],
      channel: '',
    };
  }

  changeChannel(channel_id) {
    this.setState({
      videos: [],
    })
    this.setChannel(channel_id)
  }

  componentDidMount() {
    this.setChannel('default');
  }

  setChannel(channelId){
    $.ajax({
      url: 'http://localhost:8000/channel/' + channelId,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      data: JSON.stringify({
        channel_id: {channelId},
        user_id: 1,
      }),
    }).then(data => {
      this.setState({ 
        background: data.background,
        videos: data.videos,
        channel: data.name,
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
              <NavBar changeChannel={this.changeChannel} that={this}/>
            </div>
          </div>
        </header>

        <div className="container">
          <div className="row column">
            <h2>{this.state.channel}</h2>
            <PlayerWindow videos={this.state.videos} />
          </div>
        </div>
      </div>
    );
  }
}
