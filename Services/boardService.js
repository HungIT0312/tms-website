const { findOne } = require("../Models/boardModel");
const boardModel = require("../Models/boardModel");
const invitationModel = require("../Models/invitationModel");
const userModel = require("../Models/userModel");

const create = async (req, callback) => {
  try {
    const { title, backgroundImageLink, description } = req.body;
    // Create and save new board
    let newBoard;
    if (description) {
      newBoard = boardModel({ title, backgroundImageLink, description });
    } else {
      newBoard = boardModel({ title, backgroundImageLink });
    }
    newBoard.save();

    // Add this board to owner's boards
    const user = await userModel.findById(req.user._id);
    user.boards.unshift(newBoard.id);
    await user.save();

    // Add user to members of this board
    let allMembers = [];
    allMembers.push({
      user: user.id,
      name: user.name,
      surname: user.surname,
      email: user.email,
      color: user.color,
      role: "owner",
    });

    // Add created activity to activities of this board
    newBoard.activity.unshift({
      user: user._id,
      action: "created this board",
    });

    // Save new board
    newBoard.members = allMembers;
    await newBoard.save();

    return callback(false, newBoard);
  } catch (error) {
    return callback({
      errMessage: "Something went wrong",
      details: error.message,
    });
  }
};

const getAll = async (userId, callback) => {
  try {
    // Get user
    const user = await userModel.findById(userId);

    // Get board's ids of user
    const boardIds = user.boards;

    // Get boards of user
    const boards = await boardModel.find({ _id: { $in: boardIds } });

    // Delete unneccesary objects
    boards.forEach((board) => {
      delete board.activity;
      delete board.lists;
    });

    return callback(false, boards);
  } catch (error) {
    return callback({ msg: "Something went wrong", details: error.message });
  }
};

const getById = async (id, callback) => {
  try {
    // Get board by id
    const board = await boardModel.findById(id);
    return callback(false, board);
  } catch (error) {
    return callback({
      message: "Something went wrong",
      details: error.message,
    });
  }
};

const getActivityById = async (boardId, page = 1, limit = 10, callback) => {
  try {
    const skip = (page - 1) * limit;

    const board = await boardModel.findById(boardId).populate({
      path: "activity.user",
      select: "name surname email color",
    });
    const activities = board.activity.slice(skip, skip + limit);
    if (!board) {
      return callback({ message: "Board not found" });
    }

    return callback(false, {
      activities,
      length: board.activity.length,
      page,
      limit,
    });
  } catch (error) {
    return callback({
      message: "Something went wrong",
      details: error.message,
    });
  }
};

const removeMember = async (boardId, memberId, user, callback) => {
  try {
    const board = await boardModel.findById(boardId);

    // Find index of member to remove
    const memberIndex = board.members.findIndex(
      (member) => member.user.toString() === memberId.toString()
    );
    if (memberIndex === -1) {
      return callback({ message: "Member not found in board" });
    }

    // Remove member from board's members array
    const removedMember = board.members.splice(memberIndex, 1)[0];

    // Remove board from member's boards array
    const member = await userModel.findById(memberId);
    const boardIndex = member.boards.findIndex(
      (board) => board.toString() === boardId
    );
    if (boardIndex !== -1) {
      member.boards.splice(boardIndex, 1);
    }
    await member.save();

    // Log the activity
    board.activity.unshift({
      user: user._id,
      action: `removed user '${
        removedMember.name + " " + removedMember.surname
      }' from this board`,
    });

    // Save changes
    await board.save();

    return callback(false, {
      message: "Remove member successfully!",
      removedMemberId: removedMember.user,
    });
  } catch (error) {
    return callback({
      message: "Something went wrong",
      details: error.message,
    });
  }
};
const updateBoardProperty = async (
  boardId,
  newValue,
  property,
  user,
  callback
) => {
  try {
    // Get board by id
    const board = await boardModel.findById(boardId);

    // Update board property based on the given property parameter
    switch (property) {
      case "title":
        board.title = newValue;
        board.activity.unshift({
          user: user._id,
          action: "update title of this board",
        });
        break;
      case "description":
        board.description = newValue;
        board.activity.unshift({
          user: user._id,
          action: "update description of this board",
        });
        break;
      case "background":
        board.backgroundImageLink = newValue.link;
        board.isImage = newValue.isImage;
        board.activity.unshift({
          user: user._id,
          action: "update background of this board",
        });
        break;
      default:
        return callback({ message: "Invalid property" });
    }

    // Save changes
    await board.save();

    return callback(false, { message: "Success!", property, newValue });
  } catch (error) {
    return callback({
      message: "Something went wrong",
      details: error.message,
    });
  }
};

module.exports = {
  create,
  getAll,
  getById,
  getActivityById,
  removeMember,
  updateBoardProperty,
};
