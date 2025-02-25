let eventBus = new Vue();

Vue.component('product-tabs', {
    props: {
        reviews: {
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
            <p v-if="!filteredReviews.length">There are no reviews yet.</p>
            <div>
                <label for="ratingFilter">Filter by rating:</label>
                <select id="ratingFilter" v-model="ratingFilter">
                    <option value="0">All</option>
                    <option value="5">5 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="2">2 Stars</option>
                    <option value="1">1 Star</option>
                </select>
            </div>
            <ul class="review-block">
                <li v-for="review in filteredReviews">
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
        return {
            tabs: ['Reviews', 'Make a Review', 'Shipping', 'Details'],
            selectedTab: 'Reviews',
            ratingFilter: 0
        }
    },
    computed: {
        filteredReviews() {
            if (this.ratingFilter == 0) {
                return this.reviews;
            } else {
                return this.reviews.filter(review => review.rating == this.ratingFilter);
            }
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
        <div class="option-radio">
             <input type="radio" id="yes" name="recommend" value="yes">
             <label for="yes" >Yes</label><br>
             <input type="radio" id="no" name="recommend" value="no">
             <label for="no" >No</label><br>
        </div>
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

            <ul class="sizes">
                <li v-for="size in sizes">{{size}}</li>
            </ul>
           <div class="prod-info">
           <div class="color-box-all">
            <p>Color:</p>
            <div class="color-boxes">
            <div
                    class="color-box"
                    v-for="(variant, index) in variants"
                    :key="variant.variantId"
                    :style="{ backgroundColor:variant.variantColor }"
                    @mouseover="updateProduct(index)">
            </div>
            </div>
            </div>
            
            <div class="stock-block">
                <p v-if="inventory > 10">In Stock</p>
                <p v-else-if="inventory <=10 && inventory > 0">Almost sold out!</p>
                <p v-else :class="{ outOfStock: !inStock}">Out of stock</p>
            </div>
            
            <span> {{sale}}</span></div>
            <a :href="link">More products like this</a>
            
        <div class="cart-buttons">
            <button v-on:click="addToCart" :disabled="!inStock" :class="{disabledButton: !inStock}">Add to cart</button>
            <button v-on:click="removeFromCart">Remove from cart</button>
        </div>
        </div>
  
        <div class="reviews-form">
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

        saveReviews() {
            localStorage.setItem('reviews', JSON.stringify(this.reviews));
        },

        loadReviews() {
            let reviews = localStorage.getItem('reviews');
            if (reviews) {
                this.reviews = JSON.parse(reviews);
            }
        }

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
        this.loadReviews();
        eventBus.$on('review-submitted', productReview => {
            this.reviews.push(productReview);
            this.saveReviews();
        });
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