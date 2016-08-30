
exports.up = (knex, Promise) => Promise.all([
  knex.schema.createTable('channels', table => {
    table.increments('id');
    table.string('name');
    table.string('background');
  }),
  knex.schema.createTable('users', table => {
    table.increments('id');
    table.string('name');
  }),
  knex.schema.createTable('videos', table => {
    table.increments('id');
    table.string('url');
    table.integer('channel_id');
  }),
  knex.schema.createTable('likes', table => {
    table.increments('id');
    table.integer('start_time');
    table.integer('stop_time');
    table.integer('video_id');
  }),
  knex.schema.createTable('likes_by_user', table => {
    table.integer('user_id');
    table.integer('likes_id');
  }),
  knex.schema.createTable('ignores', table => {
    table.integer('user_id');
    table.integer('video_id');
  }),
]);

exports.down = (knex, Promise) => Promise.all([
  knex.schema.dropTable('ignores'),
  knex.schema.dropTable('likes_by_user'),
  knex.schema.dropTable('likes'),
  knex.schema.dropTable('videos'),
  knex.schema.dropTable('users'),
  knex.schema.dropTable('channels'),
]);
