"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const userController_2 = require("../controllers/userController");
const authrouter = express_1.default.Router();
authrouter.post('/signup', userController_2.signup);
authrouter.post('/signin', userController_1.signin);
exports.default = authrouter;
