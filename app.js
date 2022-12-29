import express from "express";
import { connectionMDB } from "./src/connection/mongoDb.js";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { engine } from "express-handlebars";
import { Router } from "express";
import { Server } from "socket.io";
import http from "http";
import { productos, mensajes } from "./src/controllers/products.js";
import { normalize, schema } from "normalizr";
import { faker } from "@faker-js/faker";

const { product, price, image } = faker;

const app = express();
const port = process.env.port || 8080;
const __dirname = dirname(fileURLToPath(import.meta.url));

const server = http.createServer(app);
const io = new Server(server);

/* -------------------------------------------------------------------------- */
/*                                   Server                                   */
/* -------------------------------------------------------------------------- */

server.listen(port, async () => {
  await connectionMDB;
  console.log("Server on: http://localhost:" + port);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/src/public"));

app.set("view engine", "hbs");
app.set("views", "./src/views");
app.engine(
  "hbs",
  engine({
    extname: ".hbs",
    defaultLayout: "index.hbs",
    layoutsDir: __dirname + "/src/views/layouts",
    partialsDir: __dirname + "/src/views/partials",
  })
);

app.use("/api/productos", Router);

app.get("/", (req, res) => {
  res.render("home");
});

app.use("/api/productos-test", (req, res) => {
  let prodFaker = [];
  for (let i = 0; i < 5; i++) {
    prodFaker.push({
      producto: faker.commerce.product(),
      precio: faker.commerce.price(1000, 4000, 0, "$"),
      image: faker.image.abstract(150, 150),
    });
  }
  res.json(prodFaker);
  // res.render("productslist");
});
/* -------------------------------------------------------------------------- */
/*                                    Faker                                   */
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/*                                Normalización                               */
/* -------------------------------------------------------------------------- */

const authorSchema = new schema.Entity("authors", {}, { idAttribute: "email" });
const messageSchema = new schema.Entity("messages", { author: authorSchema });
const chatSchema = new schema.Entity("chats", { messages: [messageSchema] });
const normalizarData = (data) => {
  const dataNormalizada = normalize(
    { id: "chatHistory", messages: data },
    chatSchema
  );
  return dataNormalizada;
};
const normalizarMensajes = async () => {
  const messages = await mensajes.getAll();
  console.log(messages);
  const normalizedMessages = normalizarData(messages);
  console.log(JSON.stringify(normalizedMessages, null, 4));

  return normalizedMessages;
};

/* -------------------------------------------------------------------------- */
/*                                  Socket.io                                 */
/* -------------------------------------------------------------------------- */

io.on("connection", async (socket) => {
  const products = await productos.getAll();
  socket.emit("allProducts", products);
  socket.on("msg", async (data) => {
    const today = new Date();
    const now = today.toLocaleString();
    await mensajes.save({ timestamp: now, ...data });
    io.sockets.emit("msg-list", await mensajes.getAll());
    io.sockets.emit("msg-list2", await normalizarMensajes());
  });

  socket.on("productoEnviado", saveProduct);
});

async function saveProduct(data) {
  await productos.save(data);
  productos.getAll().then((element) => io.sockets.emit("allProducts", element));
}
