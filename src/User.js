import React, { Component } from "react";
import axios from "axios";
import { faker } from "@faker-js/faker";

class User extends Component {
  constructor() {
    super();
    this.state = {
      user: {},
      stories: [],
    };
    this.deleteAStory = this.deleteAStory.bind(this);
    this.createAStory = this.createAStory.bind(this);
    this.favorite = this.favorite.bind(this);
    this.unfavorite = this.unfavorite.bind(this);
  }
  async componentDidMount() {
    let response = await axios.get(`/api/users/${this.props.userId}`);
    this.setState({ user: response.data });
    response = await axios.get(`/api/users/${this.props.userId}/stories`);
    this.setState({ stories: response.data });
  }
  async componentDidUpdate(prevProps) {
    if (prevProps.userId !== this.props.userId) {
      let response = await axios.get(`/api/users/${this.props.userId}`);
      this.setState({ user: response.data });
      response = await axios.get(`/api/users/${this.props.userId}/stories`);
      this.setState({ stories: response.data });
    }
  }

  async deleteAStory(story) {
    await axios.delete(`/api/stories/${story.id}`);
    const stories = this.state.stories.filter(
      (_story) => _story.id !== story.id
    );
    this.setState({ stories });
  }

  async createAStory(user) {
    const response = await axios.post(`/api/users/${user.id}/stories`, {
      title: faker.random.words(5),
      body: faker.lorem.paragraphs(5),
      favorite: faker.datatype.boolean(),
      userId: user.id,
    });
    const story = response.data;
    const stories = [...this.state.stories, story];
    this.setState({ stories });
  }

  async favorite(story){
    const response = await axios.put(`/api/stories/${story.id}`,{
      favorite: true
    })
    const storyUpdated = response.data;
    let newStories = [];
    this.state.stories.map(_story => {

      if(_story.id === storyUpdated.id){
        _story.favorite = true;
      }
      newStories.push(_story);
    })

    this.setState({stories: newStories});
  }

  async unfavorite(story){
    const response = await axios.put(`/api/stories/${story.id}`,{
      favorite: false
    })
    const storyUpdated = response.data;
    let newStories = [];
    this.state.stories.map(_story => {

      if(_story.id === storyUpdated.id){
        _story.favorite = false;
      }
      newStories.push(_story);
    })

    this.setState({stories: newStories});
  }

  render() {
    const { user, stories } = this.state;
    const { deleteAStory, createAStory, unfavorite, favorite } = this;
    return (
      <div>
        <button
          onClick={() => {
            createAStory(user);
          }}
        >
          Create a Story for {user.name}
        </button>
        <h2> Details for {user.name}</h2>
        <p>{user.bio}</p>
        <ul id="UserStory">
          {stories.map((story) => {
            return (
              <li key={story.id}>
                <div id="Title">
                  <h4 className={story.favorite ? 'TitleFavorite' : ''}>{story.title}</h4>
                  <button
                    id="DeleteStory"
                    onClick={() => {
                      deleteAStory(story);
                    }}
                  >
                    X
                  </button>{" "}
                  {story.favorite ? (
                    <button onClick={() => {unfavorite(story)}}>Unfavorite</button>
                  ) : (
                    <button onClick={() => {favorite(story)}}>Make Favorite</button>
                  )}
                </div>
                <p>{story.body}</p>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}

export default User;
