
exports.up = (knex, Promise) => Promise.all([
	knex.schema.dropTableIfExists('users'),
]);

exports.down = (knex, Promise) => Promise.all([

]);
