import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import inventoryData from '../../../../data/inventory.json';
import { Cart, Item } from '../../models';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-menu',
  standalone: false,
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css',
})
export class MenuComponent implements OnInit {
  //declare variable arary to hold the data
  //array consisting of item type
  dataArray: Item[] = [];

  // //for loop
  // index: number = 0;
  // arraySize: number = this.dataArray.length;

  ngOnInit() {
    this.dataArray = this.processData(inventoryData);
    console.log('Initial Shopping Items Loaded');
    // this.cartArray = this.processCart(this.dataArray);
    console.log('Cart Array Instantiated: ', this.cartArray);
  }

  //Process the cart array.
  //this quantity here is used for the object the user added to cart
  // processCart(dataArray: Item[]): Cart[] {
  //   return dataArray.map((item: Item) => {
  //     return {
  //       name: item.name,
  //       quantity: 0, //this will icnrease when user +/- quantity
  //       price: 0, //this will also udpate when user +/- quantity
  //     };
  //   });
  // }

  //process this array, instantiate into object model
  processData(dataArray: any) {
    return dataArray.map((item: any) => {
      return {
        name: item.item,
        quantity: item.quantity,
        price: item.price,
        path: item.file_path,
      };
    });
  }

  //NOW DATA HAS BEEN LOADED
  //ALLOW USER TO CHOOSE THE AMOUNT HTEY WANT TO ADD TO CART
  //function to click +/- button
  //then add it to an array for tracking

  //1. instantiate a new empty array to store the selection cart
  //create a new model that stores the quantity/unitprice/total price
  cartArray: Cart[] = [];
  //add to oninit to mirror the item first
  //so to display the zero value in the add to cart section

  getCartQuantity(name: string) {
    for (let i = 0; i < this.cartArray.length; i++) {
      if ((name == this.cartArray[i].name)) {
        return this.cartArray[i].quantity
      }
    }
    return 0;
  }

  //take the table loaded index number, find matching in cart array updat the quanaity
  //use it both for increase and decrease yaaas duh
  decreaseQuantity(idx: number) {
    if (this.cartArray[idx].quantity > 0) {
      console.log('current quantity: ', this.cartArray[idx].quantity);

      this.cartArray[idx].quantity = this.cartArray[idx].quantity - 1; //assign it back to updat ethe value
      this.cartArray[idx].price =
        this.dataArray[idx].price * this.cartArray[idx].quantity;

      console.log('removed quantity: ', this.cartArray[idx].quantity);
      console.log('Item quantity removed by one successfully');
      this.cartUpdated();
    } else {
      console.log('Item already 0, cannot lower quantity.');
    }
  }

  increaseQuantity(idx: number) {
    if (this.cartArray[idx].quantity < this.dataArray[idx].quantity) {
      console.log('current quantity: ', this.cartArray[idx].quantity);

      this.cartArray[idx].quantity = this.cartArray[idx].quantity + 1; //assignback update valwe
      this.cartArray[idx].price =
        this.dataArray[idx].price * this.cartArray[idx].quantity;

      console.log('added quantity: ', this.cartArray[idx].quantity);
      console.log('Item quantity added by one successfully');
      this.cartUpdated();
    } else {
      console.log('Item has no more stock, cannot add more quantity.');
    }
  }

  //send data out ot the parent compoenent, in this case app-root
  //we need to send the select items and quantity here in the menu
  //appmenu -> app-root (parent) -> app-checkout(child of app-root)

  //I WANT TO OUTPUT THE CARTARRAY SO THAT IT SHOWS UP ON THE CHECKOUT PAGE YAAAS
  @Output() onCartUpdate = new Subject<Cart[]>(); //i want to pass an array object out

  cartUpdated() {
    this.onCartUpdate.next(this.cartArray);
    console.log('Event triggered: Blasting CartArray Out from App-Menu');
  }

