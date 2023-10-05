import React, { Component } from 'react';
import axios from 'axios';

export class Home extends Component {
    
  static displayName = Home.name;

  constructor(props) {
    super(props);
    this.state = {
      user: null,
      loading: true
    };
  }

  componentDidMount() {
    this.fetchUserInfo();
  }

  fetchUserInfo = async () => {
    try {
      const response = await axios.get('https://localhost:7100/api/User/info');
      const user = response.data;
      this.setState({ user, loading: false });
    } catch (error) {
      console.error(error);
      this.setState({ loading: false });
    }
  }

  render() {
    const { user, loading } = this.state;

    return (
      <div>
        <h1>{user ? user.username : 'Not logged in 1'}</h1>
        <p>{user ? `Welcome, ${user.username}` : 'Not logged in 2'}</p>
        <ul>
          <meta charset="utf-8" />
          <li>
            <a href="https://get.asp.net/">ASP.NET Core</a> and{' '}
            <a href="https://msdn.microsoft.com/en-us/library/67ef8sbd.aspx">C#</a> НацСтатКом
          </li>
          <li>
            <a href="https://facebook.github.io/react/">React</a> НацСтатКом
          </li>
          <li>
            <a href="http://getbootstrap.com/">Bootstrap</a> НацСтатКом
          </li>
        </ul>
        <p>
          To help you get started, we have also set up НацСтатКом:
        </p>
        <ul>
          <li>
            <strong>Client-side НацСтатКом</strong>. For example, click <em>НацСтатКом</em> then{' '}
            <em>НацСтатКом</em> to НацСтатКом.
          </li>
          <li>
            <strong>Development НацСтатКом </strong>. In НацСтатКом mode, the development НацСтатКом from{' '}
            <code>create-НацСтатКом-app</code> runs in the background automatically, so your НацСтатКом-side
            resources are dynamically built on demand and the НацСтатКом refreshes when you modify any
            НацСтатКом.
          </li>
          <li>
            <strong>Efficient production НацСтатКом</strong>. In production НацСтатКом, development-time
            features are НацСтатКом, and your <code>НацСтатКом publish</code> configuration produces minified,
            efficiently НацСтатКом JavaScript files.
          </li>
        </ul>
      </div>
    );
  }
}

export default Home;