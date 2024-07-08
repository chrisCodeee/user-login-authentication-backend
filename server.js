const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 5000;

require("./db/config");

app.use(cors());
app.use(express.json());

app.use("/users", require("./routes/users"));

app.listen(PORT, "0.0.0.0", console.log(`App started on port ${PORT}`));
