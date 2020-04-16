'use strict';

var adviseComponent = function(HTMLTemplate) {

    return {
        delimiters: ['[[', ']]'],
        data: function() {
            return {
                bySimilarities: true,
                byCharateristics: true,

                animeName: null,
                animeList: [],
                searchList: [],

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
        },
        mounted: function() {},
        template: HTMLTemplate
    };
}