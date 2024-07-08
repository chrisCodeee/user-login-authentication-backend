const mongoose = require("mongoose");
const db = require("./keys").MongoURL;

mongoose
	.connect(db)
	.then(() => console.log("Connected to Mongodb........................"))
	.catch((err) => console.error(`Could not connect to Monogodb............. ${err}`));
