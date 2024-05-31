import { Button, Flex, Spin, Tabs, message } from "antd";
import { cloneDeep } from "lodash";
import { useEffect, useRef, useState } from "react";
import ReactQuill from "react-quill";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getActivities } from "../../../../api/card/card.api";
import { addCommentToCard } from "../../../../stores/card/cardThunk";
import Activity from "../../../Activity/Activity";
import Comment from "../../../Comment/Comment";

const ActivityAndComment = () => {
  const { selectedCard } = useSelector((state) => state.card);
  const [activities, setActivities] = useState([]);
  const [isAdd, setIsAdd] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [defaultkey, setDefault] = useState("comment");
  const quillRef = useRef(null);
  const dispatch = useDispatch();
  const { boardId } = useParams();
  const [editComment, setEditComment] = useState(null);
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
  const handleEditComment = async (comment) => {
    await setIsAdd(true);
    await setEditComment(comment);
    quillRef.current.editor.root.innerHTML = comment?.action; // Set the Quill editor content
  };
  const renderActivities = activities?.map((activity) => (
    <Activity key={activity._id} activity={activity} />
  ));
  const renderComments = activities?.map((activity) => (
    <Comment
      isEdit={editComment?._id === activity?._id}
      key={activity._id}
      activity={activity}
      onEdit={handleEditComment}
    />
  ));
  const renderEmpty = <Flex>Chưa có bình luận.</Flex>;
  const handleBlur = () => {
    const data = {
      boardId: boardId,
      listId: selectedCard?.owner,
      cardId: selectedCard?._id,
      text: quillRef.current.editor.root.innerHTML,
    };
    if (editComment) {
      // Update existing comment
      console.log(editComment);
      console.log("edit");
    } else {
      // Add new comment
      dispatch(addCommentToCard(data))
        .unwrap()
        .then((rs) => setActivities([rs, ...activities]));
    }
    message.success("Hoàn tất");
    setIsAdd(false);
  };
  const items = [
    {
      key: "comment",
      label: "Bình luận",
      children: (
        <Flex vertical>
          <Flex
            vertical
            style={{
              maxHeight: 300,
              overflowY: "auto",
            }}
          >
            {isLoading && <Spin />}
            {!isLoading && activities.length > 0 && renderComments}
            {!isLoading && activities.length < 1 && renderEmpty}
          </Flex>

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
                <Button
                  type=""
                  onClick={() => {
                    setIsAdd(false);
                    setEditComment(null);
                  }}
                >
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
        <Flex
          vertical
          gap={8}
          style={{
            maxHeight: 300,
            overflowY: "auto",
          }}
        >
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
