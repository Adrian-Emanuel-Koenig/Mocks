/* -------------------------------------------------------------------------- */
/*                                   Server                                   */
/* -------------------------------------------------------------------------- */

/* ---------------------------------- Class --------------------------------- */
const express = require('express');
const app = express();
const port = process.env.port || 8000;
const httpServer = require('http').createServer(app);
const io = require('socket.io')(httpServer);
const { engine } = require('express-handlebars');
const { normalize, schema } = require('normalizr');

// import express from "express";
// import { connectionMDB } from "./src/connection/mongoDb.js";
// import { dirname } from "path";
// import { fileURLToPath } from "url";
// import { engine } from "express-handlebars";
// import { Router } from "express";
// import { normalize, schema } from "normalizr";

// const app = express();
// const port = process.env.port || 8080;
// const __dirname = dirname(fileURLToPath(import.meta.url));
/* ----------------------------------- DB ----------------------------------- */
const { mysql } = require('./options/mysql');
const { sqlite } = require('./options/sqlite');
const Contenedor = require('./container.js');
const Productos = new Contenedor(mysql, 'libros');
const Chats = new Contenedor(sqlite, 'chats');
/* --------------------------------- Config --------------------------------- */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'hbs');
app.set('views', './views');
app.engine(
  'hbs',
  engine({
    extname: '.hbs',
    defaultLayout: 'index.hbs',
    layoutsDir: __dirname + '/views/layouts',
    partialsDir: __dirname + '/views/partials',
  })
);
httpServer.listen(port, () => console.log('SERVER ON http://localhost:' + port));

app.get('/', async (req, res) => {
  res.render('home');
});
/* -------------------------------------------------------------------------- */
/*                                Normalización                               */
/* -------------------------------------------------------------------------- */
const authorSchema = new schema.Entity('authors', {}, { idAttribute: 'email' }); 
const messageSchema = new schema.Entity('messages', {
  author: authorSchema,
});
const chatSchema = new schema.Entity('chats', {
  messages: [messageSchema],
});
const normalizarData = (data) => {
  const dataNormalizada = normalize({ id: 'chatHistory', messages: data }, chatSchema);
  return dataNormalizada;
};
const normalizarMensajes = async () => {
  const messages = await Chats.getAll(); 
  const normalizedMessages = normalizarData(messages);
  return normalizedMessages;
};
/* -------------------------------------------------------------------------- */

io.on('connection', async (socket) => {
  const products = await Productos.getAll();
  socket.emit('allProducts', products);
  socket.on('msg', async (data) => {
    await Chats.save({ hora: Date(), ...data });
    io.sockets.emit('msg-list', await Chats.getAll());
  });

  socket.on('productoEnviado', saveProduct);
});

async function saveProduct(data) {
  await Productos.save(data);
  Productos.getAll().then((element) => io.sockets.emit('allProducts', element));
}
