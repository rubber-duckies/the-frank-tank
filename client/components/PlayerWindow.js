import React from 'react';

export default class PlayerWindow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: 'RubberDucky',
    };
  }

  render() {
    return (
      <div>This is {this.state.user}'s PlayerWindow
        <div className="flex-video widescreen">
          <div id="player" />
        </div>

        <section className="player-controls" id="playerControls">
          <div className="timeline" id="timeline">
            <div className="playHead" id="playHead" />
          </div>
        </section>

      </div>
    );
  }
}
