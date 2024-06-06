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
  const fullToolbarOptions = [
    [{ font: [] }],
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ color: [] }, { background: [] }],
    [{ script: "sub" }, { script: "super" }],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    [{ direction: "rtl" }],
    [{ align: [] }],
    ["link"],
    ["blockquote", "code-block"],
    ["clean"],
  ];

  const modules = {
    toolbar: fullToolbarOptions,
  };
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
  const handleCancel = () => {
    // Reset the editor content to the initial value
    quillRef.current.editor.root.innerHTML = initialValue;
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
        placeholder={placeholder}
        modules={modules}
      />
      {isChangeDes && (
        <Flex gap={8}>
          <Button type="primary" onClick={handleBlur}>
            Lưu
          </Button>
          <Button type="default" onClick={handleCancel}>
            Hủy
          </Button>
        </Flex>
      )}
    </Flex>
  );
};

export default QuillTextBox;
