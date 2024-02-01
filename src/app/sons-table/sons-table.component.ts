import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../services/auth.service'; // Import the AuthService

@Component({
  selector: 'app-sons-table',
  templateUrl: './sons-table.component.html',
  styleUrls: ['./sons-table.component.css']
})
export class SonsTableComponent implements OnInit {
  sons: any[] = [];

  constructor(private http: HttpClient, public authService: AuthService) {} // Inject AuthService

  ngOnInit() {
    const storedLoggedIn = localStorage.getItem('loggedIn');
    const storedEmployeeId = localStorage.getItem('employeeId');
    if (storedLoggedIn === 'true' && storedEmployeeId) {
      this.authService.loggedIn = true;
      this.authService.employeeId = storedEmployeeId;
    }
    this.fetchSonsData();
  }

  fetchSonsData() {
    const url = 'http://localhost:3000/sons';
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });

    this.http.get(url, { headers }).subscribe(
      (response: any) => {
        console.log('API Response:', response);
        if (response.success) {
          this.sons = response.sons;
        } else {
          console.error('Failed to fetch sons\' information');
        }
      },
      (error) => {
        console.error('An error occurred while fetching sons\' information: ', error);
      }
    );
  }

  saveSonChanges(son: any) {
    if (son.canUpdate !== 1) {
      console.log("User doesn't have permission to update this son's information.");
      return; // Exit the function without proceeding further
    }
    
    const url = 'http://localhost:3000/update-son';
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });

    this.http.post(url, son, { headers }).subscribe(
      (response: any) => {
        if (response.success) {
          console.log('Son information updated successfully');
          son.isUpdated = true;
        } else {
          console.error('Failed to update son\'s information');
        }
      },
      (error) => {
        console.error('An error occurred while updating son\'s information: ', error);
      }
    );
  }

  // Handle "Level of Studies" change and populate class options
  onLevelChange(son: any) {
    switch (son.levelOfStudies) {
      case 'أساسي':
        son.classOptions = ['1', '2', '3', '4', '5', '6'];
        break;
      case 'إعدادي':
        son.classOptions = ['7', '8', '9'];
        break;
      case 'ثانوي':
        son.classOptions = ['1', '2', '3', '4'];
        break;
      case 'تعليم عالي':
      case 'ذوي الهمّة':
      case 'تكوين مهني':
        son.classOptions = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
        break;
      default:
        son.classOptions = [];
        break;
    }
  }

  // Method to handle logout
  logout() {
    this.authService.logout(); // Call the logout method from AuthService
    this.sons = []; // Clear the sons array
  }
}
