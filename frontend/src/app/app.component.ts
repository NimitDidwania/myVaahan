import { Component } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HttpClientModule, HeaderComponent, FooterComponent, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'bill-manager';
  loginPage = true;
  constructor(private router: Router) {
    
  }
  ngOnInit(){
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Check if the current URL is /login
        this.loginPage = (event.url == '/login' || event.url == '/');
      }
      console.log(this.loginPage)
    });
  }

}
