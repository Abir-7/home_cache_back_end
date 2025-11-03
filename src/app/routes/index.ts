import { Router } from "express";
import { AuthRoute } from "./auth.route";
import { ProviderRoute } from "./providers.route";
import { DocumentRoute } from "./document.route";

const router = Router();

const apiRoutes = [
  { path: "/auth", route: AuthRoute },
  { path: "/provider", route: ProviderRoute },
  { path: "/document", route: DocumentRoute },
];

apiRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
