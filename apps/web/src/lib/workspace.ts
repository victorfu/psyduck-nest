import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getCountFromServer,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
  WithFieldValue,
  writeBatch,
} from "firebase/firestore";
import { db } from "./firebase";
import { hasMembersInWorkspace } from "./member";
import { Auditable } from "@/models";

export interface LineConfig {
  liffId: string;
  botId: string;
  channelId: string;
  channelSecret: string;
  channelAccessToken: string;
  qrCodeUrl: string;
}

interface GoogleConfig {
  name: string;
  placeId: string;
}

export interface Workspace extends Auditable {
  id: string;
  name: string;
  description: string;
  uids: string[];
  lineConfig?: LineConfig;
  googleConfig?: GoogleConfig;
  imageUrl?: string;
}

export type WorkspaceFields = Pick<
  Workspace,
  "name" | "description" | "imageUrl"
>;

export const addWorkspace = async (workspace: Partial<Workspace>) => {
  if (!workspace.uids) {
    throw new Error("uids are required");
  }
  const docRef = await addDoc(collection(db, "workspaces"), workspace);
  return { ...workspace, id: docRef.id } as Workspace;
};

export const getWorkspaces = async (uid: string): Promise<Workspace[]> => {
  const querySnapshot = await getDocs(
    query(collection(db, "workspaces"), where(`uids`, "array-contains", uid)),
  );
  return querySnapshot.docs
    .map((doc) => {
      const data = doc.data() as Workspace;
      return { ...data, id: doc.id } as Workspace;
    })
    .sort(
      (a, b) => a.createdAt.toDate().getTime() - b.createdAt.toDate().getTime(),
    );
};

export const getWorkspace = async (id: string): Promise<Workspace | null> => {
  const docRef = doc(collection(db, "workspaces"), id);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? ({ ...docSnap.data(), id } as Workspace) : null;
};

export const updateWorkspace = async (
  id: string,
  workspace: Partial<WithFieldValue<Workspace>>,
) => {
  if (workspace.uids) {
    throw new Error("uids are not allowed to be updated");
  }
  if ("key" in workspace) {
    // don't update key, this is for table row key
    delete workspace.key;
  }
  const docRef = doc(collection(db, "workspaces"), id);
  await updateDoc(docRef, workspace);
};

export const deleteWorkspace = async (workspace: Workspace) => {
  const hasMembers = await hasMembersInWorkspace(workspace.id);
  if (hasMembers) {
    throw new Error("Workspace has members, please remove them first");
  }

  const docRef = doc(collection(db, "workspaces"), workspace.id);
  await deleteDoc(docRef);
};

export const countWorkspaces = async (uid: string) => {
  const querySnapshot = await getCountFromServer(
    query(collection(db, "workspaces"), where(`uids`, "array-contains", uid)),
  );
  return querySnapshot.data().count;
};

export const bulkSetWorkspaces = async (workspaces: Workspace[]) => {
  const batch = writeBatch(db);
  workspaces.forEach((workspace) => {
    const docRef = doc(collection(db, "workspaces"), workspace.id);
    batch.set(docRef, workspace);
  });
  await batch.commit();
};
