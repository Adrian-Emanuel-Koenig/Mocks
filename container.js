const Knex = require('knex');

class Contenedor {
  constructor(config, table) {
    this.Knex = Knex(config);
    this.table = table;
  }

  async save(product) {
    return this.Knex(this.table)
      .insert(product)
      .then((res) => {
        console.log(res);
      })
  }

  async getAll() {
    return this.Knex
      .from(this.table)
      .select('*')
      .then((res) => {
        return res;
      })
  }

  async getById(id) {
    return this.Knex
      .from(this.table)
      .where('id', '=', id)
      .then((res) => {
        return res;
      })
  }

  async deleteById(id) {
    return this.Knex
      .from(this.table)
      .where('id', '=', id)
      .del()
      .then((res) => {
        console.log(res);
      })
  }

  async deleteAll() {
    return this.Knex
    .from(this.table)
    .del()
    .then((res) => {
      console.log(res);
    })
  }
}

module.exports = Contenedor;
