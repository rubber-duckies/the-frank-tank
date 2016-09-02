import React from 'react';
import YouTube from 'react-youtube';
import { playerInit, onReady, onStateChange, Moment } from '../models/videoModel.js';

export default class PlayerWindow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: 'RubberDucky',
      currentVideo: '',
      videoList: [],
      seek: false,
      totalTime: 0,
      offset: 0,
      momentList: [],
    };

    // references to dom elements
    this.player = '';
    this.controls = '';
    this.playHead = '';
    this.timeline = '';

    // you have to manually bind methods
    this.handleEnd = this.handleEnd.bind(this);
    this.handleReadyState = this.handleReadyState.bind(this);
    this.handleStateChange = this.handleStateChange.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
  }

  componentWillMount() {
  }

  componentDidMount() {
    console.log('component mounted');

    this.playHead = document.getElementById('playHead');
    this.timeline = document.getElementById('timeline');
    this.controls = document.getElementById('playerControls');
  }

  componentDidUpdate() {
    console.log('component updating');
    if (this.props.videos.length && !this.state.currentVideo) {
      this.updateVideoList(this.props.videos);
    }
    if(this.props.videos[0].channel_id !== this.state.currentVideo.channel_id) {
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
    this.setState({
      momentList: [],
    });

    this.updateVideoList();
    //this.handleReadyState(event);
  }

  handleReadyState(event) {
    this.player = event.target;

    if (this.state.currentVideo) {
      //onReady(this.state.currentVideo, event);

      event.target.playVideo();
      event.target.mute();
      this.setState({
        totalTime: event.target.getDuration(),
      });

      $('#moments').html('');

      this.state.currentVideo.time_based_likes.forEach(moment => {
        const newMoment = new Moment($('<div>').html(''), moment);
        const mWidth = (moment.stop_time - moment.start_time) / this.state.totalTime;
        const mLeft = moment.start_time / this.state.totalTime;
        $('#moments').append(newMoment.render);
        this.state.momentList.push(newMoment);
        newMoment.render.addClass('moment');
        newMoment.render.css({
          position: 'absolute',
          left: `${mLeft * 100}%`,
          width: `${mWidth * 100}%`,
        });
      });
    }
  }

  handleStateChange(event) {
    //onStateChange(event);

    console.log('playerState', event.target.getPlayerState());
    this.setState({
      totalTime: event.target.getDuration(),
    });

    if (event.target.getPlayerState() === 1) {
      window.setInterval(() => {
        const percent = (event.target.getCurrentTime() / this.state.totalTime) * 100;

        $('#timeElapsed').html(Math.ceil(event.target.getCurrentTime()));
        $('#totalTime').html(Math.ceil(this.state.totalTime));
        $('#percentageComplete').html(`${Math.ceil(percent)}%`);

        this.state.momentList.forEach(moment => {
          moment.hitTest(event.target.getCurrentTime());
        });

        if (!this.state.seek) {
          this.playHead.style.left = `${percent}%`;
        }
      }, 1000);
    }

    if (event.target.getPlayerState() === 5) {
      event.target.playVideo();
    }

    this.handleReadyState(event);
  }

  handleMouseMove(e) {
    const userOffset = (e.clientX - (this.timeline.offsetLeft + this.controls.offsetLeft));
    this.state.offset = (userOffset) / this.timeline.offsetWidth;
    if (this.state.offset > 1) {
      this.setState({
        offset: 1,
      });
    }

    if (this.state.offset < 0) {
      this.setState({
        offset: 0,
      });
    }

    if (this.state.seek) {
      const offsetString = `${(this.state.offset * 100)}%`;
      this.playHead.style.left = offsetString;
    }
  }

  handleMouseDown() {
    this.setState({
      seek: true,
    });

    console.log(this.state.seek);
  }

  handleMouseUp() {
    this.setState({
      seek: false,
    });

    const seekTime = this.state.totalTime * this.state.offset;
    this.player.seekTo(seekTime, true);

    console.log(this.hello);

    console.log(this.state.seek);
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
        onReady={this.handleReadyState}
        onStateChange={this.handleStateChange}
        onEnd={this.handleEnd}
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
        <section className="player-controls" id="playerControls" onMouseMove={this.handleMouseMove}>
          <div className="timeline" id="timeline">
            <div id="moments"></div>
            <div className="playHead" id="playHead" onMouseDown={this.handleMouseDown} onMouseUp={this.handleMouseUp} />
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
