"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_route_1 = require("../modules/User/user.route");
const patient_route_1 = require("../modules/Patient/patient.route");
const auth_route_1 = require("../modules/Auth/auth.route");
const router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: "/users",
        route: user_route_1.UserRoutes,
    },
    {
        path: "/patient",
        route: patient_route_1.PatientRoutes,
    },
    {
        path: "/auth",
        route: auth_route_1.AuthRoutes,
    },
];
moduleRoutes.forEach((route) => {
    router.use(route.path, route.route);
});
exports.default = router;
