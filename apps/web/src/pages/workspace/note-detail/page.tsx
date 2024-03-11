import Api from "@/lib/api";
import Editor from "./editor";
import { useLocation } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import EditorJS from "@editorjs/editorjs";

function WorkspaceNoteDetailPage() {
  const { pathname } = useLocation();
  console.log(pathname);
  // const { note } = useLoaderData() as { note: Note };

  const [note, setNote] = useState<Note>();

  const loadNote = useCallback(async (id: number) => {
    return await Api.getNote(id);
  }, []);

  useEffect(() => {
    const id = pathname.split("/").pop();
    if (id) {
      loadNote(+id)
        .then((note) => {
          setNote(note);
        })
        .catch(console.error);
    }
  }, [loadNote, pathname]);

  const convertNoteToEditorData = (note?: Note) => {
    if (!note) {
      return {
        time: new Date().getTime(),
        version: EditorJS.version,
        blocks: [],
      };
    }
    return JSON.parse(note.content) as EditorJS.OutputData;
  };

  return (
    <div>
      <div className="text-2xl font-bold mb-4 text-center">{note?.title}</div>

      <Editor
        data={convertNoteToEditorData(note)}
        onChange={(api) => {
          api.saver
            .save()
            .then(async (outputData) => {
              console.log("Saving complete: ", JSON.stringify(outputData));
              if (!note) return;
              try {
                await Api.updateNote(note.id, {
                  content: JSON.stringify(outputData),
                });
                await loadNote(note.id);
              } catch (error) {
                console.error("Saving failed: ", error);
              }
            })
            .catch((error) => {
              console.error("Saving failed: ", error);
            });
        }}
      />
    </div>
  );
}

export default WorkspaceNoteDetailPage;
