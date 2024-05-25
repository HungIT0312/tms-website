const invitationService = require("../Services/invitationService");

const acceptInvitation = async (req, res) => {
  const { invitationId } = req.body;
  const userId = req.user._id;
  await invitationService.acceptInvitation(
    invitationId,
    userId,
    (error, result) => {
      if (error) {
        return res.status(400).send(error);
      }
      res.status(200).send(result);
    }
  );
};
const rejectInvitation = async (req, res) => {
  const { invitationId } = req.body;
  const userId = req.user._id;

  try {
    await invitationService.rejectInvitation(
      invitationId,
      userId,
      (error, result) => {
        if (error) {
          return res.status(400).send(error);
        }
        res.status(200).send(result);
      }
    );
  } catch (error) {
    res.status(500).send({ error: "Lỗi máy chủ nội bộ" });
  }
};
const sentMemberInvitation = async (req, res) => {
  const { member, boardId } = req.body;
  // Call the service
  await invitationService.sentMemberInvitation(
    boardId,
    member,
    req.user,
    (err, result) => {
      if (err) return res.status(400).send(err);
      return res.status(200).send(result);
    }
  );
};
const getAllInvitations = async (req, res) => {
  const userId = req.body.userId;
  await invitationService.getAllInvitations(userId, (err, result) => {
    if (err) return res.status(400).send(err);
    return res.status(200).send(result);
  });
};
const getInvitationsPendingByBoard = async (req, res) => {
  const id = req.body.boardId;
  await invitationService.getInvitationsPendingByBoard(id, (err, result) => {
    if (err) return res.status(400).send(err);
    return res.status(200).send(result);
  });
};
module.exports = {
  acceptInvitation,
  rejectInvitation,
  sentMemberInvitation,
  getAllInvitations,
  getInvitationsPendingByBoard,
};
