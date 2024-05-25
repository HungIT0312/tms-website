import { Empty, Flex } from "antd";
import { useSelector } from "react-redux";
import "./Archive.scss";
import ArchiveItem from "./ArchiveItem/ArchiveItem";
const Archive = () => {
  const { storageLists } = useSelector((state) => state.list);

  const renderArchiveLists = storageLists?.map((l) => (
    <ArchiveItem key={l._id} list={l} />
  ));
  return (
    <Flex vertical className="archive" gap={16}>
      <h3>Danh sách lưu trữ</h3>
      {storageLists.length > 0 && renderArchiveLists}
      {storageLists.length < 1 && (
        <Empty description={"Không có dữ liệu"}></Empty>
      )}
    </Flex>
  );
};

export default Archive;
