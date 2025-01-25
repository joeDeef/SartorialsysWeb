import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  lastScrollTop = 0;
  header = document.getElementById('header');

  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

    if (currentScroll > this.lastScrollTop && currentScroll > 50) {
      this.header?.classList.add('hidden');
    } else if (currentScroll < this.lastScrollTop || currentScroll <= 50) {
      this.header?.classList.remove('hidden');
    }

    this.lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
  }
}