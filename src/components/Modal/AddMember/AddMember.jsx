/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import {
  MailOutlined,
  UserAddOutlined,
  UserDeleteOutlined,
} from "@ant-design/icons";
import { Avatar, Button, Flex, Input, Modal, notification } from "antd";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { searchUser } from "../../../api/user/user.api";
import "./AddMember.scss";
import {
  getInvitationsPendingByBoard,
  inviteUser,
} from "../../../api/invitation/invitation.api";
import SearchUserItem from "./SearchUserItem/SearchUserItem";
const AddMember = ({ isOpen, setIsOpen, board }) => {
  const [inputText, setInputText] = useState();
  const [keyword, setKeyword] = useState();
  const [userSearch, setUserSearch] = useState([]);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [api, contextHolder] = notification.useNotification();
  useEffect(() => {
    const time = setTimeout(() => {
      setKeyword(inputText);
    }, 300);
    return () => {
      clearTimeout(time);
    };
  }, [inputText]);
  useEffect(() => {
    const getUserSearch = async () => {
      if (!keyword) return;
      try {
        const res = await searchUser({ key: keyword });
        if (res) {
          const filteredResults = res.filter(
            (user) => !board.members.find((member) => member.user === user._id)
          );
          setUserSearch(filteredResults);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getUserSearch();
  }, [board.members, keyword]);
  useEffect(() => {
    try {
      const getPending = async () => {
        const rs = await getInvitationsPendingByBoard({ boardId: board._id });
        if (rs) {
          setPendingUsers(rs);
        }
      };
      getPending();
    } catch (error) {
      console.log(error);
    }
  }, [board]);

  //function
  const handleInvite = async (member) => {
    const data = {
      member: member,
      boardId: board._id,
    };
    try {
      const res = await inviteUser(data);
      if (res) {
        setPendingUsers([...pendingUsers, res.data]);
        api.success({
          message: `Add new !`,
          description: res.message,
          placement: "bottomRight",
        });
      }
    } catch (error) {
      api.error({
        message: `Add new !`,
        description: error.errMessage,
        placement: "bottomRight",
      });
    }
  };

  // eslint-disable-next-line react/prop-types

  const renderAll = (members = []) => {
    return (
      members &&
      members.map((member, index) => (
        <SearchUserItem
          member={member}
          key={index}
          handleInvite={handleInvite}
          pendingUsers={pendingUsers}
        />
      ))
    );
  };
  return (
    <Modal
      title="Add member"
      centered
      open={isOpen}
      onOk={() => setIsOpen(false)}
      onCancel={() => setIsOpen(false)}
      className="modal-container"
    >
      {contextHolder}
      <Input
        size="large"
        placeholder="Email or name"
        prefix={<UserAddOutlined />}
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
      />
      <Flex vertical className="search-users" gap={8}>
        {!keyword && renderAll(board?.members)}
        {keyword && renderAll(userSearch)}
      </Flex>
    </Modal>
  );
};

export default AddMember;
