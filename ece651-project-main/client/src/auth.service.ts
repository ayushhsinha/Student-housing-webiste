import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { API_ENDPOINTS } from './api.constants';

type User = {
  firstname: string;
  lastname: string;
  email: string;
  verified_email: boolean;
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private user: User | null = null;
  private readonly isLoggedInKey = 'isLoggedIn';

  constructor(private apiService: ApiService) {}

  async setUser() {
    this.apiService.get(API_ENDPOINTS.profile).subscribe(
      (data: User) => {
        this.user = data;
        this.setLoggedIn(data);
        console.log(this.user);
      },
      (error) => {
        console.error(error);
      }
    );
  }

  removeUser() {
    this.user = null;
    this.removeLoggedIn();
  }

  setLoggedIn(user: User): void {
    sessionStorage.setItem('user', JSON.stringify(user));
  }

  removeLoggedIn(): void {
    sessionStorage.removeItem('user');
  }

  getisLoggedIn(): boolean {
    const storedValue = sessionStorage.getItem('user');
    return storedValue ? true : false;
  }

  getUser(): User | null {
    const storedValue = sessionStorage.getItem('user');
    return storedValue ? JSON.parse(storedValue) : null;
  }
}
