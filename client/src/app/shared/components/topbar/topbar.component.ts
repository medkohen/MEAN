import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { JwtToken } from '../../models/jwtToken.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.css'],
})
export class TopbarComponent implements OnInit, OnDestroy {
  public jwtToken: JwtToken;
  public subscription: Subscription;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    console.log('Init TopBar : Subscription au jwtToken : Behaviour Sub');
    this.subscription = this.authService.jwtToken.subscribe((jwt: JwtToken) => {
      this.jwtToken = jwt;
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }

  public logout(): void {
    this.authService.logout();
  }
}
