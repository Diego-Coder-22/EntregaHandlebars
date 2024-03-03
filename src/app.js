import express from "express";
import http from "http";
import handlebars from "express-handlebars";
import { Server } from "socket.io"
import bodyParser from "body-parser";
import __dirname from "./util.js";
import productRouter from "./routes/product.router.js";
import cartRouter from "./routes/cart.router.js";
import viewRouter from "./routes/views.router.js";

const app = express();
const httpServer = http.createServer(app);

// Middleware para analizar el cuerpo de la solicitud JSON
app.use(express.json());

// Ruta para productos y carritos
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);

// Middleware adicional para analizar el cuerpo de la solicitud JSON en cartRouter
app.use(bodyParser.json());

app.use(express.urlencoded({ extended: true }));

// Middleware para usar plantillas HTML

//Motor de plantillas
app.engine("handlebars", handlebars.engine()); 
app.set("view engine", "handlebars");

app.set("views", __dirname + "/views"); // Carpeta de vistas
app.use(express.static(__dirname + "/public"));
app.use("/", viewRouter);

const PORT = 8080;

// Servidor HTTP
httpServer.listen(PORT, () => {
    console.log("Servidor conectado con exito");
});

// Servidor WebSocket
export const io = new Server(httpServer);

let messages = [];

io.on('connection', socket => {
    console.log("Nuevo cliente conectado con exito");

    socket.on('message', data => {
        messages.push(data);
        io.emit("messageLogs", messages)
    })
})