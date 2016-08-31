import React from 'react';
import { changeChannel } from '../models/navModel';

export default class NavBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: 'RubberDucky',
    };
  }

  render() {
    return (
      <ul className="dropdown menu" data-dropdown-menu>
        <li><a href="/">Home</a></li>
        <li className="is-dropdown-submenu-parent">
          <a>Channels</a>
          <ul className="menu">
            <li><a href="/channel/3">Sea</a></li>
            <li><a href="/channel/2">Air</a></li>
            <li><a href="/channel/1">Land</a></li>
          </ul>
        </li>
        <li><button onClick={changeChannel}>Logout</button></li>
      </ul>
    );
  }
}
