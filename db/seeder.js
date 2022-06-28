var pgtools = require("pgtools");
const config = {
  user: process.env.USER || "postgress",
  host: process.env.HOST || "localhost",
  password: process.env.PASSWORD || "",
  port: process.env.PORT || 5432,
};

const db = require("./db");
const User = require("./User");
const Story = require("./Story");
const { USERS, STORIES } = require("./seed-data");

(async function seedDatabase() {
  try {
    await pgtools.dropdb(config, "acme-writers-group", function (err, res) {
      if (err) {
        console.warn(err);
      }
    });

    await pgtools.createdb(config, "acme-writers-group", function (err, res) {
      if (err) {
        console.warn("Couldn't create the database...");
      }
      if (res) {
        console.log("Database created.");
      }
    });

    await db.sync({ force: true });

    //Prepopulate User data
    await Promise.all(USERS.map((user) => User.create(user)));
    await Promise.all(STORIES.map((story) => Story.create(story)));
  } catch (e) {
    console.warn(`Something went wrong. ${e}`);
  }
})();
