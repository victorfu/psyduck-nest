export interface LineUserDto {
  lineUserId: string;
  workspaceId: string;
  displayName: string;
  pictureUrl?: string;
  statusMessage?: string;
  language?: string;
  isFollowing: boolean;
  id?: string;
  memberId?: string;
  phone?: string;
  waitingForPhone?: boolean;
}
