import ContenedorMongo from "../../container/ContenedorMongo.js";
import productosSchema from "../../models/prodSchema.js";

class ProductosDaoMongoDB extends ContenedorMongo {
  constructor() {
    super(productosSchema);
  }
}

export default ProductosDaoMongoDB;
