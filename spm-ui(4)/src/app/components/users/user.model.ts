import { Group } from "../groups/group.model";

export class User {
  id: number;
  userName: string;
  email: string;
  passwordHash: string;
  isAmin: boolean;
  groups: Group[];
  checked: boolean;
}
