"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const winston_1 = __importDefault(require("../config/winston"));
const app = express_1.default();
const port = 8080; // default port to listen
// middleware
app.use(morgan_1.default("combined", { stream: winston_1.default.stream }));
// define a route handler for the default home page
app.get("/", (req, res) => {
    res.send("Hello world!");
});
// start the Express server
app.listen(port, () => {
    console.log(`Server started at PORT ${port}`);
});
//# sourceMappingURL=index.js.map