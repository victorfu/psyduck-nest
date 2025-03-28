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
  orderBy,
  where,
  writeBatch,
} from "firebase/firestore";
import { db } from "./firebase";
import { LineUser } from "./line-users";
import { Auditable } from "@/models";

export interface Member extends Auditable {
  id: string;
  name: string;
  email: string;
  phone: string;
  workspaceIds: string[];
}

export interface MemberWithLineUser extends Member {
  lineUser: LineUser;
}

export type MemberFields = Pick<Member, "name" | "email" | "phone">;

export const addMember = async (member: Partial<Member>) => {
  const docRef = await addDoc(collection(db, "members"), member);
  return { ...member, id: docRef.id } as Member;
};

export const batchAddMembers = async (members: Partial<Member>[]) => {
  const batch = writeBatch(db);

  members.forEach((member) => {
    const docRef = doc(collection(db, "members"));
    batch.set(docRef, member, { merge: true });
  });

  await batch.commit();
};

export const getMembers = async (workspaceId: string): Promise<Member[]> => {
  const querySnapshot = await getDocs(
    query(
      collection(db, "members"),
      where(`workspaceIds`, "array-contains", workspaceId),
      orderBy("createdAt", "desc"),
    ),
  );

  return querySnapshot.docs.map((doc) => {
    return { ...doc.data(), id: doc.id } as Member;
  });
};

export const getMember = async (id: string) => {
  const docRef = doc(collection(db, "members"), id);
  const docSnap = await getDoc(docRef);
  return { ...docSnap.data(), id: docSnap.id } as Member;
};

export const hasMembersInWorkspace = async (workspaceId: string) => {
  const querySnapshot = await getDocs(
    query(
      collection(db, "members"),
      where(`workspaceIds`, "array-contains", workspaceId),
    ),
  );
  return querySnapshot.docs.length > 0;
};

export const updateMember = async (id: string, member: Partial<Member>) => {
  if ("key" in member) {
    // don't update key, this is for table row key
    delete member.key;
  }
  const docRef = doc(collection(db, "members"), id);
  await updateDoc(docRef, member);
};

export const deleteMember = async (member: Member) => {
  const docRef = doc(collection(db, "members"), member.id);
  await deleteDoc(docRef);
};

export const countMembers = async (workspaceId: string) => {
  const querySnapshot = await getCountFromServer(
    query(
      collection(db, "members"),
      where(`workspaceIds`, "array-contains", workspaceId),
    ),
  );
  return querySnapshot.data().count;
};
