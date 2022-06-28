import React, { Component } from 'react';
import { render } from 'react-dom';
import Users from './Components/Users';
import User from './Components/User';
import {fetchUsers, createUser, deleteUser} from './api';

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
      const users = await fetchUsers()
      this.setState({ users});
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
    const user = await createUser();
    const users = [...this.state.users, user];
    this.setState({users});
    window.location.hash = `#${user.id}`
  }

  async deleteAUser(user){
    await deleteUser(user);
    const users = this.state.users.filter(_user => _user.id !== user.id);
    this.setState({users});
    if(this.state.userId){
      window.location.hash = '';
    }
  }

  render(){
    const { users, userId } = this.state;
    const { deleteAUser, createAUser } = this;
    return (
      <div>
        <h1><a href='#'>Acme Writers Group ({ users.length })</a></h1>
        <main>
          <section id='Users'>
            <button className='AddUser' onClick={createAUser}>Add a User</button>
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


