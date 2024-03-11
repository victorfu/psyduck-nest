import Api from "@/lib/api";
import Editor from "./editor";
import { useLocation } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import EditorJS from "@editorjs/editorjs";
import { Input } from "@/components/ui/input";
import debounce from "lodash/debounce";

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

  const updateNote = async (id: number, note: Partial<Note>) => {
    return await Api.updateNote(id, note);
  };

  const debouncedUpdateNote = useCallback(debounce(updateNote, 500), []);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!note) return;
    debouncedUpdateNote(note.id, {
      title: event.target.value,
    })?.catch(console.error);
  };

  return (
    <div>
      <div className="overview__canvas">
        <Input
          className="text-2xl font-bold mb-4 text-center focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 border-0"
          defaultValue={note?.title}
          onChange={handleTitleChange}
        />
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
    </div>
  );
}

export default WorkspaceNoteDetailPage;
