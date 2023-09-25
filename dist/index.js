"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const port = 3010;
app.get("/", (req, res) => {
    return res.send("asd");
});
app.listen(port, () => {
    console.log(`🚀 Server is Listening on Port : ${port}`);
});
