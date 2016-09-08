import React from 'react';
import NavBar from './NavBar';

export default class SignupPage extends React.Component {
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

  attemptSignup(userdata){
    console.log(userdata);

    var settings = {
      "url": "/signup",
      "method": "POST",
      "headers": {
        "content-type": "application/json"
      },
      "data": JSON.stringify(userdata)
    }

    $.ajax(settings).done(function (response) {
      console.log(response);
    });

    // $.ajax({
    //   url: '/signup',
    //   dataType: 'json',
    //   type: 'POST',
    //   data: userdata
    // });
  }

  handleSubmit() {
    let user = this.state.username;
    let pass = this.state.password;
    console.log("user/pass: ",user,pass);
    this.attemptSignup({'username': user, 'password': pass});
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
