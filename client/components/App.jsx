import React from 'react';
import PlayerWindow from './PlayerWindow.jsx';
import NavBar from './NavBar.jsx';

export default class App extends React.Component {
  render() {
    return (
      <div>
        <NavBar />
        <PlayerWindow />
      </div>
    );
  }
}
