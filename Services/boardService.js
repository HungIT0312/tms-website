const boardModel = require("../Models/boardModel");
const cardModel = require("../Models/cardModel");
const labelModel = require("../Models/labelModel");
const listModel = require("../Models/listModel");
const notificationModal = require("../Models/notificationModal");
const userModel = require("../Models/userModel");
const helperMethods = require("./helperMethods");
const dotenv = require("dotenv");
const dayjs = require("dayjs");
const nodemailer = require("nodemailer");
const mailDelete = require("../utils/mailDelete");
const invitationModel = require("../Models/invitationModel");
const { emitToUser } = require("../utils/socket");
dotenv.config();
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.SERVER_EMAIL,
    pass: process.env.SERVER_EMAIL_PASS,
  },
});
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
      return callback({ errMessage: "Không tìm thấy người dùng" });
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
      action: "đã tạo bảng",
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
      errMessage: "Có lỗi đã xảy ra!",
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
    const boards = await boardModel.find({ _id: { $in: boardIds } }).populate({
      path: "members.user",
      select: "name surname email color",
    });

    // Delete unneccesary objects
    boards.forEach((board) => {
      delete board.activity;
      delete board.lists;
    });

    return callback(false, boards);
  } catch (error) {
    return callback({ msg: "Có lỗi đã xảy ra!", details: error.message });
  }
};

