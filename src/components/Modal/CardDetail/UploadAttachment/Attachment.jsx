/* eslint-disable react/prop-types */
import { InboxOutlined } from "@ant-design/icons";
import { message } from "antd";
import Dragger from "antd/es/upload/Dragger";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  removeAttachment,
  updateCardDate,
} from "../../../../stores/card/cardSlice";
import { deleteFile, uploadFile } from "../../../../stores/card/cardThunk";
import getAudioUpload from "../../../../utils/UploadFile";
import dayjs from "dayjs";
import localeData from "dayjs/plugin/localeData";
import utc from "dayjs/plugin/utc";
import weekday from "dayjs/plugin/weekday";
dayjs.extend(weekday);
dayjs.extend(localeData);
dayjs.extend(utc);
const Attachment = () => {
  const now = dayjs();
  const [initFiles, setInitFiles] = useState([]);
  const { selectedCard } = useSelector((state) => state.card);
  const { boardId } = useParams();
  const dispatch = useDispatch();
  useEffect(() => {
    const initAttachment = selectedCard?.attachments?.map((a) => {
      return {
        uid: a._id,
        name: a.name,
        status: a.status ? "uploading" : "success",
        url: a.link,
        thumbUrl: a.link,
      };
    });
    setInitFiles(initAttachment);
  }, [selectedCard?.attachments]);

  const onDrop = (e) => {
    console.log("Dropped files", e.dataTransfer.files);
  };
  const onChange = async (info) => {
    dispatch(
      updateCardDate({
        resolvedAt: selectedCard.date.resolvedAt,
        updatedAt: now,
      })
    );
    if (info.fileList?.length < initFiles?.length) {
      const data = {
        boardId: boardId,
        listId: selectedCard?.owner,
        cardId: selectedCard?._id,
        attachmentId: info.file.uid,
      };
      dispatch(deleteFile(data));
      dispatch(removeAttachment(info?.file.uid));
      message.success(`Đã gỡ tệp ${info.file.name} .`);
    }
    if (info.fileList?.length > initFiles?.length) {
      const rs = await getAudioUpload(info?.file);
      if (rs) {
        dispatch(
          uploadFile({
            boardId: boardId,
            listId: selectedCard?.owner,
            cardId: selectedCard?._id,
            link: rs.url,
            name: rs.original_filename + "." + rs.format,
          })
        );
        message.success(`${info.file.name} tải lên thành công.`);
      }
    }
  };
  const onPreview = async (file) => {
    window.open(file.url, "_blank");
  };

  const beforeUpload = (file) => {
    const isFile =
      file.type === "image/jpeg" ||
      file.type === "image/png" ||
      file.type === "image/gif";
    if (!isFile) {
      message.error("Bạn chỉ có thể tải lên tệp ảnh!");
      return true;
    }
    const maxSizeFile = 1024 * 1024 * 7;
    const isLt2M = file.size && file.size < maxSizeFile;
    if (!isLt2M) {
      message.error("Tệp phải nhỏ hơn 7MB!");
      return true;
    }
    return false;
  };
  return (
    <Dragger
      name="file"
      listType="picture"
      multiple
      action={"https://localhost:5173"}
      accept=".png,.gif,.jpg"
      beforeUpload={beforeUpload}
      defaultFileList={initFiles}
      fileList={initFiles}
      onChange={onChange}
      onDrop={onDrop}
      onPreview={onPreview}
      withCredentials={true}
      // onRemove={onRemove}
    >
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">Bấm hoặc thả tệp vào đây để tải lên</p>
      <p className="ant-upload-hint">
        Hỗ trợ tải lên một lần hoặc hàng loạt. Nghiêm cấm tải lên dữ liệu công
        ty hoặc các tập tin bị cấm khác.
      </p>
    </Dragger>
  );
};

export default Attachment;
