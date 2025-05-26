import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User, AuthResponse, LoginRequest, RefreshTokenRequest, RegisterRequest } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = '/api/auth';
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;
  private refreshTokenTimeout: any;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromStorage());
    this.currentUser = this.currentUserSubject.asObservable();
  }

  private getUserFromStorage(): User | null {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  login(username: string, password: string): Observable<User> {
    const loginRequest: LoginRequest = { username, password };
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, loginRequest)
      .pipe(
        map(response => {
          const user: User = {
            id: response.user_id, // Make sure your backend sends this
            username: username,
            token: response.access_token,
            refreshToken: response.refresh_token,
            roles: response.roles,
            expiresIn: response.expires_in
          };
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
          this.startRefreshTokenTimer(user);
          return user;
        })
      );
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.stopRefreshTokenTimer();
  }

  refreshToken(): Observable<User | null> {
    const request: RefreshTokenRequest = {
      refreshToken: this.currentUserValue?.refreshToken ?? ''
    };
    return this.http.post<AuthResponse>(`${this.apiUrl}/refreshToken`, request)
      .pipe(
        map(response => {
          const user = this.currentUserValue;
          if (user) {
            user.token = response.access_token;
            user.refreshToken = response.refresh_token;
            user.expiresIn = response.expires_in;
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.currentUserSubject.next(user);
            this.startRefreshTokenTimer(user);
            return user;
          }
          return null;
        })
      );
  }

  private startRefreshTokenTimer(user: User) {
    this.stopRefreshTokenTimer();
    // Refresh the token 1 minute before expiry
    const expires = new Date(Date.now() + (user.expiresIn * 1000));
    const timeout = expires.getTime() - Date.now() - (60 * 1000);
    this.refreshTokenTimeout = setTimeout(() => this.refreshToken().subscribe(), timeout);
  }

  private stopRefreshTokenTimer() {
    if (this.refreshTokenTimeout) {
      clearTimeout(this.refreshTokenTimeout);
    }
  }

  isAuthenticated(): boolean {
    const user = this.currentUserValue;
    return !!user && !!user.token;
  }

  hasRole(role: string): boolean {
    const user = this.currentUserValue;
    return user?.roles?.includes(role) ?? false;
  }

  isAdmin(): boolean {
    return this.hasRole('ADMIN');
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`);
  }

  updateUserRoles(userId: number, roles: string[]): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/users/${userId}/roles`, { roles });
  }

  register(user: RegisterRequest): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/register`, user);
  }
}
