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
    
  }

  handleSubmit(event) {
    event.preventDefault();
    // submit form handling
  }

  render() {
    return (
      <div>
        <section id="login-section">
          <h2>Login</h2>
          <form id="login-form" onSubmit={this.handleSubmit}>
            <label for="username">Username:</label>
            <input type="text" value={this.state.username} onChange={this.handleChange} />
            <br />
            <label for="password">Password:</label>
            <input type="text" value={this.state.password} onChange={this.handleChange} />
            <br />
            <input type="submit" value="Log In" />
          </form>
        </section>
      </div>
    );
  }
}

