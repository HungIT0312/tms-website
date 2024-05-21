const boardModel = require("../Models/boardModel");
const cardModel = require("../Models/cardModel");
const labelModel = require("../Models/labelModel");
const listModel = require("../Models/listModel");
const userModel = require("../Models/userModel");
const helperMethods = require("./helperMethods");
const dayjs = require("dayjs");
const create = async (req, callback) => {
  try {
    const { title, backgroundImageLink, description } = req.body;

    let newBoard;
    if (description) {
      newBoard = new boardModel({ title, backgroundImageLink, description });
    } else {
      newBoard = new boardModel({ title, backgroundImageLink });
    }
    await newBoard.save();

    const user = await userModel.findById(req.user._id);
    if (!user) {
      return callback({ errMessage: "User not found" });
    }
    user.boards.unshift(newBoard._id);
    await user.save();

    let allMembers = [];
    allMembers.push({
      user: user._id,
      name: user.name,
      surname: user.surname,
      email: user.email,
      color: user.color,
      role: "owner",
    });

    newBoard.activity.unshift({
      user: user._id,
      action: "created this board",
    });

    // Tạo và thêm nhãn (labels) cho bảng
    const labelPromises = helperMethods.labelsSeedColor.map((l) =>
      labelModel.create({ ...l, board: newBoard._id })
    );
    const newLabels = await Promise.all(labelPromises);
    newBoard.labels = newLabels.map((label) => label._id);

    // Lưu bảng mới
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
    const board = await boardModel.findById(id).populate("labels");
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

    const removedMember = board.members.splice(memberIndex, 1)[0];

    const member = await userModel.findById(memberId);
    const boardIndex = member.boards.findIndex(
      (board) => board.toString() === boardId
    );
    if (boardIndex !== -1) {
      member.boards.splice(boardIndex, 1);
    }
    await member.save();

    const lists = await listModel.find({ owner: boardId });

    for (const list of lists) {
      const cards = await cardModel.find({ owner: list._id });

      for (const card of cards) {
        const cardMemberIndex = card.members.findIndex(
          (cardMember) => cardMember.user.toString() === memberId.toString()
        );

        if (cardMemberIndex !== -1) {
          card.members.splice(cardMemberIndex, 1);
          await card.save();
        }
      }
    }

    // Log the activity
    board.activity.unshift({
      user: user._id,
      action: `removed user '${
        removedMember.name + " " + removedMember.surname
      }' from this board`,
    });

    // Save changes to board
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
//============================================================================
const createLabel = async (boardId, labelData, callback) => {
  try {
    const newLabel = await labelModel.create(labelData);

    const board = await boardModel.findById(boardId);
    if (!board) return res.status(404).send("Board not found");

    board.labels.push(newLabel._id);
    await board.save();

    return callback(false, { message: "Successful", label: newLabel });
  } catch (err) {
    return callback({
      errMessage: "Something went wrong",
      details: err.message,
    });
  }
};
const updateLabel = async (labelId, labelData, callback) => {
  try {
    // Tìm và cập nhật nhãn
    const updatedLabel = await labelModel.findByIdAndUpdate(
      labelId,
      labelData,
      {
        new: true,
      }
    );
    if (!updatedLabel) {
      return callback({ errMessage: "Label not found" });
    }
    return callback(false, { message: "Successful", label: updatedLabel });
  } catch (err) {
    return callback({
      errMessage: "Something went wrong",
      details: err.message,
    });
  }
};

const deleteLabel = async (boardId, labelId, callback) => {
  try {
    // Tìm và xoá nhãn
    const deletedLabel = await labelModel.findByIdAndDelete(labelId);
    if (!deletedLabel) {
      return callback({ errMessage: "Label not found" });
    }

    // Xoá tham chiếu nhãn khỏi bảng
    const board = await boardModel.findById(boardId);
    if (!board) {
      return callback({ errMessage: "Board not found" });
    }

    board.labels.pull(labelId);
    await board.save();

    // Xoá nhãn khỏi các thẻ liên quan
    await cardModel.updateMany(
      { labels: labelId },
      { $pull: { labels: labelId } }
    );

    return callback(false, { label: deletedLabel });
  } catch (err) {
    return callback({
      errMessage: "Something went wrong",
      details: err.message,
    });
  }
};
const getBoardStats = async (boardId, callback) => {
  try {
    // Fetch the board by ID
    const lists = await listModel.find({ owner: boardId }).populate({
      path: "cards",
      populate: {
        path: "members.user",
        select: "name surname email color",
      },
    });
    let cards = [];
    // Loop through each list to find all cards
    for (const list of lists) {
      cards.push(...list.cards);
    }
    cards = cards.filter((c) => c._destroy === false);
    const board = await boardModel.findById(boardId).populate("members.user");
    if (!board) {
      return callback({ message: "Board not found" });
    }
    const userStats = {};
    // Populate the userStats object with initial data
    board.members.forEach((member) => {
      userStats[member.user._id.toString()] = {
        user: member.user,
        tasks: {
          complete: 0,
          unresolve: 0,
          totalTask: 0,
          overdue: 0, // Initialize overdue tasks count
        },
      };
    });
    let completeTask = 0;
    let unResolveTask = 0;
    let unassignedTask = 0;
    let overdueTask = 0;
    const now = dayjs();

    // Calculate task statistics for each card
    cards.forEach((card) => {
      if (card.date.completed) {
        completeTask += 1;
      } else {
        unResolveTask += 1;
        // Check if the task is overdue
        if (card.date.dueDate && dayjs(card.date.dueDate).isBefore(now)) {
          overdueTask += 1;
          // Increase overdue count for each member assigned to this card
          card.members.forEach((member) => {
            const userId = member.user._id.toString();
            if (userStats[userId]) {
              userStats[userId].tasks.overdue += 1;
            }
          });
        }
      }
      if (card.members.length < 1) {
        unassignedTask += 1;
      }
      card.members.forEach((member) => {
        const userId = member.user._id.toString();
        if (userStats[userId]) {
          userStats[userId].tasks.totalTask += 1;
          // Check if the card is completed
          if (card.date && card.date.completed) {
            userStats[userId].tasks.complete += 1;
          } else {
            userStats[userId].tasks.unresolve += 1;
          }
        }
      });
    });

    // Convert userStats object to an array
    const statsArray = Object.values(userStats);

    // Return the statistics
    return callback(false, {
      totalTask: cards.length,
      statsArray,
      unResolveTask: unResolveTask,
      completeTask: completeTask,
      unassignedTask: unassignedTask,
      overdueTask: overdueTask, // Added overdue task count
    });
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
  createLabel,
  deleteLabel,
  updateLabel,
  getBoardStats,
};
