const express = require("express");
const cors = require("cors");

const app = express();

// Permitir solicitudes desde el frontend
app.use(cors());

// Permitir recibir JSON
app.use(express.json());

const PORT = 3000;

const API_KEY = "my-secret-key";


// Endpoint público
app.get("/health", (req, res) => {

    res.json({
        status: "ok"
    });

});


// Revisar API Key
function checkApiKey(req, res, next) {

    const key = req.headers["x-api-key"];

    if (!key || key !== API_KEY) {

        return res.status(401).json({
            error: "Unauthorized"
        });

    }

    next();

}


// GET protegido
app.get("/api/data", checkApiKey, (req, res) => {

    res.json({
        message: "Protected data",
        course: "Security Exercise",
        status: "success"
    });

});


// POST protegido
app.post("/api/data", checkApiKey, (req, res) => {

    res.json({
        message: "POST received"
    });

});


// Iniciar servidor
app.listen(PORT, () => {

    console.log(`Server running on port ${PORT}`);

});