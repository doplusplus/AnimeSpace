'use strict';

var accountComponent = function(accountHTML) {
    return {
        delimiters: ['[[', ']]'],
        props: ['userid'],
        data: function() {
            return {
                top10: [],
                currentSuggestion: "call advised from top10",

                //Ranking suggestion
                animeName: "",
                genre: "",
                videoLink: "",
                tags: "",

                //Display Settings
                themeColors: ['pink', 'yellow', 'blue', 'gray', 'cream'],
                selectedColor: null,
                extendedVideosAutoplay: "yes",
            };
        },
        computed: {},
        methods: {
            sendSuggestedAnime: function() {},
        },
        mounted: async function() {
            await axios.get('accounts/favorite/' + this.userid)
                .then(async response => {
                    let favoriteList = [];
                    response.data.forEach(element => {
                        favoriteList.push(element["animeName"]);
                    });
                    this.top10 = favoriteList;
                    let suggestions = await recommendationService.recommendedAnimes(null, this.top10);
                    this.currentSuggestion = suggestions[0];
                })
                .catch(error => { console.log(error); });

            axios.get('accounts/settings/' + this.userid)
                .then(response => {
                    this.selectedColor = response.data["themeColor"];
                    this.extendedVideosAutoplay = response.data["autoPlay"] ? "yes" : "no";
                })
                .catch(error => { console.log(error); });
        },
        template: accountHTML,
    };
};