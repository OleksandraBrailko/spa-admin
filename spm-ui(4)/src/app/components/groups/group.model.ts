import { User } from "../users/user.model";

export class Group {
  id: number;
  groupName: string;
  description: string;
  email: string;
  enabledEmail: boolean;
  createdDate: Date;
  parentGroupId: number;
  parentGroup: string;
  childGroups: Group[];
  users: User[];
  checked: boolean;
}
