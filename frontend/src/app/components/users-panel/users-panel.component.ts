import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-users-panel',
  templateUrl: './users-panel.component.html',
  styleUrls: ['./users-panel.component.css']
})
export class UsersPanelComponent implements OnInit {
  users: User[] = [];
  selectedUse: User | null = null;
  searchText: string = '';

  constructor(private userService: UserService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.userService.getUsers().subscribe((response) => {
      this.users = response.data;
    });
  }

  // Método para actualizar la URL con el texto de búsqueda
  onSearchChange(searchValue: string): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { search: searchValue },
      queryParamsHandling: 'merge'
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
