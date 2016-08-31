import React from 'react';
import YouTube from 'react-youtube';
import { playerInit, onReady, onStateChange } from '../models/videoModel.js';

export default class PlayerWindow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: 'RubberDucky',
    };
  }

  // componentWillMount() {
    
  // }

  componentDidMount() {
    playerInit();
  }

  render() {
    const opts = {
      height: '390',
      width: '640',
      playerVars: { // https://developers.google.com/youtube/player_parameters 
        controls: 0, // hide player controls
        // start: 10, // set player start time
        // end: 20, // set player end time
        iv_load_policy: 3, // hide annotations
        rel: 0, // hide related videos
        showinfo: 0, // hide video title
      },
    };

    return (
      <div>
        <div className="flex-video widescreen">
          <YouTube
            videoId="RGXraFHbwD8"
            opts={opts}
            onReady={onReady}
            onStateChange={onStateChange}
            className="player"
          />
        </div>
        <section className="player-controls" id="playerControls">
          <div className="timeline" id="timeline">
            <div id="moments"></div>
            <div className="playHead" id="playHead" />
          </div>
        </section>

      </div>
    );
  }

}
