import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.services';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  users: User[] = [];  // Cambiar el tipo de 'users' a 'User[]'
  selectedUser: User | null = null;
  searchText: string = '';

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit() {
    // Obtener la lista de usuarios cuando el componente se inicializa
    this.userService.getUsers().subscribe((data) => {
      this.users = data.users; // Ahora 'data' tiene la propiedad 'users'
    });
  }

  filteredUsers(): User[] {
    return this.users.filter(user =>
      user.name.toLowerCase().includes(this.searchText.toLowerCase()) ||
      user.last_name.toLowerCase().includes(this.searchText.toLowerCase()) ||
      user.email.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }  
}