import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { User } from '../user';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'salary', 'age', 'actions'];
  dataSource: User[] = [];
  user: User = {
    id: 0,
    name: '',
    salary: 0,
    age: 0
  };

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.apiService.getUsers().subscribe((result)=>{
      this.dataSource = result;
    })
  }

  selectUser(user: User) {
    this.user = user;
  }

  newUser() {
    this.user = {
      id: 0,
      name: '',
      salary: 0,
      age: 0
    };
  }

  createUser(f: { value: User; }) {
    this.apiService.createUser(f.value).subscribe((result)=>{
      console.log(result);
    });
  }

  deleteUser(id: number) {
    this.apiService.removeUser(id).subscribe((result)=>{
      console.log(result);
    });
  }

  updateUser(f: { value: User; }) {
    f.value.id = this.user['id'];
    this.apiService.updateUser(f.value).subscribe((result)=>{
      console.log(result);
    });
  }
}
