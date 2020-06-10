'use strict';

let initialWidth = window.innerWidth + 10; // 1289
let initialHeight = window.innerHeight + 10; // 628

let accountLayout = { x: 0.1, y: 0.5 }
let rankingLayout = { x: 0.42, y: 0.64 }
let aboutLayout = { x: 0.66, y: 0.45 }
let advisedLayout = { x: 0.86, y: 0.62 }
let rateLayout = { x: 0.89, y: 0.48 }

var getmainVue = function(rankingHtml, rateAnimesHtml, advisedHtml, accountHTML, loginHtml, aboutHtml, mobile = false) {

    return new Vue({
        el: '#app',
        delimiters: ['[[', ']]'],
        data: {
            loading: false,
            home: true,
            about: false,
            ranking: false,
            account: false,
            rate: false,
            advised: false,
            shop: false,
            selectedMenu: 'home',
            headerCatchPhrase: {
                home: 'Home ... Time for a anime shot',
                about: 'About ... This is what we are all about',
                ranking: 'Ranking ... The place for the bests',
                account: 'Account ... Well, just you own space you know...',
                rate: 'Rate it!... Vox populi',
                advised: 'Advised... That s#@t is just for you bro',
            },


            identify: false,
            identified: false,
            logout: false,
            playing: false,
            playersGenerated: false,
            userid: -1,
            favourites: [],
            framesize: 0,
            windowheight: initialHeight,
            windowwidth: initialWidth,

        },
        watch: {
            rate: function(val) {
                this.framesize = document.getElementById('mainDisplay').clientHeight;
            },
            home: function(val) {
                //this will update the home svg viewbox, positions and discsize
                this.windowheight = window.innerHeight + 10;
                this.windowwidth = window.innerWidth + 10;
            }
        },
        computed: {
            viewbox: function() {
                return "0 0 " + this.windowwidth + " " + this.windowheight;
            },
            positions: function() {
                return {
                    accountx: accountLayout.x * this.windowwidth,
                    accounty: accountLayout.y * this.windowheight,
                    rankingx: rankingLayout.x * this.windowwidth,
                    rankingy: rankingLayout.y * this.windowheight,
                    aboutx: aboutLayout.x * this.windowwidth,
                    abouty: aboutLayout.y * this.windowheight,
                    ratex: rateLayout.x * this.windowwidth,
                    ratey: rateLayout.y * this.windowheight,
                    advisedx: advisedLayout.x * this.windowwidth,
                    advisedy: advisedLayout.y * this.windowheight,

                };
            },
            discsize: function() {
                return 0.058 * this.windowheight;
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
                this.selectedMenu = element;



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
            'about': aboutComponent(aboutHtml),
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