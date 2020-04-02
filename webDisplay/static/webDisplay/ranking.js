'use strict';

const animePerPage = 6;
const messageTiming = 1000; //ms








var rankingComponent = function(HTMLTemplate) {
    return {
        delimiters: ['[[', ']]'],
        data: function() {
            return {
                animeList: [],
                currentSelection: 0,
                hoveredItem: -1,
                animeDetails: [],
                extended: false,
                compactDetails: false,
                unfold: true,
                buttonHovered: false,
                navMenuHovered: false,
            }
        },
        computed: {
            lightTextRequired: function() {
                return this.animeDetails[this.currentSelection].darkVideoBackground;
            },
        },
        methods: {
            toggleAnime: function(index) {
                this.currentSelection = this.currentSelection == index ? -1 : index;
                this.toPlay = this.animeDetails[this.currentSelection].videoLink + '?autoplay=0&amp;controls=0&amp;rel=0';
            },
            updateAnimeList: function(start, size) {

            },
            expand: function(index) {
                this.currentSelection = index;
                this.extended = true;
            },
            selected: function(index) {
                return this.currentSelection == index;
            },
            hovered: async function(index) {
                this.hoveredItem = index;
                await sleep(messageTiming);
                if (this.hoveredItem == index) {
                    this.hoveredItem = -1;
                };
            },
            compactNav: async function(element) {
                switch (element) {
                    case 'buttonHovered':
                        this.buttonHovered = true;
                        break;
                    case 'menuHovered':
                        this.navMenuHovered = true;
                        break;
                    case 'buttonLeft':
                        await sleep(messageTiming);
                        this.buttonHovered = false;
                        break;
                    case 'menuLeft':
                        await sleep(messageTiming);
                        this.navMenuHovered = false;
                        break;
                }
            },
            switchTo: function(element) {
                let target = '';
                switch (element) {
                    case 'Account':
                        target = 'account';
                        break;
                    case 'About':
                        target = 'about';
                        break;
                    case 'RateIt':
                        target = 'rate';
                        break;
                    case 'Advised':
                        target = 'advised';
                        break;
                }
                this.$parent.display(target);
            },

        },
        mounted: function() {
            loadYoutubeAPI('mainDisplay'); //Loads youtube <script> just before mainDisplay
            axios.get("ranking/details/1/" + animePerPage)
                .then(response => {
                    var otherself = this;
                    this.animeDetails = response.data;
                    this.animeList = extractNames(this.animeDetails);
                    this.toPlay = this.animeDetails[this.currentSelection].videoLink + '?autoplay=0&amp;controls=0';
                    fillVideoIds(videoIds, this.animeDetails);
                    displayVideos(videoIds.length);
                });
        },
        template: HTMLTemplate
    };
}


var extractNames = function(list) {
    return list.map(element => element.name);
};


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
};