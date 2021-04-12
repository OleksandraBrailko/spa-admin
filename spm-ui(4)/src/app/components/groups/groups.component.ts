import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { User } from '../users/user.model';
import { Group } from './group.model';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.css']
})
export class GroupsComponent implements OnInit {

  currentGroup: Group = new Group();
  groups: Group[];
  users: User[];
  authenticatedUser: User;
  groupsFilter = '';

  get usersForCheckboxes() {
    return this.users?.filter(item => item.id != this.authenticatedUser.id && !this.currentGroup.users?.map(user => user.id).includes(item.id));
  }

  get groupsForCheckboxes() {
    return this.groups?.filter(item => item.id != this.currentGroup.id && !this.currentGroup.childGroups?.map(gr => gr.id).includes(item.id));
  }

  get filteredGroups() {
    return this.groupsFilter
      ? this.groups.filter(item => item.groupName.match(`.*${this.groupsFilter}.*`))
      : this.groups;
  }

  constructor(private httpClient: HttpClient) { }

  ngOnInit(): void {
    this.loadGroups();
    this.loadUsers();
    this.loadCurrentUser();
  }

  clearGroupModel() {
    this.currentGroup = new Group();
    this.currentGroup.enabledEmail = true;
  }

  createGroup() {
    this.httpClient.post('https://localhost:44326/Group', {
      groupName: this.currentGroup.groupName,
      description: this.currentGroup.description,
      email: this.currentGroup.email,
      enabledEmail: this.currentGroup.enabledEmail,
      usersIds: [this.authenticatedUser.id]
    }).subscribe(
      () => { this.loadGroups(); },
      () => { alert('Error creating a new group.') }
    );
  }

  deleteGroup(id: number) {
    this.httpClient.delete(`https://localhost:44326/Group/${id}`).subscribe(
      () => { this.loadGroups(); },
      () => { alert('Error deleting a new group.') }
    );
  }

  selectGroup(group: Group) {
    this.currentGroup = { ...group };
  }

  updateGroup() {
    this.httpClient.put('https://localhost:44326/Group', {
      id: this.currentGroup.id,
      groupName: this.currentGroup.groupName,
      description: this.currentGroup.description,
      email: this.currentGroup.email,
      enabledEmail: this.currentGroup.enabledEmail,
    }).subscribe(
      () => { this.loadGroups(); },
      () => { alert('Error updating the group.') }
    );
  }

  resetAllCheckboxes() {
    for (const group of this.groups) {
      group.checked = false;
    }
    for (const user of this.users) {
      user.checked = false;
    }
  }

  updateGroupMembers() {
    this.httpClient.put('https://localhost:44326/Group', {
      id: this.currentGroup.id,
      groupName: this.currentGroup.groupName,
      description: this.currentGroup.description,
      email: this.currentGroup.email,
      enabledEmail: this.currentGroup.enabledEmail,
      usersIds: [...this.currentGroup.users.map(item => item.id), ...this.users.filter(item => item.checked).map(item => item.id)],
      childGroupsIds: [...this.currentGroup.childGroups.map(item => item.id), ...this.groups.filter(item => item.checked).map(item => item.id)]
    }).subscribe(
      () => { this.loadGroups(); },
      () => { alert('Error updating the group.') }
    );
  }

  deleteUserGroupMember(id) {
    this.httpClient.put('https://localhost:44326/Group', {
      id: this.currentGroup.id,
      groupName: this.currentGroup.groupName,
      description: this.currentGroup.description,
      email: this.currentGroup.email,
      enabledEmail: this.currentGroup.enabledEmail,
      usersIds: this.currentGroup.users.map(item => item.id).filter(item => item != id)
    }).subscribe(
      () => { this.loadGroups(); },
      () => { alert('Error updating the group.') }
    );
  }

  deleteChildGroupMember(id) {
    this.httpClient.put('https://localhost:44326/Group', {
      id: this.currentGroup.id,
      groupName: this.currentGroup.groupName,
      description: this.currentGroup.description,
      email: this.currentGroup.email,
      enabledEmail: this.currentGroup.enabledEmail,
      childGroupsIds: this.currentGroup.childGroups.map(item => item.id).filter(item => item != id)
    }).subscribe(
      () => { this.loadGroups(); },
      () => { alert('Error updating the group.') }
    );
  }

  private loadGroups() {
    this.httpClient.get<Group[]>('https://localhost:44326/Group').subscribe(
      (response) => {
        this.groups = response;

        if (this.currentGroup && this.currentGroup.id) {
          this.currentGroup = this.groups.find(item => item.id == this.currentGroup.id);
        }
      }
    );
  }

  private loadUsers() {
    this.httpClient.get<User[]>('https://localhost:44326/User').subscribe(
      (response) => { this.users = response; }
    );
  }

  private loadCurrentUser() {
    this.authenticatedUser = JSON.parse(localStorage.getItem('authenticateUser'));
  }
}
