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
                message: '',

                byCharateristics: false,
                genre: 'Genre',
                genreList: [],
                characteristics: defaultCharacteristics,
                tagEntry: "",
                selectedCharIndex: -1,

                results: null,

                //mobile only
                selected: '',
                selectedCharact: null,
                resultScreen: false,
            }
        },
        watch: {
            //TODO : regroup with the similar function in rate anime and place it in rankings.js
            animeName: function(value) {
                this.message = '';
                this.searchList = [];
                let animeName = value.trim();
                var isalphaNum = universalCharRegex.test(animeName);

                if (isalphaNum) {
                    axios.get('ranking/search/' + animeName)
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
            animeList: function() {
                this.message = '';
            }
        },
        computed: {
            filteringMethodTicked: function() {
                return this.bySimilarities || this.byCharateristics;
            },
            animeListEmpty: function() {
                return this.animeList.length == 0;
            },
            recommendationListEmpty: function() {
                return !this.results || this.results.length == 0;
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
                this.animeName = '';
                this.animeList = [];
            },
            clearAllScreen: function() {
                this.clearAll();
                this.characteristics = defaultCharacteristics;
                this.genre = 'Genre';
                this.tagEntry = "";
                this.selectedCharIndex = -1;
                this.results = null;
            },
            searchAdvice: async function() {

                if (this.bySimilarities && this.animeList.length == 0) {
                    this.message = "There is no anime in the searchlist to compare to. <br> Press on the + icon after writting an anime's name if you want to add it to the list."
                }

                let similarAnimesData = this.bySimilarities ? this.animeList : null;
                let characteristicsToSend = {
                    "visuals": this.characteristics[0]["value"],
                    "audio": this.characteristics[1]["value"],
                    "sexyM": this.characteristics[2]["value"],
                    "sexyF": this.characteristics[3]["value"],
                    "violence": this.characteristics[4]["value"],
                    "story": this.characteristics[5]["value"],
                    "characterDesign": this.characteristics[6]["value"],
                    "fightChoreography": this.characteristics[7]["value"],
                }
                let characteristicsFilter = this.byCharateristics ? { genre: this.genre, characteristics: characteristicsToSend, tagEntry: this.tagEntry } : null;
                this.results = await recommendationService.recommendedAnimes(characteristicsFilter, similarAnimesData);
                this.resultScreen = true;
            },
            selectCharIndex: function(index) {
                this.selectedCharIndex = index != this.selectedCharIndex ? index : -1;
            },
            gotoRanking: function(name) {
                alert("going to ranking");
            },
            setCharact: function(index) {
                this.selectedCharact = this.characteristics[index];
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


var recommendationService = {
    recommendedAnimes: async function(characteristics, similarAnimes) {
        var results = "";
        let tosend = {
            similarAnimes: similarAnimes,
            characteristics: characteristics
        };

        await axios({
                method: 'post',
                url: 'rating/advised',
                data: tosend,
            })
            .then(response => {
                results = response.data;
            })
            .catch(function(error) {
                console.log(error);
            });

        return results;

    }

};