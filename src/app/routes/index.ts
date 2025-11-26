import { Router } from "express";
import { AuthRoute } from "./auth.route";
import { ProviderRoute } from "./providers.route";
import { DocumentRoute } from "./document.route";
import { TaskRoute } from "./task.route";
import { UserRoute } from "./user.route";

import { AiRoute } from "./ai.route";
import { ViewByTypeRoute } from "./view_by_type.route";
import { HomeMemberRoute } from "./home_member.route";
import { ViewByRoomRoute } from "./view_by_room.route";

const router = Router();

const apiRoutes = [
  { path: "/auth", route: AuthRoute },
  { path: "/provider", route: ProviderRoute },
  { path: "/document", route: DocumentRoute },
  { path: "/task", route: TaskRoute },
  { path: "/user", route: UserRoute },
  { path: "/view-by-room", route: ViewByRoomRoute },
  { path: "/view-by-type", route: ViewByTypeRoute },
  { path: "/ai", route: AiRoute },
  { path: "/home-share", route: HomeMemberRoute },
];

apiRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
