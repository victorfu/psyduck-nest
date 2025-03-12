import { MessageSchedule } from "@/lib/message-schedule";
import { LineUser } from "@/lib/line-users";
import { User } from "firebase/auth";
import { useLoaderData, useRouteLoaderData } from "react-router-dom";
import { MemberWithLineUser } from "@/lib/member";
import { Workspace } from "@/lib/workspace";
import { TeamMember } from "@/lib/api";

export function useRootData() {
  // The id "root" needs to match the id in the router configuration
  return useRouteLoaderData("root") as {
    user: User | null;
  };
}

export function useWorkspacesLoaderData() {
  return useLoaderData() as {
    workspaces: Workspace[] | null;
  };
}

export function useWorkspaceLoaderData() {
  return useLoaderData() as {
    workspace: Workspace | null;
  };
}

export function useWorkspacesLoaderDataWithId() {
  return useRouteLoaderData("workspaces") as {
    workspaces: Workspace[] | null;
  };
}

export function useLineUsersLoaderData() {
  return useLoaderData() as {
    lineUsers: LineUser[] | null;
  };
}

export function useScheduleMessagesLoaderData() {
  return useLoaderData() as {
    messageSchedules: MessageSchedule[] | null;
  };
}

export function useMembersLoaderData() {
  return useLoaderData() as {
    members: MemberWithLineUser[] | null;
  };
}

export function useDashboardLoaderData() {
  return useLoaderData() as {
    workspace: Workspace | null;
    memberCount: number;
    lineUserCount: number;
  };
}

export function useTeamLoaderData() {
  return useLoaderData() as {
    workspace: Workspace | null;
    teamMembers: TeamMember[] | null;
  };
}
