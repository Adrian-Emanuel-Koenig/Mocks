import ProductosDaoMongoDB from "../daos/super/ProductosDaoMongoDb.js";
import MensajesDaoMongoDB from "../daos/super/MensajesDaoMongoDB.js";
export const productos = new ProductosDaoMongoDB();
export const mensajes = new MensajesDaoMongoDB()