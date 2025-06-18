"use strict";
//@ts-nocheck
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../../config"));
const secretMap = {
    access: config_1.default.accessTokenSecret,
    refresh: config_1.default.refreshTokenSecret,
    reset: config_1.default.forget_pass_secret,
};
const expireMap = {
    access: config_1.default.accessTokenExp,
    refresh: config_1.default.refreshTokenExp,
    reset: config_1.default.forget_pass_exp,
};
const generateToken = (user, type = "access") => {
    // console.log(user);
    return jsonwebtoken_1.default.sign({
        id: user.id,
        email: user.email,
        role: user.role,
    }, secretMap[type], {
        expiresIn: expireMap[type],
    });
};
exports.generateToken = generateToken;
const verifyToken = (token, secret) => {
    return jsonwebtoken_1.default.verify(token, secret);
};
exports.verifyToken = verifyToken;
