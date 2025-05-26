import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  template: `
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="card">
            <div class="card-body">
              <h3 class="card-title text-center mb-4">Login</h3>
              <div *ngIf="error" class="alert alert-danger">{{error}}</div>
              <form (ngSubmit)="onSubmit()" #loginForm="ngForm">
                <div class="mb-3">
                  <label for="username" class="form-label">Username</label>
                  <input type="text" 
                         class="form-control" 
                         id="username" 
                         [(ngModel)]="username" 
                         name="username" 
                         #usernameField="ngModel"
                         required
                         [class.is-invalid]="usernameField.invalid && usernameField.touched">
                  <div class="invalid-feedback" *ngIf="usernameField.invalid && usernameField.touched">
                    Username is required
                  </div>
                </div>
                <div class="mb-3">
                  <label for="password" class="form-label">Password</label>
                  <input type="password" 
                         class="form-control" 
                         id="password" 
                         [(ngModel)]="password" 
                         name="password"
                         #passwordField="ngModel" 
                         required
                         [class.is-invalid]="passwordField.invalid && passwordField.touched">
                  <div class="invalid-feedback" *ngIf="passwordField.invalid && passwordField.touched">
                    Password is required
                  </div>
                </div>
                <div class="d-grid">
                  <button type="submit" 
                          class="btn btn-primary" 
                          [disabled]="loading || loginForm.invalid">
                    {{loading ? 'Loading...' : 'Login'}}
                  </button>
                </div>
                <div class="text-center mt-3">
                  <a routerLink="/register">Don't have an account? Register</a>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent implements OnInit {
  username = '';
  password = '';
  loading = false;
  error = '';
  returnUrl: string = '/';

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) {
    // redirect to home if already logged in
    if (this.authService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit() {
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  onSubmit() {
    if (!this.username || !this.password) {
      this.error = 'Please fill in all fields';
      return;
    }

    this.loading = true;
    this.error = '';

    this.authService.login(this.username, this.password)
      .pipe(first())
      .subscribe({
        next: () => {
          this.toastr.success('Login successful');
          this.router.navigate([this.returnUrl]);
        },
        error: error => {
          this.error = error.message || 'Login failed';
          this.loading = false;
          this.toastr.error(this.error);
        }
      });
  }
}
