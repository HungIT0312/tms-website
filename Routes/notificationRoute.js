const express = require("express");
const router = express.Router();
const notificationController = require("../Controllers/notificationController");
// const invitationController = require("../Controllers/invitationController");
// router.post("/accept", invitationController.acceptInvitation);
// router.post("/reject", invitationController.rejectInvitation);
// router.post("/invite", invitationController.sentMemberInvitation);
router.get("/", notificationController.getAllNoticeByUserId);
router.post("/", notificationController.updateNoticeByIds);
// router.post("/pending", invitationController.getInvitationsPendingByBoard);
module.exports = router;
