"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_route_1 = require("./auth.route");
const router = (0, express_1.Router)();
const apiRoutes = [{ path: "/auth", route: auth_route_1.AuthRoute }];
apiRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
