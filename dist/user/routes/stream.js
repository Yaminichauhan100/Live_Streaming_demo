"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userStreamRouter = void 0;
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const router = express_1.default.Router();
exports.userStreamRouter = router;
router.get('/user/stream', (req, res) => {
    var _a;
    // if haslegit cookie render else redirect to login
    if (!((_a = req.session) === null || _a === void 0 ? void 0 : _a.jwt)) {
        res.redirect(403, '../user/signin');
    }
    try {
        jsonwebtoken_1.default.verify(req.session.jwt, process.env.JWT_KEY);
        res.render('userPages/user');
    }
    catch (error) {
        res.redirect(403, '../user/signin');
    }
});
