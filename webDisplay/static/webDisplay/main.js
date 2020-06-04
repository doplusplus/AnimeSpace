'use strict';






var getmainVue = function(rankingHtml, rateAnimesHtml, advisedHtml, accountHTML, loginHtml, mobile = false) {

    return new Vue({
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
            playing: false,
            playersGenerated: false,
            userid: -1,
            favourites: [],
            framesize: 0,
        },
        watch: {
            rate: async function(val) {
                this.framesize = document.getElementById('mainDisplay').clientHeight;
            },
        },
        methods: {
            logIn: function() {
                if (this.identified) {
                    this.logout = true;
                } else {
                    this.identify = !this.identify;
                }
            },
            authenticated: function(goOn, userID) {
                this.identified = goOn;
                this.identify = false;
                if (this.identified) {
                    this.display('account');
                    this.userid = userID;
                }
            },
            logOut: function() {
                if (this.account) { this.display('home'); }
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

                // players generated on first ranking display
                if (!this.playersGenerated && this.ranking) {
                    videoService.generatePlayers(videoService.videoIds.length);
                    this.playersGenerated = true;
                }

                if (this.playersGenerated) {
                    this.playing = videoService.playing();
                }
            },
            ResumeVideo: function() {
                videoService.ResumeVideo();
            },
            PauseVideo: function() {
                videoService.PauseVideo();
            },
            RemovePlayer: function() {
                videoService.PauseVideo(true);
                this.playing = false;
            },
        },
        components: {
            'ranking-display': rankingComponent(rankingHtml),
            'anime-rating': rateAnimesComponent(rateAnimesHtml),
            'advised': adviseComponent(advisedHtml),
            'account': accountComponent(accountHTML),
            'login': loginComponent(loginHtml),
        },
        mounted: function() {
            this.$root.$on('favouritesChanged', data => {
                this.favourites = data;
            });
        }
    });
}


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