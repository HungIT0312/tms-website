import { EditOutlined } from "@ant-design/icons";
import { Checkbox, Flex, Tag } from "antd";
import "./Labels.scss";
const Labels = () => {
  const onChange = (checkedValues) => {
    console.log("checked = ", checkedValues);
  };
  return (
    <Checkbox.Group onChange={onChange} className="check-box__container">
      <Flex justify="space-between">
        <Checkbox value="A" className="check-box__item">
          <Tag className="check-box__item-tag" color="success">
            success
          </Tag>
        </Checkbox>

        <EditOutlined className="check-box__icon" />
      </Flex>
      <Flex justify="space-between">
        <Checkbox value="B" className="check-box__item">
          <Tag color="processing" className="check-box__item-tag">
            processing
          </Tag>
        </Checkbox>
        <EditOutlined className="check-box__icon" />
      </Flex>
      <Flex justify="space-between">
        <Checkbox value="C" className="check-box__item">
          <Tag color="error" className="check-box__item-tag">
            error
          </Tag>
        </Checkbox>
        <EditOutlined className="check-box__icon" />
      </Flex>
      <Flex justify="space-between">
        <Checkbox value="D" className="check-box__item">
          <Tag color="warning" className="check-box__item-tag">
            warning
          </Tag>
        </Checkbox>
        <EditOutlined className="check-box__icon" />
      </Flex>
      <Flex justify="space-between">
        <Checkbox value="E" className="check-box__item">
          <Tag color="purple" className="check-box__item-tag">
            purple
          </Tag>
        </Checkbox>
        <EditOutlined className="check-box__icon" />
      </Flex>
    </Checkbox.Group>
  );
};

export default Labels;
{
  /* <Tag color="success">success</Tag>
          <Tag color="processing">processing</Tag>
          <Tag color="error">error</Tag>
          <Tag color="warning">warning</Tag>
          <Tag color="orange">orange</Tag>
          <Tag color="purple">purple</Tag> */
}
