import ContenedorMongo from "../../container/ContenedorMongo.js";
import msgSchema from "../../models/msgSchema.js";

class MensajesDaoMongoDB extends ContenedorMongo {
  constructor() {
    super(msgSchema);
  }
}

export default MensajesDaoMongoDB;
