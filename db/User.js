const db = require('./db');
const {STRING, TEXT} = db.Sequelize;
const Story = require('./Story');

const User = db.define('users', {
    name: {
        type: STRING,
        allowNull: false
    },
    bio: {
        type: TEXT
    }
})

User.addHook('beforeDestroy', async(user) =>{
    await Story.destroy({
        where:{
            userId: user.id
        }
    });
});

User.hasMany(Story);

module.exports = User;