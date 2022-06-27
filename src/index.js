import React, { Component } from 'react';
import { render } from 'react-dom';
import axios from 'axios';
import Users from './Users';
import User from './User';

class App extends Component{
  constructor(){
    super();
    this.state = {
      users: [],
      userId: ''
    };
    this.deleteAUser = this.deleteAUser.bind(this);
    this.createAUser = this.createAUser.bind(this);
  }
  async componentDidMount(){
    try {
      const userId = window.location.hash.slice(1);
      this.setState({ userId });
      const response = await axios.get('/api/users');
      this.setState({ users: response.data });
      window.addEventListener('hashchange', ()=> {
      const userId = window.location.hash.slice(1);
      this.setState({ userId });
      });
    }
    catch(ex){
      console.log(ex);
    }

  }

  async createAUser(){
    const response = await axios.post('/api/users');
    const user = response.data;
    const users = [...this.state.users, user];
    this.setState({users});
    window.location.hash = `#${user.id}`
  }

  async deleteAUser(user){
    await axios.delete(`/api/users/${user.id}`)
    const users = this.state.users.filter(_user => _user.id !== user.id);
    this.setState({users, userId: ''});
    window.location.hash = '#';
  }

  render(){
    const { users, userId } = this.state;
    const { deleteAUser, createAUser } = this;
    return (
      <div>
        <h1><a href='#'>Acme Writers Group ({ users.length })</a></h1>
        <main>
          <section id='Users'>
            <button onClick={createAUser}>Add a User</button>
            <Users users = { users } userId={ userId } deleteAUser={deleteAUser}/>
          </section>
          <section id='User'>
            {
              userId ? <User userId={ userId } /> : null
            }
          </section>
        </main>
      </div>
    );
  }
}

const root = document.querySelector('#root');
render(<App />, root);


