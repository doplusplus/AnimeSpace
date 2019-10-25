'use strict';

const animePerPage = 4;
var rankingHtml;
axios.get("rankingTemplate").then(response => {
    rankingHtml = response.data
    rankingComponent.template = rankingHtml;
});

var rankingComponent = {
    delimiters: ['[[', ']]'],
    data: function() {
        return {
            animeList: [],
            currentSelection: 0,
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
        }

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