let app = new Vue({
    el: '#app',
    data: {
        product: "Socks",
        image: "./assets/vmSocks-blue-onWhite.jpg",
        altText: "A pair of socks",
        link: 'https://www.amazon.com/s/ref=nb_sb_noss?url=search-alias%3Daps&field-keywords=socks.',
        inStock: true,
        inventory: 8,
        onSale:true,
        details:['80% cotton', '20% polyester', 'Gender-neutral'],
        sizes:['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
        variants: [
            {
                variantId: 2234,
                variantColor: 'green'
            },
            {
                variantId: 2235,
                variantColor: 'blue'
            }
        ]
}
})
