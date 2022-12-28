import ContenedorMongo from "../../contenedores/ContenedorMongo.js";
import cartSchema from "../../models/cartSchema.js";

class CarritoDaoMongoDB extends ContenedorMongo {
  constructor() {
    super(cartSchema);
  }
}

export default CarritoDaoMongoDB;
