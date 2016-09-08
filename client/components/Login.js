import React from 'react';
import NavBar from './NavBar';

export default class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {username: 'username', password: 'password'};
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
    $.ajax({
      url: '/login',
      dataType: 'json',
      type: 'POST',
      data: JSON.stringify(userdata)
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    let user = this.state.username;
    let pass = this.state.password;
    checkLoginCredentials({'username': user, 'password': pass});
  }

  render() {
    return (
      <form onSubmit={(e)=>this.handleSubmit.bind(this, e)}>
        <label htmlFor="username">Username:</label>
        <input type="text" value={this.state.username} onChange={(e)=>this.handleUsernameChange.bind(this,e)} />
        <label htmlFor="password">Password:</label>
        <input type="text" value={this.state.password} onChange={(e)=>this.handlePasswordChange.bind(this,e)} />
        <input className="submit-dd" type="submit" value="Log In" />
      </form>
    );
  }
}
