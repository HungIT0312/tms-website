const express = require("express");
const router = express.Router();
const invitationController = require("../Controllers/invitationController");
router.post("/accept", invitationController.acceptInvitation);
router.post("/reject", invitationController.rejectInvitation);
router.post("/invite", invitationController.sentMemberInvitation);
router.post("/all", invitationController.getAllInvitations);
router.post("/pending", invitationController.getInvitationsPendingByBoard);
module.exports = router;
