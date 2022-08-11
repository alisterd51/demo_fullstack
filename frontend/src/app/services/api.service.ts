import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Technology } from '../models/technology';
import { User } from '../user';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  API_SERVER = "http://backend:3000";

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

  getTechs() {
    return this.httpClient.get<Technology[]>(`${this.API_SERVER}/techs`);
  }

  getTech(id: number) {
    return this.httpClient.get<Technology>(`${this.API_SERVER}/techs/${id}`)
  }

  createTech(techno: Technology) {
    return this.httpClient.post<Technology>(`${this.API_SERVER}/techs`, techno);
  }

  updateTech(techno: Technology) {
    return this.httpClient.patch<Technology>(`${this.API_SERVER}/techs/${techno.id}`, techno);
  }

  removeTech(id: number) {
    return this.httpClient.delete(`${this.API_SERVER}/techs/${id}`);
  }
}
