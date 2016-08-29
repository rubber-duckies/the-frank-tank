import React from 'react';

export default class NavBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: 'RubberDucky',
    };
  }

  render() {
    return (
      <div>This is {this.state.user}'s NavBar
        <div className="navigation">
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/">Channels</a></li>
            <li><a href="/">Logout</a></li>
            <li><a href="/channel">Get Channel</a></li>
          </ul>
        </div>
      </div>
    );
  }
}
