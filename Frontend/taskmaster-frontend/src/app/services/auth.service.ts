import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private TOKEN_KEY = 'auth_token';

  setToken(token: string) {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  signInWithGoogle() {
    // Example: Redirect to your backend OAuth endpoint
    window.location.href = 'http://localhost:5000/auth/google';  }
}
