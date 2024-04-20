const express = require("express");
const router = express.Router();
const invitationController = require("../Controllers/invitationController");
router.post("/accept-invitation", invitationController.acceptInvitation);
router.post("/reject-invitation", invitationController.rejectInvitation);

module.exports = router;
