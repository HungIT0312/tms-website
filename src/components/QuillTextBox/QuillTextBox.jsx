/* eslint-disable react/prop-types */
import { Button, Flex } from "antd";
import { useEffect, useRef, useState } from "react";
import ReactQuill from "react-quill";

const QuillTextBox = ({ content, placeholder, getCleanHTML = () => {} }) => {
  // const [value, setValue] = useState(content || "");
  const [isChangeDes, setIsChangeDes] = useState(false);
  const [initialValue, setInitialValue] = useState(content || "");
  const quillRef = useRef(null);
  const showRef = useRef(null);

  useEffect(() => {
    showRef.current.innerHTML = content;
    quillRef.current.editor.root.innerHTML = content;
    setInitialValue(content);
  }, [content]);

  const handleBlur = () => {
    const cleanHTML = quillRef.current.editor.root.innerHTML;
    if (initialValue !== cleanHTML) {
      showRef.current.innerHTML = cleanHTML;
      getCleanHTML(cleanHTML);
      setInitialValue(cleanHTML);
    }
    setIsChangeDes(false);
  };

  return (
    <Flex className="" align="end" gap={12} vertical>
      <div
        ref={showRef}
        className="info__description"
        onClick={() => setIsChangeDes(true)}
        style={{
          opacity: !isChangeDes ? 1 : 0,
          // width: "100%",
          display: isChangeDes ? "none" : "inline-block",
        }}
      />

      <ReactQuill
        style={{
          opacity: isChangeDes ? 1 : 0,
          width: "100%",
          height: isChangeDes ? "100%" : 0,
        }}
        ref={quillRef}
        theme="snow"
        // value={value}
        // onChange={(text) => setValue(text)}
        onBlur={handleBlur}
        placeholder={placeholder}
      />
      {isChangeDes && (
        <Button type="primary" onClick={handleBlur}>
          Save
        </Button>
      )}
    </Flex>
  );
};

export default QuillTextBox;
