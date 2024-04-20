const invitationService = require("../Services/invitationService");

const acceptInvitation = async (req, res) => {
  const { invitationId } = req.body;
  const userId = req.user._id;

  try {
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
  } catch (error) {
    res.status(500).send({ error: "Internal server error" });
  }
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
    res.status(500).send({ error: "Internal server error" });
  }
};

module.exports = {
  acceptInvitation,
  rejectInvitation,
};
