const db = require("./db");
const { STRING, TEXT, BOOLEAN } = db.Sequelize;

const Story = db.define("stories", {
  title: {
    type: STRING,
    allowNull: false,
  },
  body: {
    type: TEXT,
    allowNull: false,
  },
  favorite: {
    type: BOOLEAN,
  },
});

module.exports = Story;
