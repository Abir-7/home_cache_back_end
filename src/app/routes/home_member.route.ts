import { Router } from "express";
import { auth } from "../middleware/auth/auth";
import { HomememberController } from "../controller/home_member.controller";

const router = Router();

router.get("/search-member", auth(["user"]), HomememberController.searchMember);
router.post("/send-invite", auth(["user"]), HomememberController.sendInvite);
router.get("/invite-list", auth(["user"]), HomememberController.getInviteList);
router.get(
  "/my-home-member",
  auth(["user"]),
  HomememberController.getMyHomeMember
);
router.patch(
  "/accept-invite",
  auth(["user"]),
  HomememberController.acceptRequest
);

router.patch(
  "/reject-invite",
  auth(["user"]),
  HomememberController.rejectRequest
);

router.patch(
  "/remove-me-from-home-member",
  auth(["user"]),
  HomememberController.leave
);

export const HomeMemberRoute = router;
