import { Router } from "express";
import { UserRoutes } from "../modules/User/user.route";
import { StripeRoutes } from "../utils/stripe/webhook.route";
import { PatientRoutes } from "../modules/Patient/patient.route";

const router = Router();

const moduleRoutes = [
  {
    path: "/users",
    route: UserRoutes,
  },
  {
    path: "/patient",
    route: PatientRoutes,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
