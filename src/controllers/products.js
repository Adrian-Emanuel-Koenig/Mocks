import instancia from "../daos/index.js";
export const productos = new instancia.producto();

const allProducts = async (req, res) => {
  try {
    const products = await productos.getAll();
    res.json(products);
  } catch (error) {
    res.json(error);
  }
};

const getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    res.json(await productos.getById(id));
  } catch (error) {
    res.json(error);
  }
};

const postProduct = async (req, res) => {
  try {
    await productos.save(req.body);
    res.json({Mensaje:"Producto añadido con éxito.", Producto: req.body})
  } catch (error) {
    res.json(error);
  }
};

const putProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { body } = req;
    const editarProducto = await productos.editarProductos(id, body);
    res.json(editarProducto);
  } catch (error) {
    res.json(error);
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const itemDeleted= await productos.deleteById(id);
    res.json(itemDeleted);
  } catch (error) {
    res.json(error);
  }
};

export const metodos = {
    allProducts,
    getProduct,
    postProduct,
    putProduct,
    deleteProduct,
  }
