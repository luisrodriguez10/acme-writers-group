import React, { Component } from "react";
import {
  deleteStory,
  createStory,
  likeStory,
  fetchUser,
  fetchUserStories,
} from "../api";

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
    const user = await fetchUser(this.props.userId);
    this.setState({ user });
    const stories = await fetchUserStories(this.props.userId);
    this.setState({ stories });
  }
  async componentDidUpdate(prevProps) {
    if (prevProps.userId !== this.props.userId) {
      const user = await fetchUser(this.props.userId);
      this.setState({ user });
      const stories = await fetchUserStories(this.props.userId);
      this.setState({ stories });
    }
  }

  async deleteAStory(story) {
    await deleteStory(story);
    const stories = this.state.stories.filter(
      (_story) => _story.id !== story.id
    );
    this.setState({ stories });
  }

  async createAStory(user) {
    const story = await createStory(user);
    const stories = [...this.state.stories, story];
    this.setState({ stories });
  }

  async favorite(story) {
    const favorite = true;
    const storyUpdated = await likeStory({ story, favorite });
    let newStories = [];
    this.state.stories.map((_story) => {
      if (_story.id === storyUpdated.id) {
        _story.favorite = true;
      }
      newStories.push(_story);
    });

    this.setState({ stories: newStories });
  }

  async unfavorite(story) {
    const favorite = false;
    const storyUpdated = await likeStory({ story, favorite });
    let newStories = [];
    this.state.stories.map((_story) => {
      if (_story.id === storyUpdated.id) {
        _story.favorite = false;
      }
      newStories.push(_story);
    });

    this.setState({ stories: newStories });
  }

  render() {
    const { user, stories } = this.state;
    const { deleteAStory, createAStory, unfavorite, favorite } = this;
    return (
      <div>
        <button className="AddStory"
          onClick={() => {
            createAStory(user);
          }}
        >
          Create a Story for {user.name}
        </button>
        <h2> Details for {user.name} (# Stories: {stories.length})</h2>
        <p>{user.bio}</p>
        <ul id="UserStory">
          {stories.map((story) => {
            return (
              <li key={story.id}>
                <div id="Title">
                  <h4 className={story.favorite ? "TitleFavorite" : ""}>
                    {story.title}
                  </h4>
                  <button
                    id="DeleteStory"
                    onClick={() => {
                      deleteAStory(story);
                    }}
                  >
                    X
                  </button>{" "}
                  {story.favorite ? (
                    <button
                      onClick={() => {
                        unfavorite(story);
                      }}
                    >
                      Unfavorite
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        favorite(story);
                      }}
                    >
                      Make Favorite
                    </button>
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
