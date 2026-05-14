import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './shared/components/footer/footer';
import { NavbarComponent } from './shared/components/navbar/navbar';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet,FooterComponent , NavbarComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {}
