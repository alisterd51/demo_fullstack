import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Technology } from '../models/technology';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  API_SERVER = "http://localhost:8080/api";

  constructor(private httpClient: HttpClient) { }

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
