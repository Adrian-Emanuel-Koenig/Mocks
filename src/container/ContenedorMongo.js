import model from "../models/prodSchema.js";
import modelCart from "../models/cartSchema.js";
import resultado from "../daos/index.js";

class ContenedorMongo {
  constructor(collection) {
    this.collection = collection;
  }

  async save(obj) {
    try {
      if (this.collection == model) {
        const item = new model(obj);
        const productoNuevo = await item.save();
        return productoNuevo;
      } else {
        const item = new modelCart(obj);
        const carritoNuevo = await item.save();
        return carritoNuevo;
      }
    } catch (error) {
      throw console.log(error);
    }
  }

  async getAll() {
    try {
      return await this.collection.find();
    } catch (error) {
      console.log(error);
    }
  }

  async getById(id) {
    try {
      const productos = await this.getAll(this.collection);
      const findItem = productos.find((el) => el._id == id);
      if (findItem != undefined) {
        return findItem;
      } else {
        return undefined;
      }
    } catch (error) {
      console.log(error);
    }
  }

  async editarProductos(id, body) {
    try {
      const productos = await this.getAll(this.collection);
      const findItem = productos.find((e) => e._id == id);
      if (!findItem) {
        return "Producto no encontrado.";
      } else {
        await this.collection.updateOne({ _id: id }, { $set: body });
        return "Producto editado con éxito.";
      }
    } catch (error) {
      console.log(error);
    }
  }

  async deleteById(id) {
    try {
      const getItem = await this.getById(id);
      if (!getItem) {
        return "No encontrado.";
      } else {
        await this.collection.deleteOne({ _id: id });
        return "Borrado con éxito.";
      }
    } catch (error) {
      console.log(error);
    }
  }

  async addProductToCart(id, body) {
    try {
      const prod = await this.getAll();
      const item = prod.find((e) => e._id == id);
      if (!item) {
        return console.log("Producto no encontrado");
      } else {
        item.productos = [...item.productos, body];
        await this.editarProductos(id, item);
        return item;
      }
    } catch (error) {
      console.log(error);
    }
  }

  async deleteItem(id, id_prod) {
    try {
      let carrito = await this.getById(id);
      const item = carrito.productos.find((e) => e._id == id_prod);
      if (!item) {
        return "Producto no encontrado";
      } else {
        carrito.productos = carrito.productos.filter((e) => e._id != id_prod);
        await this.editarProductos(id, carrito);
        return "Producto eliminado con éxito";
      }
    } catch (error) {
      console.log(error);
    }
  }
}

export default ContenedorMongo;
