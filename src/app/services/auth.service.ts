import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  loggedIn: boolean = false;
  employeeId: string | null = null;
  sons: any[] = [];
  // Method to handle the logout process
  logout() {
    this.loggedIn = false;
    this.employeeId = null;
    // Clear login status and employee ID from localStorage
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('employeeId');
    this.sons = [];
  }
}
