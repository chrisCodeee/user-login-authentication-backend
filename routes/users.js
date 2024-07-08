const express = require("express");
const { PassportAuthUser, validateRegisterUser, validateLoginUser } = require("../models/user");
const lodash = require("lodash");
const bcrypt = require("bcrypt");
const router = express.Router();

// Register users
router.post("/register", async (req, res) => {
	const { error } = validateRegisterUser(req.body);
	if (error) return res.status(400).send(error.details[0].message);
	if (req.body.password !== req.body.confirmPassword) return res.status(400).send("Password do not match");

	let user = await PassportAuthUser.findOne({ email: req.body.email });
	if (user) return res.status(400).send("User already registered, please login");

	user = new PassportAuthUser(req.body);

	try {
		const salt = await bcrypt.genSalt(10);
		user.password = await bcrypt.hash(user.password, salt);

		await user.save();

		res.send(lodash.pick(user, ["_id", "name", "email"]));
	} catch (err) {
		res.send("Something went wrong!");
		console.log(err);
	}
});

router.post("/login", async (req, res) => {
	const { error } = validateLoginUser(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	const user = await PassportAuthUser.findOne({ email: req.body.email });
	if (!user) return res.status(400).send("Invalid email or password");

	const validPassword = await bcrypt.compare(req.body.password, user.password);
	if (!validPassword) return res.status(400).send("Invalid email or password.");

	res.send(lodash.pick(user, ["_id", "name", "email"]));
});

module.exports = router;
