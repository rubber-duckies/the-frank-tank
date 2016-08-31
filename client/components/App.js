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
    };
  }

  componentDidMount() {
    $.ajax({
      url: 'http://localhost:8000/channel/1',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      data: JSON.stringify({
        channel_id: 1,
        user_id: 1,
      }),
    }).then(data => {
      console.log('app', data);
      this.setState({ 
        background: data.background,
        videos: data.videos,
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
              <NavBar />
            </div>
          </div>
        </header>

        <div className="container">
          <div className="row column">
            <PlayerWindow videos={this.state.videos} />
          </div>
        </div>
      </div>
    );
  }
}
