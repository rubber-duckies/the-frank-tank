import React from 'react';
import YouTube from 'react-youtube';
import { sendLike, Moment, getMoreVideos } from '../models/videoModel.js';
import $ from '../models/lib/jquery';
import MixtapeModel from '../models/mixtapeModel';

// Use like: <MixtapePlayer user_id="1" />

export default class MixtapePlayer extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      currentVideo: {
        url: null,
        moment: null
      }
    };
    this.momentIterator = null;
    this.currentMoment = null;

    MixtapeModel.getMomentIteratorByUser(this.props.user_id)
      .then((iter) => {
        if (iter !== null) {
          this.momentIterator = iter;
          this.setState({
            currentVideo: {
              url: iter.nextVideo(),
            }
          });
          this.currentMoment = iter.nextMoment();
        }
      });

  }

  // Sets current video
  updateVideo(momentIterator, player, delay) {
    console.log('Delay: ', delay);
    window.setTimeout(() => {
      console.log('In updateVideo Timeout');
      // Have we actually passed the end of the current moment? Video could have been delayed.
      if (player.getCurrentTime() >= this.currentMoment.stop_time) {
        console.log('Next Moment');
        // Do we have another moment for this video?
        if (momentIterator.hasNextMoment()) {
          // We do! set the next moment and seek to it's start_time
          let moment = momentIterator.nextMoment();
          this.currentMoment = moment;
          player.seekTo( moment.start_time );
          // Set next updateVideo timeout
          this.updateVideo(momentIterator, player,
            (moment.stop_time - moment.start_time) * 1000);
          // We don't have another moment. Do we have another video?
        } else if (momentIterator.hasNextVideo()) {
          console.log('Next Video');
          //  We do! set the url for currentVideo so the youtube player can advance
          var url = momentIterator.nextVideo();
          var moment = momentIterator.nextMoment();
          this.setState({
            currentVideo: {
              url: url
            }
          });
          this.currentMoment = moment;
          // Schedule next updateVideo timeout
          this.updateVideo(momentIterator, player,
            (moment.stop_time - moment.start_time) * 1000);
          // We don't have any more moments or videos -- reset and loop again!
        } else {
          this.momentIterator.reset();
          this.setState({
            currentVideo: {
              url: this.momentIterator.nextVideo()
            }
          });
          this.currentMoment = this.momentIterator.nextMoment();
        }
      } else {
        console.log('Not there yet: ', player.getCurrentTime(), ' ', this.currentMoment.stop_time);
        // We have not yet truly reached end of the current moment
        // Schedule next updateVideo timeout
        this.updateVideo(momentIterator, player,
          (this.currentMoment.stop_time - player.getCurrentTime()) * 1000);
      }
    }, delay);
  }
  //(end_time - start_time) * 1000

  // ready state from player API
  handleReadyState(event) {
    console.log('handle ready state');
    var player = event.target;
    var moment = this.currentMoment;
    player.seekTo(moment.start_time);
    console.log('Moment: ', moment);
    var delay = (moment.stop_time - moment.start_time) * 1000;
    console.log('Delay1: ', delay);
    this.updateVideo(this.momentIterator, player, delay);
  }

  handleStateChange(event) {
    console.log(event.target.getPlayerState());

    var player = event.target;
    // When a new video is cued advance to the start_time of the currentMoment
    if (player.getPlayerState() === -1) {
      console.log('Seeking to: ', this.currentMoment.start_time);
      player.seekTo(this.currentMoment.start_time);
    }
  }

  // render either a spinner or youtube component
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
        autoplay: 1
      },
    };

    if (!this.state.currentVideo.url) {
      return <i className="fa fa-spinner fa-pulse fa-3x fa-fw" />;
    }

    return (
      <YouTube
        videoId={this.state.currentVideo.url}
        opts={opts}
        onReady={ this.handleReadyState.bind(this) }
        onStateChange={ this.handleStateChange.bind(this) }
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
            { this.renderVideo() }
          </div>
        </div>
      );
    }

}

MixtapePlayer.propTypes = {
  user_id: React.PropTypes.any,
};
