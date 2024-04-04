"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const signin_1 = require("./signin");
const signout_1 = require("./signout");
const stream_1 = require("./stream");
const router = (0, express_1.Router)();
router.use('/', signin_1.signinRouter, signout_1.signoutRouter, stream_1.userStreamRouter);
exports.default = router;
