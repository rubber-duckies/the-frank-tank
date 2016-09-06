import React from 'react';

export default class SignupPage extends React.Component {
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

  attemptSignup(userdata){
    $.ajax({
      url: '/signup',
      dataType: 'json',
      type: 'POST',
      data: JSON.stringify(userdata)
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    let user = this.state.username;
    let pass = this.state.password;
    attemptSignup({'username': user, 'password': pass});
  }

  render() {
    return (
      <div>
        <section id="signup-section">
          <h2>Login</h2>
          <form id="signup-form" onSubmit={this.handleSubmit}>
            <label for="username">Username:</label>
            <input type="text" value={this.state.username} onChange={this.handleUsernameChange} />
            <br />
            <label for="password">Password:</label>
            <input type="text" value={this.state.password} onChange={this.handlePasswordChange} />
            <br />
            <input type="submit" value="Sign Up" />
          </form>
        </section>
      </div>
    );
  }
}
