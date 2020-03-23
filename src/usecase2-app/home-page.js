import { html, PolymerElement } from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/iron-form/iron-form.js';
import '@polymer/paper-card/paper-card.js';
import '@polymer/polymer/lib/elements/dom-repeat.js';
import '@polymer/iron-ajax/iron-ajax.js';

/**
* @customElement
* @polymer
*/
class HomePage extends PolymerElement {
    static get template() {
        return html`
<style>
    main {
        border-radius: 8px;
        align-self: center;
    }

    iron-form{
        padding:20px;
    }
    h1 {
        justify-self: center;
        color: white;
    }

    header {
        display: grid;
        grid-template-columns: 250px 1fr 1fr 200px 100px;
        grid-template-rows: 100px;
        height: 100px;
        width: 100%;
        background-color: #000000;
    }
    #logoutBtn{
        margin-left:20%;
        margin-top:30%;
    }
    #logout {

        grid-row: 1/2;
        grid-column: 5/6;
    }

    #userName {
        grid-row: 1/2;
        grid-column: 4/5;
        color:white;
        margin-top:10%;
    }

    #heading {
        margin: 10px;
        font-size: 1.4em;
        grid-row: 1/2;
        grid-column: 1/2;
    }
    paper-card{
        background-color: rgb(216, 211, 211);

        margin-top:2%;
        width:100%;
    }
    iron-icon {
        color: red;
    }
</style>
<header>
    <div id="heading">
        <h1>ShopHere<iron-icon icon="shopping-cart"></iron-icon>
        </h1>
    </div>
    <div id="userName">
        <h2>Welcome, {{user.customerName}}</h2>
    </div>
    <div id="logout">
        <paper-button id="logoutBtn" on-click="_handleLogout">
            <iron-icon icon="power-settings-new"></iron-icon>
        </paper-button>
    </div>
</header>

    <main>
    <template is="dom-repeat" items="{{products}}">
    <paper-card>
    <h3>Product Name: {{item.productName}}</h3>
    <h3>Product Description: {{item.description}}</h3>
    <h3>Product Price: {{item.price}}</h3>
  </paper-card>
  </template>
    </main>

<iron-ajax id="ajax" on-response="_handleResponse" on-error="_handleError" content-type="application/json"
    handle-as="json"></iron-ajax>

`;
    }
    static get properties() {
        return {
            prop1: {
                type: String,
                value: 'login-page'
            },
            products:{
                type:Array,
                value:[]
            }
        };
    }
   connectedCallback(){
       super.connectedCallback();
       this.user = JSON.parse(sessionStorage.getItem('userDetails'));
       this._makeAjaxCall(`http://localhost:3000/products?priority=${this.user.customerType}`,`get`,null)
   }

   /**
    * Logout is performed here
    */
    _handleLogout() {
        sessionStorage.clear();
        window.history.pushState({}, null, '#/login');
        window.dispatchEvent(new CustomEvent('location-changed'));
        window.location.reload();

    }
    
    /**
     * @param {*} event
     * response from the backend is handled here 
     */
    _handleResponse(event) {
        this.products = event.detail.response;
    }

     /**
    * function to make ajax calls
    * @param {String} url 
    * @param {String} method 
    * @param {Object} postObj 
    */
    _makeAjaxCall(url, method, postObj, action) {
    const ajax = this.$.ajax;
    ajax.method = method;
    ajax.url = url;
    ajax.body = postObj ? JSON.stringify(postObj) : undefined;
    ajax.generateRequest();
    }
}

window.customElements.define('home-page', HomePage);