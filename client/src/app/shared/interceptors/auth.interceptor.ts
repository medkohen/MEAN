import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';

export class AuthInterceptor implements HttpInterceptor {
  /**
    Un intercepteur, comme son nom l’indique, sert à intercepter les requêtes HTTP 
    avant que celles-ci ne soient envoyées.

    L'objectif est que toutes les requêtes envoyées par l’utilisateur contiennent le token JWT si il est présent
    afin d’authentifier la requête et d’identifier l’utilisateur.

    La méthode intercept va intercepter une requête HTTP HttpRequest.

    si il y a un token, nous allons cloner la requête actuelle req.clone en lui ajoutant 
    un headers authorization contenant notre token

    Dans le second cas nous ne faisons rien return next.handle(req) et retournons la requête initiale.
    
    Ensuite il nous faut provide l’interceptor au niveau de notre module app.module.ts
     */
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('jwt');

    if (token) {
      const authReq = req.clone({
        headers: req.headers.set('authorization', token),
      });
      return next.handle(authReq);
    } else {
      return next.handle(req);
    }
  }
}
