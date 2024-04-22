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
          {member.name[0] + member.surname[0]}
        </Avatar>
        <Flex vertical>
          <span className="">{member.email}</span>
          <span className="">{member.name + " " + member.surname}</span>
        </Flex>
      </Flex>
      {member.role && member.role === "owner" && (
        <Button className="owner-btn" type="default">
          Owner
        </Button>
      )}
      {member.role && member.role === "member" && (
        <Button
          icon={<UserDeleteOutlined />}
          disabled={!isOwner}
          className="remove-btn"
          title={`${!isOwner ? "Only  the owner can remove members" : ""}`}
          onClick={() => handleRemoveMember(member.user.toString())}
        >
          Remove
        </Button>
      )}
      {!member.role && !isPending && (
        <Button
          type="default"
          icon={<MailOutlined />}
          onClick={() => handleInvite(member)}
        >
          Invite
        </Button>
      )}
      {!member.role && isPending && (
        <Button type="default" icon={<MailOutlined />} loading>
          Pending
        </Button>
      )}
    </Flex>
  );
};

export default SearchUserItem;
