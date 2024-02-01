import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  idNumber: string = '';
  password: string = '';
  loginError: string | null = null;
  showPassword: boolean = false;
  loading: boolean = false;


  @ViewChild('passwordInput') passwordInput!: ElementRef;


  constructor(private http: HttpClient, private authService: AuthService) {}

  ngOnInit() {
    const storedLoggedIn = localStorage.getItem('loggedIn');
    const storedEmployeeId = localStorage.getItem('employeeId');
    if (storedLoggedIn === 'true' && storedEmployeeId) {
      this.authService.loggedIn = true;
      this.authService.employeeId = storedEmployeeId;
    }
  }

togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }


  login() {
    this.loading = true;
    const url = 'http://localhost:3000/login';
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const requestBody = { idNumber: this.idNumber, password: this.password };

    this.http.post(url, requestBody, { headers }).subscribe(
      (response: any) => {
        if (response.success) {
          this.authService.loggedIn = true;
          this.authService.employeeId = response.employee_id || this.idNumber;
          this.loginError = null;

          localStorage.setItem('loggedIn', 'true');
          localStorage.setItem('employeeId', this.authService.employeeId || '');
          console.log('Login successful');

          localStorage.setItem('token', response.token);
        } else {
          this.authService.loggedIn = false;
          this.loginError = 'Wrong ID or password!';
          console.error('Login failed: ', response.message);
        }
        this.loading = false;
      },
      (error) => {
        this.authService.loggedIn = false;
        this.loginError = 'Wrong ID or password!';
        console.error('Wrong ID or password! ', error);
        this.loading = false;
      }
    );
  }
}
