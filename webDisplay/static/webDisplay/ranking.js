'use strict';

const animePerPage = 7;
const messageTiming = 1000; //ms
var rankingCutHeight = null;
var rankingContentDiv = null;

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
                scrollPosition: 100,
            }
        },
        computed: {
            lightTextRequired: function() {
                return this.animeDetails[this.currentSelection].darkVideoBackground;
            },
        },
        watch: {
            scrollPosition: function(newPosition, oldposition) {
                if (rankingContentDiv) {
                    if (!rankingCutHeight) { rankingCutHeight = rankingContentDiv.scrollHeight - rankingContentDiv.clientHeight; }
                    let rate = rankingCutHeight * (100 - newPosition) / 100;
                    rankingContentDiv.scrollTo(0, rate);
                }
            },
        },
        methods: {
            toggleAnime: function(index) {
                this.currentSelection = this.currentSelection == index ? -1 : index;
                this.toPlay = this.animeDetails[this.currentSelection].videoLink + '?autoplay=0&amp;controls=0&amp;rel=0';
            },
            expand: function(index) {
                this.currentSelection = index;
                this.extended = true;

                //aligns top of the video to top of the screen
                var bannerheight = document.getElementById("heroBanner").scrollHeight;
                window.scrollTo(0, bannerheight);

                //launches video on wide display
                videoService.play(index);

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
            videoService.loadYoutubeAPI('mainDisplay'); //Loads youtube <script> just before mainDisplay
            axios.get("ranking/details/1/" + animePerPage)
                .then(response => {
                    var otherself = this;
                    this.animeDetails = response.data;
                    this.animeList = extractNames(this.animeDetails);
                    this.toPlay = this.animeDetails[this.currentSelection].videoLink + '?autoplay=0&amp;controls=0';
                    videoService.fillVideoIds(videoService.videoIds, this.animeDetails);
                });
            rankingContentDiv = document.getElementById("rankingContent");
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