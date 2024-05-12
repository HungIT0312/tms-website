import { CheckOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Checkbox, Col, Flex, Form, Input, Row, Tag } from "antd";
import "./Labels.scss";
import { useState } from "react";
const Labels = () => {
  const [isAdd, setIsAdd] = useState(false);
  const [colorSelected, setColorSelected] = useState("magenta");
  const [text, setText] = useState("");
  const onChange = (checkedValues) => {
    console.log("checked = ", checkedValues);
  };
  const labelTypes = [
    "magenta",
    "volcano",
    "gold",
    "lime",
    "green",
    "cyan",
    "blue",
    "geekblue",
  ];
  return !isAdd ? (
    <Flex vertical>
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
      <Button
        type="text"
        icon={<PlusOutlined />}
        onClick={() => setIsAdd(!isAdd)}
      >
        Create new
      </Button>
    </Flex>
  ) : (
    <Flex vertical>
      <Tag
        style={{
          height: 30,
          width: "calc(100% - 32px)",
          margin: 16,
          display: "flex",
          alignItems: "center",
        }}
        color={colorSelected}
      >
        {text}
      </Tag>
      <Form layout="vertical">
        <Form.Item name="title" label="Title">
          <Input onChange={(e) => setText(e.target.value)}></Input>
        </Form.Item>
        <Form.Item name="type" label="Color/type">
          <Row gutter={8}>
            {labelTypes &&
              labelTypes.map((t, index) => (
                <Col span={8} key={index}>
                  <Tag
                    style={{
                      height: 30,
                      width: "100%",
                      cursor: "pointer",
                      position: "relative",
                    }}
                    color={t}
                    onClick={() => setColorSelected(t)}
                  >
                    {colorSelected === t && (
                      <div className="bg-image--checked">
                        <CheckOutlined color="#fff" />
                      </div>
                    )}
                  </Tag>
                </Col>
              ))}
          </Row>
        </Form.Item>
        <Flex gap={8} style={{ float: "right" }}>
          <Button
            onClick={() => {
              setIsAdd(false);
              setText("");
              setColorSelected("magenta");
            }}
          >
            Back
          </Button>
          <Button type="primary">OK</Button>
        </Flex>
      </Form>
    </Flex>
  );
};

export default Labels;
