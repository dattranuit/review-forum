import * as React from "react";
import { useEffect, useRef, useState } from "react";

//import "./styles.css";

// Require Editor JS files.
import "froala-editor/js/froala_editor.pkgd.min.js";
import "froala-editor/js/plugins.pkgd.min.js";
import "froala-editor/js/third_party/embedly.min.js";
// import "froala-editor/js/plugins/fullscreen.min.js"

// Require Editor CSS files.
import "froala-editor/css/froala_style.min.css";
import "froala-editor/css/froala_editor.pkgd.min.css";
import "froala-editor/css/third_party/embedly.min.css";
// import "froala-editor/css/plugins/fullscreen.min.css";

import Froala from "react-froala-wysiwyg";
import FroalaEditorView from "react-froala-wysiwyg/FroalaEditorView";
//import Tribute from "tributejs";
//import "tributejs/dist/tribute.css";
//mport { options } from "./options";

export const FroalaEditor = ({stateUp, content}) => {
  const ref = useRef({ editor: null });
  const [isFroalaInitialized, setIsFroalaInitialized] = useState(false);
  //const tribute = new Tribute(options);
  const [editor, setEditor] = useState(undefined);
  const [model, setModel] = useState("");

  const handleModelChange = (model) => {
    setModel(model);
    stateUp(model);
  };

  const handleModelChange2 = () =>{
    setModel(content);
  }

  // Editor initialization
  useEffect(() => {
    //ref.current.editor.data._init = null;
    setEditor(ref.current.editor);
    editor && setIsFroalaInitialized(true);
    //console.log("tes", <Froala />);
  }, [ref.current]);

  // Do after initialization
  useEffect(() => {
    if (isFroalaInitialized) {
      //tribute.attach(editor.el);
      //editor.html.set(model);
    }
  }, [isFroalaInitialized]);


  // handleModelChange ||
  return (
    <div className="App">
      <Froala
        ref={ref}
        model={model}
        onModelChange={handleModelChange}
        tag="textarea"
        config={{
          attribution: false,
          placeholder: "Start typing...",
          toolbarButtons: {
            moreText: {
              buttons: [
                "bold",
                "italic",
                "underline",
                "strikeThrough",
                "subscript",
                "superscript",
                "fontFamily",
                "fontSize",
                "textColor",
                "backgroundColor",
                "inlineClass",
                "inlineStyle",
                "clearFormatting"
              ]
            },
            moreParagraph: {
              buttons: [
                "alignLeft",
                "alignCenter",
                "formatOLSimple",
                "alignRight",
                "alignJustify",
                "formatOL",
                "formatUL",
                "paragraphFormat",
                "paragraphStyle",
                "lineHeight",
                "outdent",
                "indent",
                "quote"
              ]
            },
            moreRich: {
              buttons: [
                "insertLink",
                "insertImage",
                "insertVideo",
                "insertTable",
                "emoticons",
                "fontAwesome",
                "specialCharacters",
                "embedly",
                "insertFile",
                "insertHR"
              ]
            },
            moreMisc: {
              buttons: [
                "undo",
                "redo",
                "fullscreen",
                "print",
                "getPDF",
                "spellChecker",
                "selectAll",
                "html",
                "help"
              ],
              align: "right",
              buttonsVisible: 2
            }
          },
          pluginsEnabled: [
            "table",
            "spell",
            "quote",
            "save",
            "quickInsert",
            "paragraphFormat",
            "paragraphStyle",
            "help",
            "draggable",
            "align",
            "link",
            "lists",
            "file",
            "image",
            "emoticons",
            "url",
            "video",
            "embedly",
            "colors",
            "entities",
            "inlineClass",
            "inlineStyle",
            // 'codeBeautif '
            // 'spellChecker',
            "imageTUI"
          ]
        }}
      />
      <br />
      {/* <strong>Read only editor:</strong> */}
      {/* {console.log(model)} */}
      {/* <FroalaEditorView model={model} /> */}
    </div>
  );
};

// Include special components if required.
// import FroalaEditorView from 'react-froala-wysiwyg/FroalaEditorView';
// import FroalaEditorA from 'react-froala-wysiwyg/FroalaEditorA';
// import FroalaEditorButton from 'react-froala-wysiwyg/FroalaEditorButton';
// import FroalaEditorImg from 'react-froala-wysiwyg/FroalaEditorImg';
// import FroalaEditorInput from 'react-froala-wysiwyg/FroalaEditorInput';

// Render Froala Editor component.
