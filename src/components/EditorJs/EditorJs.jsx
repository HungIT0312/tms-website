/* eslint-disable react/prop-types */
import { Button } from "antd";
import { useEffect, useRef, useState } from "react";
import { createReactEditorJS } from "react-editor-js";
import { EDITOR_JS_TOOLS } from "./Tools";
const EditorJsCom = ({ data, onSave, isOpen = false }) => {
  const ReactEditorJS = createReactEditorJS();
  const editorRef = useRef(null);
  const [editorData, setEditorData] = useState(data || "");
  const [value, setValue] = useState(data || "");
  useEffect(() => {
    setEditorData(data);
    return () => {};
  }, [data]);

  const saveData = () => {
    console.log("Data to be saved:", editorData);
  };

  return (
    <div style={{ height: "fit-content" }}>
      <ReactEditorJS
        defaultValue={value}
        value={editorData}
        tools={EDITOR_JS_TOOLS}
      />
      <Button onClick={saveData}>Save</Button>
    </div>
  );
};

export default EditorJsCom;
