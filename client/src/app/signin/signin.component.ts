import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css'],
})
export class SigninComponent implements OnInit {
  public signinForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.signinForm = this.fb.group({
      username: [''],
      password: [''],
    });
  }

  public trySignin(): void {
    console.log('subscribe to signin(authService)');

    this.authService.signin(this.signinForm.value).subscribe(() => {
      this.router.navigate(['/']);
    });
  }
}
