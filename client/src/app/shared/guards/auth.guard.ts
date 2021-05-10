import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { JwtToken } from '../models/jwtToken.model';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    console.log('AuthGuard verification ...');
    return this.authService.jwtToken.pipe(
      map((jwt: JwtToken) => {
        if (jwt.isAuthenticated) {
          return true;
        } else {
          this.router.navigate(['/signin']);
        }
      })
    );
  }
}
