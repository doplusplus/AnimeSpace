'use strict';

const animePerPage = 4;
const messageTiming = 1000 //ms
var rankingHtml;
if (axios != undefined) {

    axios.get("rankingTemplate").then(response => {
        rankingHtml = response.data
        rankingComponent.template = rankingHtml;
    });
} else {
    alert('Issue with fetching data (Axios is undefined)');
}

var rankingComponent = {
    delimiters: ['[[', ']]'],
    data: function() {
        return {
            animeList: [],
            currentSelection: 0,
            hoveredItem: -1,
            animeDetails: [],
            toPlay: "",
            extended: false,
            unfold: true,
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
            this.toPlay = this.animeDetails[this.currentSelection].videoLink + '?autoplay=0&amp;controls=0&amp;rel=0';
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
    },
    mounted: function() {
        axios.get("ranking/details")
            .then(response => {
                var otherself = this;
                this.animeDetails = response.data;
                this.animeList = extractNames(this.animeDetails);
                this.toPlay = this.animeDetails[this.currentSelection].videoLink + '?autoplay=0&amp;controls=0';
            });
    },
    template: 'THE RANKING'
}


var extractNames = function(list) {
    return list.map(element => element.name);
}


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}