  //try number 2
  increaseQuantity2(name: string, quantity: number, price: number) {
    //convert quantity and price back to number
    var unitPrice = price;

    //instantiate the cart object now
    var anItem: Cart = {
      name: name,
      quantity: 1,
      price: price,
    };

    //check if item exists in cart
    if (this.existsInCart(anItem) == true) {
      //check quantity and add
      var maxQ = this.getMaxQuantity(anItem);
      var currentQ = this.getCurrentQuantity(anItem);

      if (currentQ < maxQ) {
        //if current cart lesser than maxquantity available, update quantity.
        this.updateQuantityAdd(anItem, unitPrice);
        // console.log('qty added 1')
      } else {
        //nothing is done, maxed quantity alr
        // console.log('max quantity reached cannot add no more. ');
      }
    } else {
      //Does not exists in cartarray so just add the item to array.
      console.log('New Item to Add: ', anItem)
      this.cartArray.push(anItem);
      console.log('Added New Entry to Cart Array', this.cartArray)
    }

    //push to app-root/app-checkout
    this.cartUpdated();
  }

  decreaseQuantity2(name: string, quantity: number, price: number) {
    var unitPrice = price;

    //instantiate the cart object now
    var anItem: Cart = {
      name: name,
      quantity: 1,
      price: price
    };

    //check if item exists in cart
    if (this.existsInCart(anItem)) {
      //check quantity and add
      var maxQ = this.getMaxQuantity(anItem);
      var currentQ = this.getCurrentQuantity(anItem);

      if (currentQ == 1) {
        //means one qrt, pop from the array entirely
        //just filter and override the array to r
        this.cartArray = this.cartArray.filter((item) => item.name != name);
        console.log('Array when 0', this.cartArray)
      } else if (currentQ <= maxQ && currentQ > 1) {
        //if current cart lesser than maxquantity available, update quantity.
        this.updateQuantityRemove(anItem, unitPrice);
      } else {
        //nothing is done, maxed quantity alr
        // console.log('lowest min quantity reached cannot remove no more. ');
      }
    }

    //push to app-root/app-checkout
    this.cartUpdated();
  }

  //helper function
  existsInCart(anItem: Cart) {
    //do a for loop to check if it exists
    for (let i = 0; i < this.cartArray.length; i++) {
      if ((anItem.name == this.cartArray[i].name)) {
        // console.log('existsInCart returned true.');
        return true;
      }
    }
    // console.log('existsInCart returned false.');
    return false;
  }

  updateQuantityAdd(anItem: Cart, unitPrice: number) {
    console.log('Increasing Quantity for: ',anItem.name);
    for (let i = 0; i < this.cartArray.length; i++) {
      if ((anItem.name == this.cartArray[i].name)) {
        // console.log('trying to add',anItem.name);
        // console.log('before quantity adjust is : ', this.cartArray[i].quantity)
        this.cartArray[i].quantity = this.cartArray[i].quantity + 1;
        this.cartArray[i].price = unitPrice * this.cartArray[i].quantity
        console.log('Updated Cart: ', this.cartArray)
      }
    }
  }

  updateQuantityRemove(anItem: Cart, unitPrice: number) {
    for (let i = 0; i < this.cartArray.length; i++) {
      if ((anItem.name == this.cartArray[i].name)) {
        // console.log('before quantity adjust is : ', this.cartArray[i].quantity)
        this.cartArray[i].quantity = this.cartArray[i].quantity - 1;
        this.cartArray[i].price = unitPrice * this.cartArray[i].quantity
        console.log('Updated Cart: ', this.cartArray)
      }
    }
  }

  getCurrentQuantity(anItem: Cart) {
    for (let i = 0; i < this.cartArray.length; i++) {
      if ((anItem.name == this.cartArray[i].name)) {
        // console.log('current quantity is: ', this.cartArray[i].quantity);
        return this.cartArray[i].quantity;
      }
    }
    console.log(
      'Should not get here, something is wrong. Need to revise the method another time. I am too dumb for this.'
    );
    return 0;
  }

  getMaxQuantity(anItem: Cart) {
    for (let i = 0; i < this.dataArray.length; i++) {
      if ((anItem.name == this.dataArray[i].name)) {
        return this.dataArray[i].quantity;
      }
    }
    console.log(
      'Should not get here, something is wrong. Need to revise the method another time. I am too dumb for this.'
    );
    return 0;
  }
}
