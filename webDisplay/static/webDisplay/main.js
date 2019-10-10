'use strict';

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
        identify: false,
        identified: false,
        logout: false,
    },
    methods: {
        logIn: function() {
            if (this.identified) {
                this.logout = true;
            } else {
                this.identify = !this.identify;
            }
        },
        authenticate: function() {
            this.identified = true;
            this.display('account');
        },
        logOut: function() {
            this.display('home');
            this.logout = false;
            this.identify = false;
            this.identified = false;
        },

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
    components: {
        'ranking-display': rankingComponent
    }
});


var footer = new Vue({
    el: '#footer',
    delimiters: ['[[', ']]'],
    data: {
        showModal: false,
        contact: false,
        donate: false,
        feedback: false,
        otherrankings: false,
        wheretoread: false,
        wheretowatch: false,
    },
    methods: {
        display: function(element) {
            this.contact = element == 'contact';
            this.donate = element == 'donate';
            this.feedback = element == 'feedback';
            this.otherrankings = element == 'otherrankings';
            this.wheretoread = element == 'wheretoread';
            this.wheretowatch = element == 'wheretowatch';

            this.showModal = true;
        }
    },
});