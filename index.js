const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
const router = require("./router");
const mongoose = require("mongoose");
//DB Setup

mongoose.connect("mongodb://localhost/auth");

// App Setup

app.use(morgan("combined"));
app.use(bodyParser.json({ type: "*/*" }));
app.use(cors());
router(app);

// Server Setup

const port = process.env.PORT || 8000;
const server = http.createServer(app);

server.listen(port);
console.log("Server listening on:", port);
