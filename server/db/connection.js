const monk = require('monk');
const connectionString = 'mongodb://dbUser:321654@vue-todo-shard-00-00-h5kn7.mongodb.net:27017,vue-todo-shard-00-01-h5kn7.mongodb.net:27017,vue-todo-shard-00-02-h5kn7.mongodb.net:27017/Vue-todo?ssl=true&replicaSet=Vue-todo-shard-0&authSource=admin&retryWrites=true';
const db = monk(connectionString);

db.catch((err) => {
    console.log(err);
})

module.exports = db;