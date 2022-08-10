import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../user';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  API_SERVER = "http://localhost:3000";

  constructor(private httpClient: HttpClient) { }

  getUsers() {
    return this.httpClient.get<User[]>(`${this.API_SERVER}/users`);
  }

  getUser(id: number) {
    return this.httpClient.get<User>(`${this.API_SERVER}/users/${id}`)
  }

  createUser(user: User) {
    return this.httpClient.post<User>(`${this.API_SERVER}/users`, user);
  }

  updateUser(user: User) {
    return this.httpClient.patch<User>(`${this.API_SERVER}/users/${user.id}`, user);
  }

  removeUser(id: number) {
    return this.httpClient.delete(`${this.API_SERVER}/users/${id}`);
  }
}
