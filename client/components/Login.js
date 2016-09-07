import React from 'react';

export default class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentWillMount() {
  }

  componentDidMount() {
  }

  componentDidUpdate() {
  }

  getInitialState() {
    return {username: 'username', password: 'password'};
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
      <div>
        <section id="login-section">
          <h2>Login</h2>
          <form id="login-form" onSubmit={this.handleSubmit}>
            <label for="username">Username:</label>
            <input type="text" value={this.state.username} onChange={this.handleUsernameChange} />
            <br />
            <label for="password">Password:</label>
            <input type="text" value={this.state.password} onChange={this.handlePasswordChange} />
            <br />
            <input type="submit" value="Log In" />
          </form>
        </section>
      </div>
    );
  }
}

