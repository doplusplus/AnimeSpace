'use strict';

//values used in component but not in the html
const animePerPage = 3;
const messageTiming = 1000; //ms
var rankingCutHeight = null;
var rankingContentDiv = null;
var lastPage = 1;

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
                scrollPosition: 100, //up at 100 , down at 0
                sliderMoved: false,
                displayedPage: 1,
                firstDisplayed: 0,
                lastDisplayed: 0,
                totalAnimes: 0,
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
                    this.sliderMoved = true;
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
            onScroll: function(pos) {
                if (this.sliderMoved) { this.sliderMoved = false; return; }
                rankingCutHeight = rankingContentDiv.scrollHeight - rankingContentDiv.clientHeight;
                let scrollY = pos.target.scrollTop;
                this.scrollPosition = 100.0 * (1 - scrollY / rankingCutHeight);
            },
            goUp: function() {
                this.scrollPosition = 100;
            },
            goDown: function() {
                this.scrollPosition = 0;

            },
            loadAnimePage: function(page, NbOfAnimesPerPage, refreshPlayers = false) {
                this.firstDisplayed = 1 + (page - 1) * NbOfAnimesPerPage;
                this.lastDisplayed = this.firstDisplayed + NbOfAnimesPerPage - 1;
                axios.get("ranking/details/" + this.firstDisplayed + "/" + this.lastDisplayed)
                    .then(response => {
                        var otherself = this;
                        videoService.fillVideoIds(videoService.videoIds, response.data);
                        if (refreshPlayers) {
                            videoService.UpdateVideos();
                        }
                        this.loadDetails(response.data);
                    });
            },
            loadDetails: function(data) {
                //Adding empty cells to avoid video iframes destruction in the last page
                data.forEach(element => element.fake = false);
                while (data.length < animePerPage) {
                    data.push({
                        darkVideoBackground: false,
                        description: '',
                        genre: '',
                        name: '',
                        popularity: '',
                        fake: true,
                    });
                }

                this.animeDetails = data;
                this.totalAnimes = 10;
                this.animeList = extractNames(this.animeDetails);

                let fullpages = this.totalAnimes / animePerPage;
                let lastpageContentNb = this.totalAnimes % animePerPage
                lastPage = lastpageContentNb == 0 ? fullpages : fullpages + 1;
            },
            nextPage: function() {
                //Last page reached
                if (lastPage - this.displayedPage < 1) { return; }
                this.displayedPage++;
                this.loadAnimePage(this.displayedPage, animePerPage, true);
            },
            previousPage: function() {
                if (this.displayedPage <= 1) { return; }
                this.displayedPage--;
                this.loadAnimePage(this.displayedPage, animePerPage, true);
            },
        },
        mounted: function() {
            videoService.loadYoutubeAPI('mainDisplay'); //Loads youtube <script> just before mainDisplay
            this.loadAnimePage(this.displayedPage, animePerPage);
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