import React from 'react';
import PlayerWindow from './PlayerWindow';
import NavBar from './NavBar';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: 'Frank',
    };
  }

  render() {
    return (
      <div>
        <NavBar />
        <PlayerWindow />
      </div>
    );
  }
}
