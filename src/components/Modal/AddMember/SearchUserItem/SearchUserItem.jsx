/* eslint-disable react/prop-types */
import { MailOutlined, UserDeleteOutlined } from "@ant-design/icons";
import { Avatar, Button, Flex } from "antd";

const SearchUserItem = ({
  member,
  handleInvite,
  pendingUsers,
  isOwner,
  handleRemoveMember,
}) => {
  const isPending = pendingUsers.some((user) => user.invited === member._id);

  return (
    <Flex
      key={member._id}
      className="search-users__item"
      align="center"
      justify="space-between"
    >
      <Flex align="center" gap={8}>
        <Avatar style={{ background: member.color }}>
          {member.surname[0] + member.name[0]}
        </Avatar>
        <Flex vertical>
          <span className="">{member.email}</span>
          <span className="">{member.surname + " " + member.name}</span>
        </Flex>
      </Flex>
      {member.role && member.role === "owner" && (
        <Button className="owner-btn" type="default">
          Chủ sở hữu
        </Button>
      )}
      {member.role && member.role === "member" && (
        <Button
          icon={<UserDeleteOutlined />}
          disabled={!isOwner}
          className="remove-btn"
          title={`${
            !isOwner ? "Chỉ chủ sở hữu mới có thể xóa thành viên" : ""
          }`}
          onClick={() => handleRemoveMember(member.user.toString())}
        >
          Xóa
        </Button>
      )}
      {!member.role && !isPending && isOwner && (
        <Button
          type="default"
          icon={<MailOutlined />}
          onClick={() => handleInvite(member)}
        >
          Mời
        </Button>
      )}
      {!member.role && isPending && (
        <Button type="default" icon={<MailOutlined />} loading>
          Đang chờ
        </Button>
      )}
    </Flex>
  );
};

export default SearchUserItem;
