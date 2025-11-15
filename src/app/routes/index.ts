import { Router } from "express";
import { AuthRoute } from "./auth.route";
import { ProviderRoute } from "./providers.route";
import { DocumentRoute } from "./document.route";
import { TaskRoute } from "./task.route";
import { UserRoute } from "./user.route";
import { ViewByRoomRoute } from "./view_by_room.route";

const router = Router();

const apiRoutes = [
  { path: "/auth", route: AuthRoute },
  { path: "/provider", route: ProviderRoute },
  { path: "/document", route: DocumentRoute },
  { path: "/task", route: TaskRoute },
  { path: "/user", route: UserRoute },
  { path: "/view-by-room", route: ViewByRoomRoute },
];

apiRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
