'use strict';

var accountComponent = {
    delimiters: ['[[', ']]'],
    data: function() {
        return {
            top10: ["hajime no dodo", "one punch card", "megalo bros", "denver", " my little poney", "etc"],
            currentSuggestion: "call advised from top10",

            //Ranking suggestion
            animeName: "",
            genre: "",
            videoLink: "",
            tags: "",

            //Display Settings
            themeColors: ['blue', 'pink', 'yellow', 'gray', 'cream'],
            extendedVideosAutoplay: "yes",
        }
    },
    watch: {},
    computed: {},
    methods: {
        sendSuggestedAnime: function() {},
    },
    mounted: function() {

    },
    template: "<div>Template not loaded yet</div>"
};

axios.get('accountTemplate')
    .then(response => {
        accountComponent.template = response.data;
    })
    .catch(error => { console.log(error); });