import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ClientService } from '../client.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [FormsModule, NgIf]
})
export class LoginComponent {
  wrong: boolean = false;
  username: string = '';
  password: string = '';
  loading: boolean = false;
  constructor(private router: Router,
    private client: ClientService
  ) {}

  async onLogin() {
    try{
      this.loading = true;
      var response = await this.client.login(this.username, this.password)
      this.loading = false;
      localStorage.setItem("authToken", response.accessToken);
      localStorage.setItem("user", response.user);
      
      this.router.navigate(['/invoices']);
    }
    catch(err){
      this.wrong = true;
      this.loading = false;
      console.log("Could not login", err);
    }
  }
}
