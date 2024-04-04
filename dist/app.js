"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cookie_session_1 = __importDefault(require("cookie-session"));
const body_parser_1 = require("body-parser");
const routes_1 = __importDefault(require("./user/routes"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
exports.app = app;
app.set('trust proxy', true);
app.use((0, body_parser_1.json)());
app.use((0, body_parser_1.urlencoded)({ extended: true }));
app.use((0, cors_1.default)());
app.set('views', 'src/views');
app.set('view engine', 'ejs');
app.use('/public', express_1.default.static('src/public'));
app.use((0, cookie_session_1.default)({
    signed: false,
    secure: false,
}));
app.use('/', routes_1.default);
app.get('/health', (req, res) => {
    res.sendStatus(200);
});
