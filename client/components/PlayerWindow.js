import React from 'react';
import YouTube from 'react-youtube';
import { playerInit, onReady, onStateChange } from '../models/videoModel.js';

export default class PlayerWindow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: 'RubberDucky',
      currentVideo: '',
      videoList: [],
    };
  }

  componentWillMount() {
  }

  componentDidMount() {
    console.log('component mounted');
    playerInit();
  }

  componentDidUpdate() {
    console.log('component updating');
    if (this.props.videos.length && !this.state.currentVideo) {
      this.updateVideoList(this.props.videos);
    }
  }

  updateVideoList(list) {
    const updatedList = list || this.state.videoList;

    this.setState({
      currentVideo: updatedList.shift(),
      videoList: updatedList,
    });
  }

  handleEnd(event) {
    this.updateVideoList();

    //this.handleReadyState(event);
  }

  handleReadyState(event) {
    if (this.state.currentVideo) {
      onReady(this.state.currentVideo, event);
    }
  }

  handleStateChange(event) {
    onStateChange(event);
    onReady(this.state.currentVideo, event);
  }

  renderVideo() {
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

    if (!this.state.currentVideo.url) {
      return <i className="fa fa-spinner fa-pulse fa-3x fa-fw"></i>;
    }

    return (
      <YouTube
        videoId={this.state.currentVideo.url}
        opts={opts}
        onReady={this.handleReadyState.bind(this)}
        onStateChange={this.handleStateChange.bind(this)}
        onEnd={this.handleEnd.bind(this)}
        onPlay={this.handlePlay}
        className="player"
      />
    );
  }

  render() {
    return (
      <div>
        <div className="flex-video widescreen">
          {this.renderVideo()}
        </div>
        <section className="player-controls" id="playerControls">
          <div className="timeline" id="timeline">
            <div id="moments"></div>
            <div className="playHead" id="playHead" />
          </div>
        </section>
        <div id="stats">
          <div>
            <span id="timeElapsed"></span> / <span id="totalTime"></span>
          </div>
          <div id="percentageComplete"></div>
        </div>
      </div>
    );
  }

}
