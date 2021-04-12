import { element } from 'protractor';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Group } from '../groups/group.model';
import { User } from './user.model';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  currentUser: User = new User();
  users: User[];
  authenticatedUser: User;
  usersFilter = '';

  get filteredUsers() {
    return this.usersFilter
      ? this.users.filter(item => item.userName.match(`.*${this.usersFilter}.*`))
      : this.users;
  }

  constructor(private httpClient: HttpClient) { }

  ngOnInit(): void {
    this.loadUsers();
    this.loadCurrentUser();
  }


  clearGroupModel() {
    this.currentUser = new User();
  }

  selectUser(user: User) {
    this.currentUser = { ...user };
  }

  createUser() {
    this.httpClient.post('https://localhost:44326/User', {
      userName: this.currentUser.userName,
      email: this.currentUser.email,
      password: '1234',
      isAmin: false,
    }).subscribe(
      () => { this.loadUsers(); },
      () => { alert('Error creating a new user.') }
    );
  }

  deleteUser(id: number) {
    this.httpClient.delete(`https://localhost:44326/User/${id}`).subscribe(
      () => { this.loadUsers(); },
      () => { alert('Error deleting the user.') }
    );
  }

  updateGroup() {
    this.httpClient.put('https://localhost:44326/User', {
      id: this.currentUser.id,
      userName: this.currentUser.userName,
      email: this.currentUser.email,
      password: '1234',
      isAmin: this.currentUser.isAmin,
    }).subscribe(
      () => { this.loadUsers(); },
      () => { alert('Error updating the user.') }
    );
  }

  private loadUsers() {
    this.httpClient.get<User[]>('https://localhost:44326/User').subscribe(
      (response) => { this.users = response.filter(item => item.id != this.authenticatedUser.id); }
    );
  }

  private loadCurrentUser() {
    this.authenticatedUser = JSON.parse(localStorage.getItem('authenticateUser'));
  }
}
