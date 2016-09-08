import React from 'react';
import NavBar from './NavBar';

export default class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {username: 'username', password: 'password'};

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
    console.log("login-userdata: ", userdata)
    $.ajax({
      url: '/login',
      dataType: 'json',
      type: 'POST',
      data: JSON.stringify(userdata)
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
        <input type="text" onChange={this.handleUsernameChange} />
        <label htmlFor="password">Password:</label>
        <input type="password" onChange={this.handlePasswordChange} />
        <button type="button" onClick={this.handleSubmit} >Signup</button>
      </form>
    );
  }
}
