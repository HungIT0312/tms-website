import { Flex } from "antd";
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
      <h3>Archive Lists</h3>
      {renderArchiveLists}
    </Flex>
  );
};

export default Archive;
