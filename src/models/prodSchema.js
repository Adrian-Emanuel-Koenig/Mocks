import { Schema, model } from "mongoose";

const productosSchema = new Schema({
  nombre: { type: String, required: true, max: 100 },
  descripcion: { type: String, required: true, max: 200 },
  precio: { type: Number, required: true, min: 0 },
  stock: { type: Number, required: true, min: 0 },
  thumbnail: { type: String, required: true }
});

export default model("productos", productosSchema);
