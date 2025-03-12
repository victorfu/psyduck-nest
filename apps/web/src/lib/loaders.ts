import { LoaderFunctionArgs, redirect } from "react-router-dom";
import { waitForAuthReady } from "../auth/auth-state";
import { authService } from "../auth/auth-service";
import { getWorkspace, getWorkspaces } from "./workspace";
import {
  countLineUsers,
  getLineUsers,
  getLineUsersByPhoneNumbers,
} from "./line-users";
import { countMembers, getMembers } from "./member";
import { getMessageSchedules } from "./message-schedule";

export async function rootLoader() {
  await waitForAuthReady();

  return { user: authService.user };
}

export async function loginLoader() {
  await waitForAuthReady();

  if (authService.isAuthenticated) {
    return redirect("/");
  }
  return null;
}

export async function mainLoader({ request }: LoaderFunctionArgs) {
  await waitForAuthReady();

  if (!authService.isAuthenticated || !authService.user?.uid) {
    const params = new URLSearchParams();
    params.set("from", new URL(request.url).pathname);
    return redirect("/login?" + params.toString());
  }

  const workspaces = await getWorkspaces(authService.user.uid);
  if (workspaces && workspaces.length > 0) {
    return redirect(`/workspace/${workspaces[0].id}`);
  }

  return null;
}

export async function workspacesLoader({ request }: LoaderFunctionArgs) {
  await waitForAuthReady();

  if (!authService.isAuthenticated || !authService.user?.uid) {
    const params = new URLSearchParams();
    params.set("from", new URL(request.url).pathname);
    return redirect("/login?" + params.toString());
  }

  const workspaces = await getWorkspaces(authService.user.uid);
  return { workspaces };
}

export async function settingsLoader({ params }: LoaderFunctionArgs) {
  await waitForAuthReady();

  const workspaceId = params.workspaceId;
  if (workspaceId) {
    const workspace = await getWorkspace(workspaceId);
    return { workspace };
  }

  return {};
}

export async function lineUsersLoader({ params }: LoaderFunctionArgs) {
  await waitForAuthReady();

  const workspaceId = params.workspaceId;
  if (workspaceId) {
    const lineUsers = await getLineUsers(workspaceId);
    return { lineUsers };
  }

  return {};
}

export async function scheduleMessagesLoader({ params }: LoaderFunctionArgs) {
  await waitForAuthReady();

  const workspaceId = params.workspaceId;
  if (workspaceId) {
    const messageSchedules = await getMessageSchedules(workspaceId);
    return { messageSchedules };
  }

  return {};
}

export async function membersLoader({ params }: LoaderFunctionArgs) {
  await waitForAuthReady();

  const workspaceId = params.workspaceId;
  if (authService?.user?.uid && workspaceId) {
    const members = await getMembers(authService.user.uid, workspaceId);
    const phoneNumbers = members.map((m) => m.phone).filter(Boolean);
    const lineUsers = await getLineUsersByPhoneNumbers(
      workspaceId,
      phoneNumbers,
    );
    const lineUserMap = new Map(lineUsers.map((lu) => [lu.phone, lu]));
    return {
      members: members.map((m) => ({
        ...m,
        lineUser: lineUserMap.get(m.phone),
      })),
    };
  }

  return {};
}

export async function dashboardLoader({ params }: LoaderFunctionArgs) {
  await waitForAuthReady();

  const workspaceId = params.workspaceId;
  const uid = authService.user?.uid;
  if (!uid || !workspaceId) {
    return {};
  }

  const [workspace, memberCount, lineUserCount] = await Promise.all([
    getWorkspace(workspaceId),
    countMembers(uid, workspaceId),
    countLineUsers(workspaceId),
  ]);

  return { workspace, memberCount, lineUserCount };
}
