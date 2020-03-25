'use strict';

const animePerPage = 6;
const messageTiming = 1000; //ms

var rankingHtml;
if (axios != undefined) {

    axios.get("rankingTemplate").then(response => {
        rankingHtml = response.data;
        rankingComponent.template = rankingHtml;
    });
} else {
    alert('Issue with fetching data (Axios is undefined)');
}


var players = [];
var videoIds = [];

function loadYoutubeAPI(divName) {
    var tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementById(divName);
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
};

function onYouTubeIframeAPIReady() {
    displayVideos(animePerPage);
};

function displayVideos(animesNumber) {
    for (let indx = 0; indx < animesNumber; indx++) {
        players[indx] = new YT.Player('player' + indx, {
            height: '500',
            width: '2000',
            enablejsapi: 1,
            origin: 'http://localhost:8000',
            host: 'https://www.youtube-nocookie.com',
            videoId: videoIds[indx],
            events: {
                'onStateChange': onPlayerStateChange
            }
        });
    }
};

function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.PLAYING) {
        let playerId = event.target.l.id;
        for (let indx = 0; indx < animePerPage; indx++) {
            if (players[indx].l.id != playerId) {
                players[indx].pauseVideo();
            }
        }
    }
};


var rankingComponent = {
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
        loadYoutubeAPI('ranking'); //Loads youtube <script> just before <ranking>

        axios.get("ranking/details/1/" + animePerPage)
            .then(response => {
                var otherself = this;
                this.animeDetails = response.data;
                this.animeList = extractNames(this.animeDetails);
                this.toPlay = this.animeDetails[this.currentSelection].videoLink + '?autoplay=0&amp;controls=0';
                fillVideoIds(videoIds, this.animeDetails);
            });
    },
    template: 'THE RANKING'
};

var fillVideoIds = function(emptyList, responseData) {
    for (let indx = 0; indx < animePerPage; indx++) {
        emptyList[indx] = responseData[indx].videoId;
    }
};
var extractNames = function(list) {
    return list.map(element => element.name);
};


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
};