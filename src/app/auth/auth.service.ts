import { Injectable } from '@angular/core';
import { signUp, signIn, signOut, getCurrentUser, confirmSignUp, resendSignUpCode } from 'aws-amplify/auth';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject = new BehaviorSubject<any>(null);
  public user$ = this.userSubject.asObservable();

  constructor() {
    this.checkCurrentUser();
  }

  async checkCurrentUser() {
    try {
      const user = await getCurrentUser();
      this.userSubject.next(user);
    } catch (error) {
      this.userSubject.next(null);
    }
  }

  async signUp(email: string, password: string) {
    try {
      const result = await signUp({
        username: email,
        password,
        options: {
          userAttributes: {
            email
          }
        }
      });
      return result;
    } catch (error) {
      throw error;
    }
  }

  async confirmSignUp(email: string, code: string) {
    try {
      const result = await confirmSignUp({
        username: email,
        confirmationCode: code
      });
      return result;
    } catch (error) {
      throw error;
    }
  }

  async signIn(email: string, password: string) {
    try {
      const result = await signIn({
        username: email,
        password
      });
      await this.checkCurrentUser();
      return result;
    } catch (error) {
      throw error;
    }
  }

  async signOut() {
    try {
      await signOut();
      this.userSubject.next(null);
    } catch (error) {
      throw error;
    }
  }

  async resendConfirmationCode(email: string) {
    try {
      const result = await resendSignUpCode({
        username: email
      });
      return result;
    } catch (error) {
      throw error;
    }
  }
}
