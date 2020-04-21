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
        mounted: function() {
            axios.get('accounts/favorite/' + this.userid)
                .then(response => {
                    let favoriteList = [];
                    response.data.forEach(element => {
                        favoriteList.push(element["animeName"]);
                    });
                    this.top10 = favoriteList;
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