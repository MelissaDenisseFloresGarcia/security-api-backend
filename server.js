const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const fs = require("fs");

const productsRoutes = require("./routes/products");

const app = express();

const PORT = 3000;

const SECRET_KEY = "elf-secret-key";


// Crear carpeta de logs
fs.mkdirSync("/app/logs", { recursive: true });


// Obtener IP del cliente
function getClientIp(req) {

    const forwarded = req.headers["x-forwarded-for"];

    let ip = forwarded
        ? forwarded.split(",")[0].trim()
        : req.socket.remoteAddress || "-";

    ip = ip.replace(/^::ffff:/, "");

    return ip;
}


// Registro de solicitudes HTTP para Fail2Ban
function accessLogger(req, res, next) {

    res.on("finish", () => {

        const ip = getClientIp(req);

        const logLine =
            `${new Date().toISOString()} ${ip} "${req.method} ${req.originalUrl}" ${res.statusCode}\n`;

        fs.appendFile(
            "/app/logs/http.log",
            logLine,
            (error) => {

                if (error) {
                    console.error(
                        "Error writing HTTP log:",
                        error
                    );
                }

            }
        );

    });

    next();
}


app.use(cors());

app.use(express.json());


// Activar registro HTTP
app.use(accessLogger);


// Middleware para validar JWT
function verifyToken(req, res, next) {

    const authHeader = req.headers.authorization;

    if (!authHeader) {

        return res.status(401).json({
            message: "No authorization token provided"
        });

    }

    const token = authHeader.split(" ")[1];

    try {

        const decoded = jwt.verify(
            token,
            SECRET_KEY
        );

        req.user = decoded;

        next();

    } catch (error) {

        return res.status(403).json({
            message: "Invalid token"
        });

    }

}


// Ruta de prueba
app.get("/", (req, res) => {

    res.json({
        message: "e.l.f. Backend running"
    });

});


// Productos protegidos por JWT
app.use(
    "/products",
    verifyToken,
    productsRoutes
);


// Iniciar servidor
app.listen(PORT, () => {

    console.log(
        `Backend running on port ${PORT}`
    );

});