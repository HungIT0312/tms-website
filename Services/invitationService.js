const boardModel = require("../Models/boardModel");
const invitationModel = require("../Models/invitationModel");
const userModel = require("../Models/userModel");
const { emitToUser } = require("../utils/socket");

const acceptInvitation = async (invitationId, userId, callback) => {
  try {
    const invitation = await invitationModel
      .findById(invitationId)
      .populate("board", "title description")
      .populate("inviter", "name surname color");

    if (!invitation || invitation.invited.toString() !== userId.toString()) {
      return callback({ message: "Lời mời không tìm thấy hoặc không hợp lệ." });
    }

    // Update invitation status to accepted
    invitation.status = "accepted";
    await invitation.save();

    const newMember = await userModel.findById(userId);
    if (!newMember) {
      return callback({ message: "Không tìm thấy người dùng." });
    }

    const board = await boardModel.findById(invitation.board);
    if (!board) {
      return callback({ message: "Không tìm thấy người bảng." });
    }

    // Add new member to board members
    board.members.push({
      user: newMember._id,
      name: newMember.name,
      surname: newMember.surname,
      email: newMember.email,
      color: newMember.color,
      role: "member",
    });

    // Add activity for adding new member
    const owner = board.members.find((mem) => mem.role === "owner");
    if (owner) {
      board.activity.push({
        user: owner.user,
        action: `đã thêm thành viên "${newMember.name}" vào bảng`,
      });
    }

    await newMember.boards.push(board._id); // Add boardId to user's boards
    await newMember.save();
    await board.save();

    return callback(false, {
      message: "Chấp nhận lời mời!",
      board: board,
      invitation: invitation,
    });
  } catch (error) {
    return callback({
      errMessage: "Đã có lỗi xảy ra",
      details: error.message,
    });
  }
};

const rejectInvitation = async (invitationId, userId, callback) => {
  try {
    const invitation = await invitationModel.findById(invitationId);

    if (!invitation || invitation.invited.toString() !== userId.toString()) {
      return callback({ message: "Lời mời không tìm thấy hoặc không hợp lệ." });
    }

    // Xóa lời mời từ cơ sở dữ liệu
    await invitationModel.findByIdAndDelete(invitationId);

    // Update invitation status to rejected (không cần thiết nếu bạn đã xóa lời mời)
    // invitation.status = "rejected";
    // await invitation.save();

    return callback(false, {
      message: "Lời mời bị từ chối!",
      invitationId: invitationId,
    });
  } catch (error) {
    return callback({
      errMessage: "Đã có lỗi xảy ra",
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
        "Bạn không phải là chủ sở hữu của bảng này. Chỉ chủ sở hữu mới có thể mời thành viên.",
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
      message: "Đã gửi lời mời!",
      data: newInvitation,
    });
  } catch (error) {
    return callback({
      message: "Đã có lỗi xảy ra",
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
      errMessage: "Đã có lỗi xảy ra",
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
      errMessage: "Đã có lỗi xảy ra",
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
