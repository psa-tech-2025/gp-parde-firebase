import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {

private readonly ALLOWED_LOGIN_EMAILS = [
  'infopsatech@gmail.com',
  'services.psatech@gmail.com'
];


  private loggedIn$ = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.loggedIn$.asObservable();

  constructor(
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore
  ) {
    this.checkSession();
  }

  getAuthState(): Observable<any> {
    return this.afAuth.authState;
  }

  // 🔐 REGISTER
  async register(name: string, email: string, mobile: string, password: string) {

  const cred = await this.afAuth.createUserWithEmailAndPassword(email, password);

  if (!cred.user) {
    throw new Error('User creation failed');
  }

  // 📧 Send verification email
  await cred.user.sendEmailVerification();

  // 💾 Save user profile
  await this.firestore.collection('gp-users').doc(cred.user.uid).set({
    uid: cred.user.uid,
    name,
    email,
    mobile,
    role: 'user',          // normal user
    createdAt: new Date()
  });

  // 🚪 Logout until verified
  await this.afAuth.signOut();
}

  // 🔐 LOGIN
  async login(email: string, password: string) {

  // 🚫 Block unauthorized emails at login
  if (!this.ALLOWED_LOGIN_EMAILS.includes(email.toLowerCase())) {
    throw new Error('EMAIL_NOT_ALLOWED');
  }

  const cred = await this.afAuth.signInWithEmailAndPassword(email, password);

  // 🚫 Email must be verified
  if (!cred.user?.emailVerified) {
    await this.afAuth.signOut();
    throw new Error('EMAIL_NOT_VERIFIED');
  }

  return cred;
}


  async resendVerification() {
    const user = await this.afAuth.currentUser;
    if (user && !user.emailVerified) {
      await user.sendEmailVerification();
    }
  }

  forgotPassword(email: string) {
    return this.afAuth.sendPasswordResetEmail(email);
  }

  async setSession() {
    localStorage.setItem('loginTime', Date.now().toString());
    this.loggedIn$.next(true);
  }

  checkSession() {
    const loginTime = localStorage.getItem('loginTime');
    if (!loginTime) return;

    const oneHour = 60 * 60 * 1000;
    if (Date.now() - +loginTime > oneHour) {
      this.logout();
    } else {
      this.loggedIn$.next(true);
    }
  }

  async logout() {
    localStorage.removeItem('loginTime');
    this.loggedIn$.next(false);
    await this.afAuth.signOut();
  }
}
