import Checklist from "@editorjs/checklist";
import CodeTool from "@editorjs/code";
import Delimiter from "@editorjs/delimiter";
import EditorJS from "@editorjs/editorjs";
import Embed from "@editorjs/embed";
import Header from "@editorjs/header";
import Image from "@editorjs/image";
import InlineCode from "@editorjs/inline-code";
import LinkTool from "@editorjs/link";
import List from "@editorjs/list";
import Marker from "@editorjs/marker";
import Paragraph from "@editorjs/paragraph";
import Quote from "@editorjs/quote";
import Table from "@editorjs/table";
import Warning from "@editorjs/warning";
import { useEffect, useRef, useState } from "react";
const EditorJsCom = () => {
  const editorRef = useRef(null);
  const [editorData, setEditorData] = useState(null);

  const initEditor = () => {
    const editor = new EditorJS({
      holder: editorRef.current,
      tools: {
        header: Header,
        paragraph: Paragraph,
        list: List,
        checklist: Checklist,
        image: Image,
        embed: Embed,
        linkTool: LinkTool,
        quote: Quote,
        table: Table,
        marker: Marker,
        delimiter: Delimiter,
        warning: Warning,
        code: CodeTool,
        inlineCode: InlineCode,
      },
      onChange: (apiData) => {
        setEditorData(apiData);
      },
    });

    return editor;
  };

  const saveData = () => {
    console.log("Data to be saved:", editorData);
  };

  useEffect(() => {
    const editorInstance = initEditor();
    return () => {
      editorInstance.destroy();
    };
  }, []);

  return (
    <div>
      <div ref={editorRef}></div>
      <button onClick={saveData}>Lưu Dữ liệu</button>
    </div>
  );
};

export default EditorJsCom;
