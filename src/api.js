import axios from "axios";
import { faker } from "@faker-js/faker";

const fetchUsers = async () => {
  const response = await axios.get("/api/users");
  return response.data;
};

const fetchUser = async(userId)=>{
    const response = await axios.get(`/api/users/${userId}`);
    return response.data;
}

const fetchUserStories = async(userId)=>{
    const response = await axios.get(`/api/users/${userId}/stories`);
    return response.data;
}

const createUser = async () => {
  const response = await axios.post("/api/users");
  return response.data;
};

const createStory = async (user) => {
  const response = await axios.post(`/api/users/${user.id}/stories`, {
    title: faker.random.words(5),
    body: faker.lorem.paragraphs(5),
    favorite: false,
    userId: user.id,
  });
  return response.data;
};

const likeStory = async ({story, favorite}) => {
  const response = await axios.put(`/api/stories/${story.id}`, {
    favorite
  });
  return response.data;
};

const deleteUser = async (user) => {
  await axios.delete(`/api/users/${user.id}`);
};

const deleteStory = async (story) => {
  await axios.delete(`/api/stories/${story.id}`);
};

export {
  fetchUsers,
  createUser,
  deleteUser,
  deleteStory,
  createStory,
  likeStory,
  fetchUser,
  fetchUserStories
};
