import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { switchMap } from 'rxjs/operators';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  /* On stock notre utilisateur dans currentUser qui est un BehaviorSubject 
   afin de pouvoir toujours accéder à la dernière valeur.*/
  public currentUser: BehaviorSubject<User> = new BehaviorSubject(null);
  constructor(private http: HttpClient) {}

  public getCurrentUser(): Observable<User> {
    if (this.currentUser.value) {
      return this.currentUser; //on retourne le BehaviourSubject et non pas sa valeur actuelle pour que nous puissions y subscribe
    } else {
      return this.http.get<User>('/api/user/current').pipe(
        // dans tap, on passe la valeur reçue de notre serveur à notre BehaviorSubject
        tap((user: User) => {
          this.currentUser.next(user);
        }),
        /*Enfin, nous retournons le BehaviorSubject, et non pas la valeur retournée par la requête, grâce
         à switchMap qui permet de retourner un nouvel Observable.*/
        switchMap(() => {
          return this.currentUser;
        })
      );
    }
  }
}
