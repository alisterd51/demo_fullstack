import { Component, OnInit } from '@angular/core';
import { delay } from 'rxjs';
import { Technology } from '../models/technology';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-techno-list',
  templateUrl: './techno-list.component.html',
  styleUrls: ['./techno-list.component.css']
})
export class TechnoListComponent implements OnInit {
  dataSource: Technology[] = [];
  techno: Technology = {
    id: 0,
    technoname: '',
    category: '',
    details: ''
  };
  //allTechnos!: Observable<Technology[]>;
  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.getTechnos();
  }

  getTechnos() {
    this.apiService.getTechs().subscribe((result)=>{
      console.log(result);
      this.dataSource = result;
    });
  }

  async deleteTechno(techno: Technology) {
    console.log('deleteTechno', techno);
    this.apiService.removeTech(techno.id).subscribe((result)=>{
      console.log(result);
    });
    await new Promise(f => setTimeout(f, 50));//peux mieux faire
    this.getTechnos();
  }
}
