Vue.component('product', {
    template:`<div class='product'>
    <div class="product-image">
            <img alt="#" v-bind:src="image" :alt="altText"/>
        </div>

        <div class="product-info">
            <h1>{{ title }}</h1>

            <ul>
                <li v-for="detail in details">{{ detail }}</li>
            </ul>

            <ul>
                <li v-for="size in sizes">{{size}}</li>
            </ul>

            <div
                    class="color-box"
                    v-for="(variant, index) in variants"
                    :key="variant.variantId"
                    :style="{ backgroundColor:variant.variantColor }"
                    @mouseover="updateProduct(index)"
            >
            </div>

            <p v-if="inventory > 10">In Stock</p>
            <p v-else-if="inventory <=10 && inventory > 0">Almost sold out!</p>
            <p v-else :class="{ outOfStock: !inStock}">Out of stock</p>

            <span> {{sale}}</span>
        </div>

        <div class="cart">
            <p>Cart({{ cart }})</p>
        </div>

        <button v-on:click="addToCart" :disabled="!inStock" :class="{disabledButton: !inStock}">Add to cart</button>
        <button v-on:click="removeFromCart">Remove from cart</button>
        
        <a :href="link">More products like this</a>
</div>`,
    data(){
        return{
            product: "Socks",
            brand:'Vue Mastery',
            selectedVariant: 0,
            altText: "A pair of socks",
            link: 'https://www.amazon.com/s/ref=nb_sb_noss?url=search-alias%3Daps&field-keywords=socks.',
            inventory: 11,
            onSale:false,
            details:['80% cotton', '20% polyester', 'Gender-neutral'],
            sizes:['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
            variants: [
                {
                    variantId: 2234,
                    variantColor: 'green',
                    variantImage: './assets/vmSocks-green-onWhite.jpg',
                    variantQuantity: 10,
                },
                {
                    variantId: 2235,
                    variantColor: 'blue',
                    variantImage: './assets/vmSocks-blue-onWhite.jpg',
                    variantQuantity: 0,
                }
            ],
            cart: 0
        }
    },
    methods: {
        addToCart() {
            this.cart += 1
        },

        updateProduct(index) {
            this.selectedVariant = index;
            // console.log(index); *проверка индекса*
        },

        removeFromCart() {
            this.cart -= 1;
        }
    },
    computed: {
        title() {
            return this.brand + ' ' + this.product;
        },

        image() {
            return this.variants[this.selectedVariant].variantImage;
        },

        inStock(){
            return this.variants[this.selectedVariant].variantQuantity
        },

        sale() {
            if (this.onSale) {
                return this.brand + ' ' + this.product + ' are on sale!'
            }
            return  this.brand + ' ' + this.product + ' are not on sale'
        }
    }
})

let app = new Vue({
    el: '#app',
})