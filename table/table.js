const { mysql } = require('../options/mysql');
const { sqlite } = require('../options/sqlite');
const knexProduct = require('knex')(mysql);
const knexChat = require('knex')(sqlite);

/* ----------------------------- Tabla Productos ---------------------------- */
knexProduct.schema
  .hasTable('libros')
  .then((existe) => {
    !existe &&
      knexProduct.schema
        .createTable('libros', (table) => {
          table.increments('id'), table.string('nombre'), table.integer('precio'), table.integer('stock'), table.string('img');
        })
        .catch((err) => {
          console.log(err);
          throw new Error(err);
        })
        .finally(() => {
          knexProduct.destroy();
        });
    console.log('Tabla creada con éxito.');
  })
  .catch((err) => {
    console.log(err);
    throw new Error(err);
  })
  .finally(() => {
    knexProduct.destroy();
  });

/* ------------------------------- Tabla Chat ------------------------------- */
knexChat.schema
  .hasTable('chats')
  .then((existe) => {
    !existe &&
      knexChat.schema
        .createTable('chats', (table) => {
          table.increments('id'), table.string('email'), table.string('mensaje'), table.string('hora');
        })
        .catch((err) => {
          console.log(err);
          throw new Error(err);
        })
        .finally(() => {
          knexChat.destroy();
        });
    console.log('Tabla creada con éxito.');
  })
  .catch((err) => {
    console.log(err);
    throw new Error(err);
  })
  .finally(() => {
    knexChat.destroy();
  });
  