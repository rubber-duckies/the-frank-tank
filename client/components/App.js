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
      name: 'default',
      id: 'default',
    };

    this.handleChannelUpdate = this.handleChannelUpdate.bind(this);
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
      //console.log(data.videos);
      this.setState({ 
        background: data.background,
        videos: data.videos,
        name: data.name,
        id: data.id,
      });
      $('body').css('background-image', `url(${this.state.background})`);
    });
  }

  changeChannel(channel_id) {
    this.setState({
      videos: [],
    });

    this.setChannel(channel_id);
  }

  handleChannelUpdate(id) {
    // console.log('channel', id);
    // this.setState({
    //   id: id,
    // });
    this.getChannel(id);
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
            <h2>{this.state.name}</h2>
            <PlayerWindow videos={this.state.videos} channel_id={this.state.background} id={this.state.id} />
          </div>
        </div>
      </div>
    );
  }
}
