import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
 
  constructor(private router: Router) {
  }
  navigateToBookAppointment(){
    this.router.navigate(['/bookappointment']).then(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  navigateToHome()
  {
    this.router.navigate(['/home']).then(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  navigateToAI(){
    this.router.navigate(['/assistant']).then(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }


  navigateToAboutUs()
  {
    this.router.navigate(['/about-us']).then(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  navigateToAccount(){
    this.router.navigate(['/account']).then(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
  navigateToTemplates(){
    this.router.navigate(['/templates']).then(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  navigateToDocumentation(){
    this.router.navigate(['/doc']).then(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

}
