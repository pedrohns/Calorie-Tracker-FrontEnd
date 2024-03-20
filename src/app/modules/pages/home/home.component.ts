import { Component, OnInit, inject } from '@angular/core';
import { HeaderComponent } from '@components/home/header/header.component';
import { ApiService } from '@services/api.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  #api = inject(ApiService);
  isLoggedIn: boolean = false;

  ngOnInit(): void {
    this.isLoggedIn = this.#api.isLoggedIn();
  }
}
