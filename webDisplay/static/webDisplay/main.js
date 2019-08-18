var app = new Vue({
    el: '#app',
    delimiters: ['[[', ']]'],
    data: {
        home: true,
        about: false,
        ranking: false,
        account: false,
        rate: false,
        advised: false,
        shop: false,
    },
    methods: {

        display: function(element) {
            this.home = element == 'home';
            this.about = element == 'about';
            this.ranking = element == 'ranking';
            this.account = element == 'account';
            this.rate = element == 'rate';
            this.advised = element == 'advised';
            this.shop = element == 'shop';
        }



    },
})