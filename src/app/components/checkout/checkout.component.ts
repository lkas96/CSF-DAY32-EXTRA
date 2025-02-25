import { Component, Input } from '@angular/core';
import { Cart } from '../../models';

@Component({
  selector: 'app-checkout',
  standalone: false,
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css',
})
export class CheckoutComponent {
  @Input() cartArray: Cart[] = []; //declare and initiatilise the empty array for input
item: any;

  ngOnChanges() {
    console.log('Received Cart Data From App-Root', this.cartArray);
  }

  //calculate grand total from the array thingy,loop through the array and find all the amount
  getGrandTotal() {

    var sum = 0;

    for(let i = 0; i < this.cartArray.length; i++){
      sum = sum + this.cartArray[i].price
    }

    return sum;
  }
}
