import React from 'react';
import YouTube from 'react-youtube';
import { sendLike, Moment, getMoreVideos } from '../models/videoModel.js';
import $ from '../models/lib/jquery';

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
      extreme: false,
      extremeStart: 0,
      extremeStop: 0,
      channel_id: 0,
    };

    // references to dom elements
    this.player = '';
    this.controls = '';
    this.playHead = '';
    this.timeline = '';
    this.extremeClip = '';

    // you have to manually bind methods
    this.handleEnd = this.handleEnd.bind(this);
    this.handleReadyState = this.handleReadyState.bind(this);
    this.handleStateChange = this.handleStateChange.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleExtreme = this.handleExtreme.bind(this);
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

    if (this.props.channel_id !== this.state.channel_id) {
      this.updateVideoList(this.props.videos);
    }
  }

  checkVideoListLength(list) {
    return new Promise((resolve, reject) => {
      if (list.length < 3) {
        getMoreVideos(this.props.channel_id)
        .then(videos => {
          const videosArray = list.concat(videos);
          resolve(videosArray);
        });
      } else {
        reject(list);
      }
    });
  }

  updateVideoList(list) {
    const updatedList = list || this.state.videoList;
    this.checkVideoListLength(updatedList)
    .then(videos => {
      this.setState({
        currentVideo: videos.shift(),
        videoList: videos,
        channel_id: this.props.channel_id,
      });
    })
    .catch(() => {
      this.setState({
        currentVideo: updatedList.shift(),
        videoList: updatedList,
        channel_id: this.props.channel_id,
      });
    });
  }

  handleEnd() {
    this.setState({
      momentList: [],
    });

    this.updateVideoList();
  }

  handleReadyState(event) {
    this.player = event.target;

    if (this.state.currentVideo) {
      // onReady(this.state.currentVideo, event);

      event.target.playVideo();
      event.target.mute();
      this.setState({
        totalTime: event.target.getDuration(),
      });

      $('#moments').html('');

      if (this.state.currentVideo.time_based_likes.length) {
        this.state.currentVideo.time_based_likes.forEach(moment => {
          const newMoment = new Moment($('<div>').html(''), moment, this.player, this.props.user_id);
          const mWidth = (moment.stop_time - moment.start_time) / this.state.totalTime;
          const mLeft = moment.start_time / this.state.totalTime;
          $('#moments').append(newMoment.render);
          this.state.momentList.push(newMoment);
          newMoment.render.addClass('moment');
          newMoment.render.css({
            left: `${mLeft * 100}%`,
            width: `${mWidth * 100}%`,
          });
        });
      }
    }
  }

  handleExtreme(e) {
    if (!this.state.extreme) {
      this.setState({ extreme: true });
      e.target.classList.add('alert');

      if (!this.state.extremeStart) {
        this.setState({
          extremeStart: this.player.getCurrentTime(),
        });

        this.extremeClip = $('<div/>').addClass('moment').addClass('extreme');
        $('#moments').append(this.extremeClip);
      }
    } else {
      this.setState({
        extreme: false,
        extremeStop: this.player.getCurrentTime(),
      });
      e.target.classList.remove('alert');
      console.log(this.state.currentVideo);
      const newLike = {};
      const endTime = this.player.getCurrentTime();

      newLike.start_time = Math.ceil(this.state.extremeStart - 3);
      newLike.stop_time = Math.ceil(endTime);
      newLike.user_id = this.props.user_id;
      newLike.video_id = this.state.currentVideo.id;
      newLike.channel_id = this.state.currentVideo.channel_id;
      sendLike(newLike)
        .then((resp) => {
          console.log(resp);
        });
    }

    console.log(this.state.extreme);
  }

  handleStateChange(event) {
    this.setState({
      totalTime: event.target.getDuration(),
    });

    if (event.target.getPlayerState() === 1) {
      window.setInterval(() => {
        const percent = (event.target.getCurrentTime() / this.state.totalTime) * 100;
        const totalMinutes = (`${Math.floor(this.state.totalTime / 60)}`);
        const totalSeconds = (`0${Math.floor(this.state.totalTime % 60)}`).slice(-2);
        const currentMinutes = (`${Math.floor(event.target.getCurrentTime() / 60)}`);
        const currentSeconds = (`0${Math.floor(event.target.getCurrentTime() % 60)}`).slice(-2);

        $('#timeElapsed').html(`${currentMinutes}:${currentSeconds}`);
        $('#totalTime').html(`${totalMinutes}:${totalSeconds}`);
        $('#percentageComplete').html(`${Math.ceil(percent)}%`);

        this.state.momentList.forEach(moment => {
          moment.hitTest(event.target.getCurrentTime());
        });

        if (this.extremeClip) {
          const clipEnd = this.state.extremeStop || this.player.getCurrentTime();
          const clipWidth = (clipEnd - this.state.extremeStart) / this.state.totalTime;
          const clipLeft = this.state.extremeStart / this.state.totalTime;
          this.extremeClip.css({
            left: `${clipLeft * 100}%`,
            width: `${clipWidth * 100}%`,
          });
        }

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
  }

  handleMouseUp() {
    this.setState({
      seek: false,
    });

    const seekTime = this.state.totalTime * this.state.offset;
    this.player.seekTo(seekTime, true);
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
      return <i className="fa fa-spinner fa-pulse fa-3x fa-fw" />;
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
            <div id="moments" />
            <div
              className="playHead"
              id="playHead"
              onMouseDown={this.handleMouseDown}
              onMouseUp={this.handleMouseUp}
            />
          </div>
        </section>

        <section className="player-info row">
          <div id="stats" className="small-6 columns">
            <div>
              <span id="timeElapsed" /> / <span id="totalTime" />
            </div>
            <div id="percentageComplete" />
          </div>
          <div className="player-buttons small-6 columns">
            <button
              className="button"
              onClick={this.handleExtreme}
            >
              <i className="fa fa-thumbs-up" />
              {this.state.extreme ? 'Extreme Stop' : 'Extreme Start'}
            </button>
            <button className="button alert">
              <i className="fa fa-thumbs-down" />
              Lame
            </button>
          </div>
        </section>
      </div>
    );
  }
}

PlayerWindow.propTypes = {
  videos: React.PropTypes.array,
  channel_id: React.PropTypes.any,
};
