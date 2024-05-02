/* eslint-disable react/prop-types */
import { Flex } from "antd";
import DOMPurify from "dompurify";
import { useEffect, useRef, useState } from "react";
import ReactQuill from "react-quill";

const QuillTextBox = ({ content, placeholder, getCleanHTML = () => {} }) => {
  const [value, setValue] = useState(content || "");
  const [isChangeDes, setIsChangeDes] = useState(false);
  const [initialValue, setInitialValue] = useState(content || "");
  const quillRef = useRef(null);
  const cleanHTML = DOMPurify.sanitize(value);
  useEffect(() => {
    setInitialValue(content);
  }, [content]);

  const handleBlur = () => {
    if (initialValue !== value) {
      getCleanHTML(cleanHTML);
      setInitialValue(cleanHTML);
    }
    setIsChangeDes(false);
  };
  return (
    <Flex className="" align="center" gap={12} vertical>
      {!isChangeDes && (
        <div
          dangerouslySetInnerHTML={{ __html: cleanHTML }}
          className="info__description"
          onClick={() => {
            setIsChangeDes(true);
            quillRef.current.focus();
          }}
        />
      )}
      <ReactQuill
        style={{ opacity: `${isChangeDes ? 1 : 0}` }}
        ref={quillRef}
        theme="snow"
        value={value}
        onChange={setValue}
        onBlur={handleBlur}
        placeholder={placeholder}
      />
    </Flex>
  );
};

export default QuillTextBox;
