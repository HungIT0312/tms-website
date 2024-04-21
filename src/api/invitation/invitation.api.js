import http from "../../helpers/http";

export const acceptInvitation = async (id) => {
  return http.post(`/invitation/accept`, { invitationId: id });
};
export const rejectInvitation = (invitationId) => {
  return http.post("/invitation/reject", invitationId);
};
export const inviteUser = (invitationData) => {
  return http.post("/invitation/invite", invitationData);
};
export const getAllInvitations = (userId) => {
  return http.post("/invitation/all", userId);
};
export const getInvitationsPendingByBoard = (boardId) => {
  return http.post("/invitation/pending", boardId);
};
// router.post("/accept", invitationController.acceptInvitation);
// router.post("/reject", invitationController.rejectInvitation);
// router.post("/invite", invitationController.sentMemberInvitation);
