/* eslint-disable react/prop-types */
import { Flex, Modal, Switch } from "antd";
import { useState } from "react";

const DeleteCard = ({ handleDeleteThisTask, isOpen, close, subTasks }) => {
  const [value, setValue] = useState(false);

  return (
    <Modal
      open={isOpen}
      title="Bạn có muốn xóa thẻ này không?"
      onOk={() => {
        handleDeleteThisTask(value);
      }}
      onCancel={close}
      okText="Xóa"
      okType="danger"
      centered={true}
      cancelText="Hủy"
    >
      <Flex>
        Xóa thẻ này đồng nghĩa với việc tất cả công việc trên thẻ này sẽ biến
        mất.
      </Flex>
      {subTasks?.length > 0 && (
        <Flex gap={8} align="center">
          <span>Bao gồm cả {subTasks?.length} thẻ phụ:</span>
          <Switch
            checkedChildren="Có"
            unCheckedChildren="Không"
            onChange={(checked) => setValue(checked)}
          />
        </Flex>
      )}
    </Modal>
  );
};

export default DeleteCard;
