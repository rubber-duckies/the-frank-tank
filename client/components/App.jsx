import React from 'react';
import ReactDOM from 'react-dom';
import PlayerWindow from './PlayerWindow.jsx';
import NavBar from './NavBar';

class App extends React {
  render() {
    return (
      <div>
        <NavBar />
        <PlayerWindow />
      </div>
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('example')
);
