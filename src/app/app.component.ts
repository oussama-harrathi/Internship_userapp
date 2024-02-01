import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  // Declare a variable to hold the logged-in status
  loggedIn: boolean = false;
  employeeId: string | null = null;

  constructor(private authService: AuthService, private http: HttpClient) {}

  ngOnInit() {
    // Check if login status is stored in AuthService
    if (this.authService.loggedIn && this.authService.employeeId) {
      this.loggedIn = true;
      this.employeeId = this.authService.employeeId;
    }
  }
 
  }

