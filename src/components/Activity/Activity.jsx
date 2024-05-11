/* eslint-disable react/prop-types */
import { Avatar, Flex } from "antd";
import formatDateTime from "../../helpers/formatDatetime";

const Activity = ({ activity }) => {
  return (
    <Flex gap={12} justify="start" align="start">
      <div>
        <Avatar
          size={36}
          style={{ background: activity?.user?.color, fontSize: 12 }}
        >
          {activity?.user?.name[0] + activity?.user?.surname[0]}
        </Avatar>
      </div>
      <Flex vertical justify="space-between" gap={4}>
        <span>
          <strong>
            {activity?.user?.name + " " + activity?.user?.surname}
          </strong>{" "}
          {activity?.action}
        </span>
        <small>{formatDateTime(activity?.date)}</small>
      </Flex>
    </Flex>
  );
};

export default Activity;
// {
//         user: {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: "user",
//         },
//         name: {
//           type: String,
//         },
//         action: {
//           type: String,
//         },
//         date: {
//           type: Date,
//           default: Date.now,
//         },
//         edited: {
//           type: Boolean,
//           default: false,
//         },
//         cardTitle: {
//           type: String,
//           default: "",
//         },
//         actionType: {
//           type: String,
//           default: "action",
//         },
//         color: {
//           type: String,
//         },
//       },
