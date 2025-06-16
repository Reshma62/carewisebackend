import { Router } from "express";
import { UserRoutes } from "../modules/User/user.route";
import { StripeRoutes } from "../utils/stripe/webhook.route";
import { PatientRoutes } from "../modules/Patient/patient.route";
import { AuthRoutes } from "../modules/Auth/auth.route";

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
  {
    path: "/auth",
    route: AuthRoutes,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
