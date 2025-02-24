let eventBus = new Vue();


Vue.component('product-tabs', {
    props: {
        reviews:{
            type: Array,
            required: false
        },
        shipping: {
            type: String,
            required: true
        },
        details: {
            type: Array,
            required: true
        }
    },
    template: `
    <div>
        <ul>
            <span class="tab" :class="{ activeTab: selectedTab === tab }" v-for="(tab, index) in tabs" @click="selectedTab = tab">{{ tab }}</span>
        </ul>
        <div v-show="selectedTab === 'Reviews'">
            <p v-if="!reviews.length">There are no reviews yet.</p>
                <ul>
                    <li v-for="review in reviews">
                        <p>{{ review.name }}</p>
                        <p>Rating: {{ review.rating }}</p>
                        <p>{{ review.review }}</p>
                    </li>
                </ul>
        </div>
        <div v-show="selectedTab === 'Make a Review'">
            <product-review></product-review>
        </div>
        <div v-show="selectedTab === 'Shipping'">
             <p>Shipping: {{ shipping }} Free</p>
        </div>
        <div v-show="selectedTab === 'Details'">
                    <ul>
                <product-details></product-details>
            </ul>
      </div>
    </div>
`,
    data() {
        return {tabs: ['Reviews', 'Make a Review', 'Shipping', 'Details'],
            selectedTab: 'Reviews'
        }
    }
})


            Vue.component('product-review', {
    template:`
    <form class="review-form" @submit.prevent="onSubmit">
        <p v-if="errors.length">
            <b>Please correct the following error(s):</b>
            <ul>
                <li v-for="error in errors">{{ error }}</li>
            </ul>
        </p>
        <p>
            <label for="name">Name:</label>
            <input id="name" v-model="name" placeholder="name">
        </p>
        <p>
            <label for="review">Review:</label>
            <textarea id="review" v-model="review"></textarea>
        </p>
        <p>
            <label for="rating">Rating:</label>
            <select id="rating" v-model.number="rating">
                <option>5</option>
                <option>4</option>
                <option>3</option>
                <option>2</option>
                <option>1</option>
            </select>
        </p>
        <label for="recommend" >Would you recommend this product?</label><br>
             <input type="radio" id="yes" name="recommend" value="yes">
             <label for="yes" >Yes</label><br>
             <input type="radio" id="no" name="recommend" value="no">
             <label for="no" >No</label><br>
        <p>
        <input type="submit" value="Submit">
        </p>
    </form>
    `,
    data(){
        return {
            name: null,
            review: null,
            rating: null,
            errors:[]
        }
    },

    methods: {
        onSubmit(){
            if(this.name && this.review && this.rating){
            let productReview = {
                name: this.name,
                review: this.review,
                rating: this.rating,
                recommend: this.recommend
            }
            eventBus.$emit('review-submitted', productReview)
            this.name = null
            this.review = null
            this.rating = null
                this.recommend = null
            } else{
                if(!this.name) this.errors.push("Name required.")
                if(!this.review) this.errors.push("Review required.")
                if(!this.rating) this.errors.push("Rating required.")
            }
        }
    }
}),

Vue.component('product', {
    template:`<div class='product'>
    <div class="product-image">
            <img alt="#" v-bind:src="image" :alt="altText"/>
        </div>

        <div class="product-info">
            <h1>{{ title }}</h1>
    
            <product-details></product-details>

            <ul>
                <li v-for="size in sizes">{{size}}</li>
            </ul>
            
            <p>Shipping: {{ shipping }}</p>

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

        <button v-on:click="addToCart" :disabled="!inStock" :class="{disabledButton: !inStock}">Add to cart</button>
        <button v-on:click="removeFromCart">Remove from cart</button>
        
        <a :href="link">More products like this</a>
        
        <div>
                <product-tabs :reviews="reviews"></product-tabs>
            
    </div>
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
            sizes:['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
            reviews:[],
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
            this.$emit('add-to-cart',
                this.variants[this.selectedVariant].variantId);
        },

        updateProduct(index) {
            this.selectedVariant = index;
            // console.log(index); *проверка индекса*
        },

        removeFromCart() {
            this.$emit('delete-to-cart',
                this.variants[this.selectedVariant].variantId);
        },

    },
    props:{
        premium: {
            type: Boolean,
            required: true,
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
        },

        shipping(){
            if (this.premium) {
                return "Free";
            } else{
                return 2.99;
            }
        },

    },
    mounted() {
        eventBus.$on('review-submitted', productReview => {
            this.reviews.push(productReview)})
    }
}),

Vue.component('product-details', {
    template:`
    <ul>
       <li v-for="detail in details">{{ detail }}</li>
    </ul>
    `,
    data() {
        return{
            details:['80% cotton', '20% polyester', 'Gender-neutral']
        };
    }
})

let app = new Vue({
    el: '#app',
    data: {
        premium: true,
        cart: []
    },
    methods: {
        updateCart(id) {
            this.cart.push(id);
        },

        deleteCart() {
            if (this.cart.length <= 0) {
                return this.cart.length;
            } else
                this.cart.splice(this.cart.length -1,1);
        }
    }
})