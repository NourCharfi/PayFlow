import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { RegisterRequest } from '../models/auth.model';
import { Role } from '../models/user';

@Component({
  selector: 'app-register',
  template: `
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="card">
            <div class="card-body">
              <h3 class="card-title text-center mb-4">Register</h3>
              <div *ngIf="error" class="alert alert-danger">{{error}}</div>
              <form (ngSubmit)="onSubmit()">
                <div class="mb-3">
                  <label for="username" class="form-label">Username</label>
                  <input type="text" class="form-control" id="username" [(ngModel)]="user.username" name="username" required>
                </div>
                <div class="mb-3">
                  <label for="email" class="form-label">Email</label>
                  <input type="email" class="form-control" id="email" [(ngModel)]="user.email" name="email" required>
                </div>
                <div class="mb-3">
                  <label for="password" class="form-label">Password</label>
                  <input type="password" class="form-control" id="password" [(ngModel)]="user.password" name="password" required>
                </div>
                <div class="d-grid">
                  <button type="submit" class="btn btn-primary" [disabled]="loading">
                    {{loading ? 'Loading...' : 'Register'}}
                  </button>
                </div>
                <div class="text-center mt-3">
                  <a routerLink="/login">Already have an account? Login</a>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class RegisterComponent {
  user: RegisterRequest = {
    username: '',
    email: '',
    password: '',
    roles: [Role.USER] // Default role
  };
  
  loading = false;
  error = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit() {
    this.loading = true;
    this.error = '';

    this.authService.register(this.user)
      .subscribe({
        next: () => {
          this.router.navigate(['/login']);
        },
        error: err => {
          this.error = err.error?.message || 'Registration failed';
          this.loading = false;
        }
      });
  }
}