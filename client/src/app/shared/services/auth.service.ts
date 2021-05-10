import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, Subscription, timer } from 'rxjs';
import { JwtToken } from '../models/jwtToken.model';
import { User } from '../models/user.model';
import { switchMap, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public jwtToken: BehaviorSubject<JwtToken> = new BehaviorSubject({
    isAuthenticated: null,
    token: null,
  });
  public subscription: Subscription;
  constructor(private http: HttpClient, private router: Router) {
    this.initToken();
    this.subscription = this.initTimer();
  }

  /**
   *Création d’une méthode pour récupérer le token sur notre service d’authentification
   nous allons créer une méthode qui va nous permettre de récupérer le token lorsque l’utilisateur 
   rafraichit la page ou quitte son navigateur et revient.(initToken)
   */

  public initToken(): void {
    const token = localStorage.getItem('jwt');
    if (token) {
      this.jwtToken.next({
        isAuthenticated: true,
        token: token,
      });
    } else {
      this.jwtToken.next({
        isAuthenticated: false,
        token: null,
      });
    }
  }

  public initTimer() {
    return timer(2000, 5000)
      .pipe(
        switchMap(() => {
          if (localStorage.getItem('jwt')) {
            return this.http.get<string>('/api/auth/refresh-token').pipe(
              tap((token: string) => {
                this.jwtToken.next({
                  isAuthenticated: true,
                  token: token,
                });
                localStorage.setItem('jwt', token);
              })
            );
          } else {
            this.subscription.unsubscribe();
            return of(null);
          }
        })
      )
      .subscribe(
        () => {},
        (err) => {
          this.jwtToken.next({
            isAuthenticated: false,
            token: null,
          });
          localStorage.removeItem('jwt');
          this.subscription.unsubscribe();
        }
      );
  }

  signup(user: User): Observable<User> {
    console.log('post request: signup return Observable<User>');
    return this.http.post<User>('/api/auth/signup', user);
  }

  signin(credentials: { email: string; password: string }): Observable<string> {
    console.log(
      'post request: signin return Observable<string> and asign token value'
    );

    return this.http.post<string>('/api/auth/signin', credentials).pipe(
      tap((token: string) => {
        this.jwtToken.next({
          isAuthenticated: true,
          token: token,
        });
        localStorage.setItem('jwt', token);
        this.subscription = this.initTimer();
      })
    );
  }

  logout() {
    this.jwtToken.next({
      isAuthenticated: false,
      token: null,
    });
    localStorage.setItem('jwt', null);
    this.router.navigate(['/signin']);
  }
}