const getById = async (id, callback) => {
  try {
    // Get board by id
    const board = await boardModel.findById(id).populate("labels").populate({
      path: "members.user",
      select: "name surname email color",
    });
    return callback(false, board);
  } catch (error) {
    return callback({
      message: "Có lỗi đã xảy ra!",
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
      return callback({ message: "Không tìm thấy bảng" });
    }

    return callback(false, {
      activities,
      length: board.activity.length,
      page,
      limit,
    });
  } catch (error) {
    return callback({
      message: "Có lỗi đã xảy ra!",
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
      return callback({ message: "Không có thành viên trong bảng." });
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
    const newNotice = await notificationModal.create({
      user: memberId,
      message: `<p>${
        user.surname + " " + user.name
      } đã xóa bạn ra khỏi bảng <b>${board.title}</b></p>`,
      link: `/`,
    });

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
      action: `xóa người dùng "${
        removedMember.name + " " + removedMember.surname
      }" khỏi bảng`,
    });

    // Save changes to board
    await board.save();

    return callback(false, {
      message: "Xóa thành công!",
      removedMemberId: removedMember.user,
    });
  } catch (error) {
    return callback({
      message: "Có lỗi đã xảy ra!",
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
          action: "đã cập nhật tiêu đề của bảng",
        });
        break;
      case "description":
        board.description = newValue;
        board.activity.unshift({
          user: user._id,
          action: "đã cập nhật mô tả của bảng",
        });
        break;
      case "background":
        board.backgroundImageLink = newValue;
        board.activity.unshift({
          user: user._id,
          action: "đã cập nhật ảnh nền của bảng",
        });
        break;
      default:
        return callback({ message: "Thuộc tính không hợp lệ" });
    }

    // Save changes
    await board.save();

    return callback(false, { message: "Thành công!", property, newValue });
  } catch (error) {
    return callback({
      message: "Có lỗi đã xảy ra!",
      details: error.message,
    });
  }
};
//============================================================================
const createLabel = async (boardId, labelData, callback) => {
  try {
    const newLabel = await labelModel.create(labelData);

    const board = await boardModel.findById(boardId);
    if (!board) return res.status(404).send("Không tìm thấy bảng");

    board.labels.push(newLabel._id);
    await board.save();

    return callback(false, { message: "Thành công !", label: newLabel });
  } catch (err) {
    return callback({
      errMessage: "Có lỗi đã xảy ra!",
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
      return callback({ errMessage: "Không tìm thấy nhãn" });
    }
    return callback(false, { message: "Thành công !", label: updatedLabel });
  } catch (err) {
    return callback({
      errMessage: "Có lỗi đã xảy ra!",
      details: err.message,
    });
  }
};

const deleteLabel = async (boardId, labelId, callback) => {
  try {
    // Tìm và xoá nhãn
    const deletedLabel = await labelModel.findByIdAndDelete(labelId);
    if (!deletedLabel) {
      return callback({ errMessage: "Không tìm thấy nhãn" });
    }

    // Xoá tham chiếu nhãn khỏi bảng
    const board = await boardModel.findById(boardId);
    if (!board) {
      return callback({ errMessage: "Không tìm thấy bảng" });
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
      errMessage: "Có lỗi đã xảy ra!",
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
      return callback({ message: "Không tìm thấy bảng" });
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
        if (
          card.date.dueDate &&
          dayjs(card.date.dueDate).isBefore(now, "day")
        ) {
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
      message: "Có lỗi đã xảy ra!",
      details: error.message,
    });
  }
};
const updateLockBoard = async (boardId, isLocked, user, callback) => {
  try {
    const board = await boardModel.findById(boardId);
    if (!board) {
      return callback({ message: "Không tìm thấy bảng" });
    }

    // Lock or unlock the board
    board._destroy = isLocked;
    await board.save();

    // Update lists and cards based on the board's lock status
    await listModel.updateMany({ owner: boardId }, { _destroy: isLocked });
    const lists = await listModel.find({ owner: boardId });
    const listIds = lists.map((list) => list._id);
    await cardModel.updateMany(
      { owner: { $in: listIds } },
      { _destroy: isLocked }
    );

    const action = isLocked ? "đã khóa bảng" : "đã mở khóa bảng";
    board.activity.unshift({
      user: user._id,
      action: action,
    });
    await board.save();

    for (const member of board.members) {
      if (member.user.toString() !== user._id.toString()) {
        await notificationModal.create({
          user: member.user,
          message: `<p>${user.surname + " " + user.name} ${action} <b>${
            board.title
          }</b></p>`,
          link: `/board/${boardId}`,
        });
      }
    }

    return callback(false, {
      message: isLocked ? "Khóa bảng thành công!" : "Mở khóa bảng thành công!",
    });
  } catch (error) {
    return callback({
      message: "Có lỗi đã xảy ra!",
      details: error.message,
    });
  }
};

const deleteBoard = async (boardId, user, callback) => {
  try {
    const board = await boardModel.findById(boardId);

    const mailOptions = {
      from: process.env.SERVER_EMAIL,
      to: user.email,
      subject: "Thông báo về dự án",
      text: `Dự án bạn đang tham gia đã đóng`,
      html: mailDelete(
        `Dự án <b>${board.title}</b> mà bạn đang tham gia đã được đóng lại bởi ${user.surname} ${user.name}, mọi thông tin liên hệ với chủ sở hữu để biết thêm thông tin.`
      ),
    };
    if (!board) {
      return callback({ message: "Không tìm thấy bảng" });
    }

    await userModel.updateMany(
      { boards: boardId },
      { $pull: { boards: boardId } }
    );

    const lists = await listModel.find({ owner: boardId });
    const listIds = lists.map((list) => list._id);

    await cardModel.deleteMany({ owner: { $in: listIds } });

    await listModel.deleteMany({ owner: boardId });
    await invitationModel.deleteMany({ board: boardId });
    await boardModel.findByIdAndDelete(boardId).then(() => {
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          return callback({
            errMessage: "Không gửi được email thông báo",
            details: error,
          });
        } else {
          return callback(false, {
            message: "Người dùng đã nhận được thông báo.",
          });
        }
      });
    });

    return callback(false, { message: "Xóa bảng thành công!" });
  } catch (error) {
    return callback({
      message: "Có lỗi đã xảy ra!",
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
  updateLockBoard,
  deleteBoard,
};
