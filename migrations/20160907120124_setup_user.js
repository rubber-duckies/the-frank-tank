
exports.up = (knex, Promise) => Promise.all([
  knex.schema.createTableIfNotExists('users', table => {
    table.increments('id');
    table.string('username');
    table.string('password');
  }),
]);

exports.down = (knex, Promise) => Promise.all([
  knex.schema.dropTableIfExists('users'),
]);
