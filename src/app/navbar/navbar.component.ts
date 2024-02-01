// navbar.component.ts
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service'; 

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
   loggedIn: boolean = false;
  employeeId: string | null = null;
  constructor(public authService: AuthService) {} // Use public to bind to template

  ngOnInit() {
    this.loggedIn = this.authService.loggedIn;
    this.employeeId = this.authService.employeeId;
  }

  // Method to handle the logout process
  logout() {
    this.authService.logout(); // Call the logout method from AuthService
  }
}


