import React from 'react';
import NavBar from './NavBar';

export default class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: 'username',
      password: 'password',
      responseMessage: null
    };

    this.handleUsernameChange= this.handleUsernameChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillMount() {
  }

  componentDidMount() {
  }

  componentDidUpdate() {
  }

  handleUsernameChange(event) {
    this.setState({username: event.target.value});
  }

  handlePasswordChange(event) {
    this.setState({password: event.target.value});
  }

  checkLoginCredentials(userdata){
    var settings = {
      "async": true,
      "crossDomain": true,
      "url": "/login",
      "method": "POST",
      "headers": {
        "content-type": "application/json"
      },
      "data": JSON.stringify(userdata)
    }

    $.ajax(settings).done(function (response) {
 
    });
  }

  handleSubmit() {
    let user = this.state.username;
    let pass = this.state.password;
    this.checkLoginCredentials({'username': user, 'password': pass});
  }

  render() {
    return (
      <form>
        <label htmlFor="username">Username:</label>
        <input type="text" placeholder="username" onChange={this.handleUsernameChange} />
        <label htmlFor="password">Password:</label>
        <input type="password" placeholder="password" onChange={this.handlePasswordChange} />
        <button type="button" className="submit-dd" onClick={this.handleSubmit} >Login</button>
      </form>
    );
  }
}
