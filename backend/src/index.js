const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const auth = require("./controller/auth");

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use("/", auth);

app.get("/", (req, res) => res.send("Backend working fine!"));

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
