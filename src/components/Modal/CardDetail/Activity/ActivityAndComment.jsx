import { Button, Flex, Spin, Tabs } from "antd";
import { useSelector } from "react-redux";
import Activity from "../../../Activity/Activity";
import { useEffect, useRef, useState } from "react";
import { getActivities } from "../../../../api/card/card.api";
import { cloneDeep } from "lodash";
import ReactQuill from "react-quill";

const ActivityAndComment = () => {
  const { selectedCard } = useSelector((state) => state.card);
  const [activities, setActivities] = useState([]);
  const [isAdd, setIsAdd] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [defaultkey, setDefault] = useState("comment");
  const quillRef = useRef(null);
  useEffect(() => {
    try {
      setIsLoading(true);
      const fetch = async () => {
        const data = {
          cardId: selectedCard?._id,
          type: defaultkey,
        };
        const rs = await getActivities(data);
        if (rs) {
          const newData = cloneDeep(rs.activities);
          setActivities(newData);
          setIsLoading(false);
        }
      };
      fetch();
    } catch (error) {
      console.log(error);
    }
  }, [defaultkey, selectedCard?._id]);
  const onHandleRetrieve = (value) => {
    setDefault(value);
  };
  const renderActivities = activities?.map((activity) => (
    <Activity key={activity._id} activity={activity} />
  ));
  const renderEmpty = <Flex>Chưa có bình luận.</Flex>;
  const handleBlur = () => {
    console.log(quillRef.current.editor.root.innerHTML);
  };
  const items = [
    {
      key: "comment",
      label: "Bình luận",
      children: (
        <Flex vertical>
          {isLoading && <Spin />}
          {!isLoading && activities.length > 0 && renderActivities}
          {!isLoading && activities.length < 1 && renderEmpty}
          {!isAdd && (
            <Flex style={{ margin: "16px 0" }}>
              <Button onClick={() => setIsAdd(true)}>Thêm bình luận</Button>
            </Flex>
          )}
          {isAdd && (
            <div>
              <ReactQuill
                style={{
                  width: "100%",
                  margin: "16px 0",
                }}
                ref={quillRef}
                theme="snow"
                // value={value}
                // onChange={(text) => setValue(text)}
                // onBlur={handleBlur}
                // placeholder={placeholder}
              />
              <Flex gap={8}>
                <Button type="primary" onClick={handleBlur}>
                  Lưu
                </Button>
                <Button type="" onClick={() => setIsAdd(false)}>
                  Hủy
                </Button>
              </Flex>
            </div>
          )}
        </Flex>
      ),
    },
    {
      key: "activities",
      label: "Hoạt động",
      children: (
        <Flex vertical>
          {!isLoading && activities.length > 0 && renderActivities}
          {!isLoading && activities.length < 1 && renderEmpty}
          {isLoading && <Spin />}
        </Flex>
      ),
    },
  ];
  return (
    <Tabs
      defaultActiveKey={"comment"}
      items={items}
      onChange={onHandleRetrieve}
    />
  );
};

export default ActivityAndComment;
