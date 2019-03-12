"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
require('dotenv').config();
const app = express_1.default();
const port = process.env.PORT || 8080; // default port to listen
// middleware
app.use(morgan_1.default('combined'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
// start the Express server
app.listen(port, () => {
    console.log(`Server started at PORT ${port}`);
});
//# sourceMappingURL=index.js.map