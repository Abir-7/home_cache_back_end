import { Router } from "express";
import { AuthRoute } from "./auth.route";
import { ProviderRoute } from "./providers.route";
import { DocumentRoute } from "./document.route";
import { TaskRoute } from "./task.route";
import { UserRoute } from "./user.route";

const router = Router();

const apiRoutes = [
  { path: "/auth", route: AuthRoute },
  { path: "/provider", route: ProviderRoute },
  { path: "/document", route: DocumentRoute },
  { path: "/task", route: TaskRoute },
  { path: "/user", route: UserRoute },
];

apiRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
