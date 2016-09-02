import React from 'react';
import { changeChannel } from '../models/navModel';

export default class NavBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: 'RubberDucky',
    };

    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    $('.dropdown').foundation();
  }

  handleClick(e) {
    this.props.updateChannel(e.target.id);
    // console.log(e.target.id);
  }

  render() {
    return ( 
      <ul className="dropdown menu" data-dropdown-menu>
        <li><a href="/">Home</a></li>
        <li className="is-dropdown-submenu-parent">
          <a>Channels</a>
          <ul className="menu">
            <li><a onClick={this.props.changeChannel.bind(this.props.that, 2)}>Sea</a></li>
            <li><a onClick={this.props.changeChannel.bind(this.props.that, 3)}>Air</a></li>
            <li><a onClick={this.props.changeChannel.bind(this.props.that, 1)}>Land</a></li>
          </ul>
        </li>
        <li><a href='/'>Logout</a></li>
      </ul>
    );
  }
}
