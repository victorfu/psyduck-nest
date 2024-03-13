import { NoteTable } from "./note-table";
import { useLoaderData } from "react-router-dom";

function WorkspaceNotePage() {
  const { notes } = useLoaderData() as { notes: Note[] };

  return (
    <div>
      <NoteTable notes={notes} />
    </div>
  );
}

export default WorkspaceNotePage;
