exports.seed = async function (knex) {
  await knex('users').truncate();
  await knex('users').insert([{ username: 'Ben4', password: 'testing!' }]);
};
