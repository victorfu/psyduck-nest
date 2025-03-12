import {
  getDocs,
  query,
  collection,
  where,
  getCountFromServer,
} from "firebase/firestore";
import { db } from "./firebase";

export interface LineUser {
  lineUserId: string;
  displayName: string;
  pictureUrl: string;
  language: string;
  isFollowing: boolean;
  workspaceId: string;
  phone?: string;
  memberId?: string;
}

export const getLineUsers = async (
  workspaceId: string,
): Promise<LineUser[]> => {
  const querySnapshot = await getDocs(
    query(
      collection(db, "line-users"),
      where("workspaceId", "==", workspaceId),
    ),
  );
  return querySnapshot.docs
    .map((doc) => {
      return { ...doc.data() } as LineUser;
    })
    .sort((a, b) => a.lineUserId.localeCompare(b.lineUserId));
};

export const getLineUsersByPhoneNumbers = async (
  workspaceId: string,
  phoneNumbers: string[],
): Promise<LineUser[]> => {
  if (phoneNumbers.length === 0) {
    return [];
  }
  const querySnapshot = await getDocs(
    query(
      collection(db, "line-users"),
      where("workspaceId", "==", workspaceId),
      where("phone", "in", phoneNumbers),
    ),
  );
  return querySnapshot.docs
    .map((doc) => {
      return { ...doc.data() } as LineUser;
    })
    .sort((a, b) => a.lineUserId.localeCompare(b.lineUserId));
};

export const getLineUserByMemberId = async (
  workspaceId: string,
  memberId: string,
) => {
  const querySnapshot = await getDocs(
    query(
      collection(db, "line-users"),
      where("memberId", "==", memberId),
      where("workspaceId", "==", workspaceId),
    ),
  );

  if (querySnapshot.docs.length === 0) {
    return null;
  }

  return querySnapshot.docs[0].data() as LineUser;
};

export const countLineUsers = async (workspaceId: string) => {
  const querySnapshot = await getCountFromServer(
    query(
      collection(db, "line-users"),
      where("workspaceId", "==", workspaceId),
    ),
  );
  return querySnapshot.data().count;
};
