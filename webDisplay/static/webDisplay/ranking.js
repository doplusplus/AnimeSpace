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
        }
    },
    computed: {
        lightTextRequired: function() {
            return this.animeDetails[this.currentSelection].darkVideoBackground;
        }
    },
    methods: {
        selectAnime: function(index) {
            this.currentSelection = index;
            this.toPlay = this.animeDetails[this.currentSelection].videoLink + '?autoplay=1';
        },
        updateAnimeList: function(start, size) {

        }
    },
    mounted: function() {
        /*  axios.get("ranking")
              .then(response => {
                  this.animeList = response.data
              });*/

        axios.get("ranking/details")
            .then(response => {
                var otherself = this;
                this.animeDetails = response.data;
                this.animeList = extractNames(this.animeDetails);
                this.toPlay = this.animeDetails[this.currentSelection].videoLink + '?autoplay=1';
            });
    },
    template: 'THE RANKING'
}




var extractNames = function(list) {
    return list.map(element => element.name);
}