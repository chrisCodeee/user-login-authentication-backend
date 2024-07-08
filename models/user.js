const mongoose = require("mongoose");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");

const userSchema = mongoose.Schema({
	name: {
		type: String,
		required: true,
		minlength: 3,
		maxlength: 255,
	},
	email: {
		type: String,
		required: true,
		minlength: 3,
		maxlength: 255,
		unique: true,
	},
	password: {
		type: String,
		required: true,
		minlength: 8,
		maxlength: 1024,
	},
	date: {
		type: Date,
		default: Date.now,
	},
});

const PassportAuthUser = mongoose.model("PassportAuthUser", userSchema);

const passwordComplexityOptions = {
	min: 8,
	max: 30,
	lowerCase: 1,
	upperCase: 1,
	numeric: 1,
	symbol: 1,
	// requirementCount: 4,
};

function validateRegisterUser(user) {
	const schema = Joi.object({
		name: Joi.string().min(3).max(255).required().messages({
			"string.empty": "Name is required",
			"string.min": "Name should be at least 3 characters",
			"string.max": "Name should be at most 255 characters",
		}),
		email: Joi.string().min(3).max(255).required().email().messages({
			"string.empty": "Email address is required",
			"string.min": "Password should be at least 8 characters",
			"string.max": "Password be at most 30 characters",
			"string.email": "Email address must be a valid email",
		}),
		password: passwordComplexity(passwordComplexityOptions).required().messages({
			"string.empty": "Enter your password",
		}),
		confirmPassword: Joi.string().required().messages({
			"string.empty": "Confirm your password",
		}),
	});

	return schema.validate(user);
}

function validateLoginUser(user) {
	const schema = Joi.object({
		email: Joi.string().min(3).max(255).required().email(),
		password: passwordComplexity(passwordComplexityOptions).required(),
	});

	return schema.validate(user);
}

module.exports.PassportAuthUser = PassportAuthUser;
module.exports.validateRegisterUser = validateRegisterUser;
module.exports.validateLoginUser = validateLoginUser;
