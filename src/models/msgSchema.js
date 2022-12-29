import { Schema, model } from "mongoose";

const mensajesSchema = new Schema({
  author: {
    email: { type: String, required: true, max: 50 },
    nombre: { type: String, required: true, max: 20 },
    apellido: { type: String, required: true, max: 20 },
    edad: { type: Number, required: true, min: 0 },
    alias: { type: String, required: true, max: 20 },
    avatar: { type: String, required: true },
  },
  text: { type: String, required: true },
  timestamp: { type: String },
});

export default model("mensajes", mensajesSchema);
