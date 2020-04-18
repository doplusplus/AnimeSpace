'use strict';

var adviseComponent = function(HTMLTemplate) {

    return {
        delimiters: ['[[', ']]'],
        data: function() {
            return {
                bySimilarities: true,
                animeName: null,
                searchList: [],
                animeList: [],

                byCharateristics: true,
                genre: null,
                genreList: [],
                characteristics: defaultCharacteristics,
                tagEntry: "",

                results: null,
            }
        },
        watch: {
            //TODO : regroup with the similar function in rate anime and place it in rankings.js
            animeName: function(value) {
                this.searchList = [];
                var isalphaNum = universalCharRegex.test(value);

                if (isalphaNum) {
                    axios.get('ranking/search/' + value)
                        .then(response => {
                            // when selecting an anime, a search is automically launched because the name changed
                            if (response.data.length == 1 && response.data[0].name == this.animeName) {
                                return;
                            }
                            response.data.forEach(obj => { this.searchList.push(obj.name); });
                        })
                        .catch(error => { console.log(error); });
                }
            },
        },
        computed: {
            filteringMethodTicked: function() {
                return this.bySimilarities || this.byCharateristics;
            },
            animeListEmpty: function() {
                return this.animeList.length == 0;
            },
            searchEnabled: function() {
                //to figure out later on
            },
            searchButtonTitle: function() {
                return this.filteringMethodTicked ? "Search for animes" : "Can't search because no filtering method selected"
            },
        },
        methods: {
            addAnime: function(name) {
                this.animeList.push(name);
            },
            clearAll: function() {
                this.animeList = [];
            },
            searchAdvice: function() {
                let similarAnimesData = this.bySimilarities ? this.animeList : null;
                let characteristicsFilter = this.byCharateristics ? { genre: this.genre, characteristics: this.characteristics, tagEntry: this.tagEntry } : null;
                let tosend = {
                    similarAnimes: similarAnimesData,
                    characteristics: characteristicsFilter
                };

                axios({
                        method: 'post',
                        url: 'rating/advised',
                        data: tosend,
                    })
                    .then(response => {
                        this.results = response.data;
                    })
                    .catch(function(error) {
                        console.log(error);
                    });
            },
            gotoRanking: function(name) {
                alert("going to ranking");
            },
        },
        mounted: function() {
            axios.get('rating/genres')
                .then(response => {
                    this.genreList = response.data;
                })
                .catch(function(error) {
                    console.log(error);
                });
        },
        template: HTMLTemplate
    };
}