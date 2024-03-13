import { useCallback, useEffect } from "react";
import EditorJS, {
  API,
  BlockMutationEvent,
  OutputData,
} from "@editorjs/editorjs";

// @ts-expect-error - no types available
import Header from "@editorjs/header";
// @ts-expect-error - no types available
import SimpleImage from "@editorjs/simple-image";
// @ts-expect-error - no types available
import List from "@editorjs/list";
// @ts-expect-error - no types available
import Checklist from "@editorjs/checklist";
// @ts-expect-error - no types available
import Quote from "@editorjs/quote";
// @ts-expect-error - no types available
import Warning from "@editorjs/warning";
// @ts-expect-error - no types available
import Marker from "@editorjs/marker";
// @ts-expect-error - no types available
import CodeTool from "@editorjs/code";
// @ts-expect-error - no types available
import Delimiter from "@editorjs/delimiter";
// @ts-expect-error - no types available
import InlineCode from "@editorjs/inline-code";
// @ts-expect-error - no types available
import LinkTool from "@editorjs/link";
// @ts-expect-error - no types available
import Embed from "@editorjs/embed";
// @ts-expect-error - no types available
import Table from "@editorjs/table";

let editor: EditorJS | null = null;

function Editor({
  data,
  onReady,
  onChange,
}: {
  data: OutputData;
  onReady?: () => void;
  onChange?: (
    api: API,
    event: BlockMutationEvent | BlockMutationEvent[],
  ) => void;
}) {
  const newEditor = useCallback(() => {
    editor = new EditorJS({
      readOnly: false,
      holder: "editorjs",
      placeholder: "Type something...",

      /**
       * Common Inline Toolbar settings
       * - if true (or not specified), the order from 'tool' property will be used
       * - if an array of tool names, this order will be used
       */
      // inlineToolbar: ["link", "marker", "bold", "italic"],
      inlineToolbar: true,

      /**
       * Tools list
       */
      tools: {
        /**
         * Each Tool is a Plugin. Pass them via 'class' option with necessary settings {@link docs/tools.md}
         */
        header: {
          class: Header,
          inlineToolbar: ["marker", "link"],
          config: {
            placeholder: "Header",
          },
          shortcut: "CMD+SHIFT+H",
        },

        /**
         * Or pass class directly without any configuration
         */
        image: SimpleImage,

        list: {
          class: List,
          inlineToolbar: true,
          shortcut: "CMD+SHIFT+L",
        },

        checklist: {
          class: Checklist,
          inlineToolbar: true,
        },

        quote: {
          class: Quote,
          inlineToolbar: true,
          config: {
            quotePlaceholder: "Enter a quote",
            captionPlaceholder: "Quote's author",
          },
          shortcut: "CMD+SHIFT+O",
        },

        warning: Warning,

        marker: {
          class: Marker,
          shortcut: "CMD+SHIFT+M",
        },

        code: {
          class: CodeTool,
          shortcut: "CMD+SHIFT+C",
        },

        delimiter: Delimiter,

        inlineCode: {
          class: InlineCode,
          shortcut: "CMD+SHIFT+C",
        },

        linkTool: LinkTool,

        embed: Embed,

        table: {
          class: Table,
          inlineToolbar: true,
          shortcut: "CMD+ALT+T",
        },
      },
      data: data,
      onReady: onReady,
      onChange: onChange,
    });
  }, [data, onChange, onReady]);

  useEffect(() => {
    const removeEditor = async () => {
      if (editor !== undefined && editor !== null) {
        await editor.isReady;
        if (
          editor != undefined &&
          editor !== null &&
          typeof editor.destroy === "function"
        ) {
          editor.destroy();
          editor = null;
        }
      }
    };

    removeEditor().then(newEditor).catch(console.error);

    return () => {
      removeEditor().catch(console.error);
    };
  }, [data, newEditor]);

  return <div id="editorjs"></div>;
}

export default Editor;
