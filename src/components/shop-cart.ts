/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import { LitElement, html, property } from '@polymer/lit-element';
import { ReduxMixin } from 'pwa-helpers/redux-mixin.js';

// This element is connected to the Redux store.
import { store, RootState } from '../store.js';

// These are the elements needed by this element.
import { removeFromCartIcon } from './my-icons.js';
import './shop-item.js';

// These are the actions needed by this element.
import { removeFromCart } from '../actions/shop.js';

// These are the reducers needed by this element.
import { cartItemsSelector, cartTotalSelector } from '../reducers/shop.js';

// These are the shared styles needed by this element.
import { ButtonSharedStyles } from './button-shared-styles.js';
import { CartItem } from '../reducers/shop.js';

class ShopCart extends LitElement {
  render() {
    const {_items, _total} = this;
    return html`
      ${ButtonSharedStyles}
      <style>
        :host { display: block; }
      </style>
      <p ?hidden="${_items.length !== 0}">Please add some products to cart.</p>
      ${_items.map((item) =>
        html`
          <div>
            <shop-item .name="${item.title}" .amount="${item.amount}" .price="${item.price}"></shop-item>
            <button
                @click="${(e: Event) => store.dispatch(removeFromCart((e.currentTarget as HTMLButtonElement).dataset['index']))}"
                data-index="${item.id}"
                title="Remove from cart">
              ${removeFromCartIcon}
            </button>
          </div>
        `
      )}
      <p ?hidden="${!_items.length}"><b>Total:</b> ${_total}</p>
    `;
  }

  @property({type: Array})
  _items: Array<CartItem> = [];

  @property({type: Number})
  _total = 0;
}

class ConnectedShopCart extends ReduxMixin(store)(ShopCart) {
  mapStateToProps(state: RootState) {
    return {
      _items: cartItemsSelector(state),
      _total: cartTotalSelector(state)
    };
  }
}

window.customElements.define('shop-cart', ConnectedShopCart);
