"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateController = void 0;
const SendResponse_1 = __importDefault(require("../../utils/SendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const user_service_1 = require("./user.service");
const CreateController = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.body;
        const result = yield (0, user_service_1.insertIntoDbService)(data);
        (0, SendResponse_1.default)(res, {
            statusCode: http_status_1.default.OK,
            success: true,
            message: " User created successfully ",
            data: result,
        });
    }
    catch (err) {
        next(err);
    }
});
exports.CreateController = CreateController;
