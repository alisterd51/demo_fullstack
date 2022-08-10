import { Injectable } from '@angular/core';
import { Form } from '@angular/forms';
import { Technology } from '../models/technology';

@Injectable({
  providedIn: 'root'
})
export class TechnoService {
  private technos: Technology[] = [];

  constructor() { }

  createTechno(techno: Technology) {
    const newTechno = { ...techno, id: Date.now() };
    this.technos = [newTechno, ...this.technos];
    console.log(this.technos);
  }

  getTechnos(): Technology[] {
    return this.technos;
  }

  deleteTechno(techno: Technology) {
    this.technos = this.technos.filter(t => t.id !== techno.id);
  }
}
