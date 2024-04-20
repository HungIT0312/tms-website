const invitationModel = require("../Models/invitationModel");

const acceptInvitation = async (invitationId, userId, callback) => {
  try {
    const invitation = await invitationModel.findById(invitationId);

    if (!invitation || invitation.invited.toString() !== userId) {
      return callback({ message: "Invitation not found or invalid." });
    }

    // Update invitation status to accepted
    invitation.status = "accepted";
    await invitation.save();
    const newMember = await userModel.findById(userId);

    newMember.boards.push(board._id);
    await newMember.save();

    const board = await boardModel.findById(invitation.board);
    board.members.push({
      user: newMember._id,
      name: newMember.name,
      surname: newMember.surname,
      email: newMember.email,
      color: newMember.color,
      role: "member",
    });
    await board.save();

    return callback(false, { message: "Invitation accepted!" });
  } catch (error) {
    return callback({
      message: "Something went wrong",
      details: error.message,
    });
  }
};
const rejectInvitation = async (invitationId, userId, callback) => {
  try {
    const invitation = await invitationModel.findById(invitationId);

    if (!invitation || invitation.invited.toString() !== userId) {
      return callback({ message: "Invitation not found or invalid." });
    }

    // Update invitation status to rejected
    invitation.status = "rejected";
    await invitation.save();

    return callback(false, { message: "Invitation rejected!" });
  } catch (error) {
    return callback({
      message: "Something went wrong",
      details: error.message,
    });
  }
};
module.exports = {
  acceptInvitation,
  rejectInvitation,
};
