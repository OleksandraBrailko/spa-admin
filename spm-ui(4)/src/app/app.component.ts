import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { fromEvent } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';
import { User } from './components/users/user.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  authenticateUser: User;
  email:string;
  password: string;

  constructor(private http: HttpClient) {

  }

  ngOnInit() {
    const user = localStorage.getItem('authenticateUser');

    if (user) {
      this.authenticateUser = JSON.parse(user);
    }
  }

  login() {
    this.http.post<User>('https://localhost:44326/User/login', { "email": this.email, "password": this.password }).subscribe(
      item => { this.authenticateUser = item; localStorage.setItem('authenticateUser', JSON.stringify(item)); },
      () => { alert('Email or password is incorrect') });
  }

  logout() {
    localStorage.setItem('authenticateUser', null);
    this.authenticateUser = null;
  }
}
