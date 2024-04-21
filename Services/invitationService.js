const boardModel = require("../Models/boardModel");
const invitationModel = require("../Models/invitationModel");
const userModel = require("../Models/userModel");

const acceptInvitation = async (invitationId, userId, callback) => {
  try {
    const invitation = await invitationModel
      .findById(invitationId)
      .populate("board", "title description")
      .populate("inviter", "name surname color");

    if (!invitation || invitation.invited.toString() !== userId.toString()) {
      return callback({ message: "Invitation not found or invalid." });
    }

    // Update invitation status to accepted
    invitation.status = "accepted";
    await invitation.save();
    const newMember = await userModel.findById(userId);

    const board = await boardModel.findById(invitation.board);
    newMember.boards.push(board._id);
    await newMember.save();

    board.members.push({
      user: newMember._id,
      name: newMember.name,
      surname: newMember.surname,
      email: newMember.email,
      color: newMember.color,
      role: "member",
    });
    board.activity.push({
      user: userId,
      name: newMember.name,
      action: `added user '${newMember.name}' to this board`,
      color: newMember.color,
    });

    await board.save();

    return callback(false, {
      message: "Invitation accepted!",
      board: board,
      invitation: invitation,
    });
  } catch (error) {
    return callback({
      errMessage: "Something went wrong",
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

    // Xóa lời mời từ cơ sở dữ liệu
    await invitationModel.findByIdAndDelete(invitationId);

    // Update invitation status to rejected (không cần thiết nếu bạn đã xóa lời mời)
    // invitation.status = "rejected";
    // await invitation.save();

    return callback(false, { message: "Invitation rejected!" });
  } catch (error) {
    return callback({
      errMessage: "Something went wrong",
      details: error.message,
    });
  }
};
const sentMemberInvitation = async (boardId, member, user, callback) => {
  const board = await boardModel.findById(boardId);
  const isOwner = board.members.some(
    (member) =>
      member.user.toString() === user._id.toString() && member.role === "owner"
  );
  if (!isOwner) {
    return callback({
      errMessage:
        "You are not the owner of this board. Only owners can invite members.",
    });
  }
  try {
    const newInvitation = new invitationModel({
      inviter: user._id,
      invited: member._id, // Assuming member is an object containing user details
      board: boardId,
    });
    await newInvitation.save();
    return callback(false, {
      message: "Invitations sent!",
      data: newInvitation,
    });
  } catch (error) {
    return callback({
      message: "Something went wrong",
      details: error.message,
    });
  }
};
const getAllInvitations = async (userId, callback) => {
  try {
    const invitations = await invitationModel
      .find({ invited: userId })
      .populate("board", "title description")
      .populate("inviter", "name surname color");
    return callback(false, invitations);
  } catch (error) {
    return callback({
      errMessage: "Something went wrong",
      details: error.message,
    });
  }
};
const getInvitationsPendingByBoard = async (boardId, callback) => {
  try {
    const invitations = await invitationModel.find({
      board: boardId,
      status: "pending",
    });
    return callback(false, invitations);
  } catch (error) {
    return callback({
      errMessage: "Something went wrong",
      details: error.message,
    });
  }
};
module.exports = {
  acceptInvitation,
  rejectInvitation,
  sentMemberInvitation,
  getAllInvitations,
  getInvitationsPendingByBoard,
};
