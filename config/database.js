const {
  username,
  password,
  database,
  host,
} = require('./index').db;

module.exports = {
  development: {
    username,
    password,
    database,
    host,
    dialect: 'postgres',
    seederStorage: 'sequelize'
  },
  production: {
    use_env_variable: 'postgres://laejledsdnyxad:05e124d073402a3c40a0f883054e81bdb6e5223a028f47c22beeb17ad124c3b7@ec2-54-163-47-62.compute-1.amazonaws.com:5432/dbmrom5ft75b8v',
    dialect: 'postgres',
    seederStorage: 'sequelize',
  }
};
