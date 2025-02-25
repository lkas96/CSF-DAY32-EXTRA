import { Component, OnInit } from '@angular/core';
import { Cart } from './models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent{

  title = 'DAY32 - Extra Practice : Simple Shopping Cart';

  receivedCart: Cart[] = []

  receviedCartFromAppMenu($event: Cart[]) {
    //reveited the cartarray, now print to check
    //if okay, send it over to the app-checkout child
    //using input???? hmm sdhould be, attribute binding whatever

    this.receivedCart = $event
    
    console.log('Received Cart From App-Menu : ', this.receivedCart)
  }

}
