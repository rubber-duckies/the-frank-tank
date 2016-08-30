import React from 'react';
import * as Nav from '../models/navigation.js';

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
          <a href="/">Channels</a>
          <ul className="menu">
            <li><a href="/channel">Sea</a></li>
            <li><a href="/channel">Air</a></li>
            <li><a href="/channel">Land</a></li>
          </ul>
        </li>
        <li><a href="/">Logout</a></li>
      </ul>
    );
  }
}
