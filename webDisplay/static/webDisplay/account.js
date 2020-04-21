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
        watch: {
            extendedVideosAutoplay: function(val) {
                let autoplayActive = val == "yes";
                this.$root.$emit('autoplayChanged', autoplayActive);
                //and send it to the server
            },
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
        beforeDestroy: function() {
            let tosend = {
                "autoplay": this.extendedVideosAutoplay == "yes",
                "themeColor": this.selectedColor,
                "userID": this.userid
            };

            axios({
                method: 'post',
                url: 'accounts/saveSettings',
                data: tosend,
            }).then(response => {
                document.getElementById('toastmessage').innerHTML = response.data;
                setTimeout(function() { document.getElementById('toastmessage').innerHTML = ''; }, 2000);
            }).catch(function(error) {
                console.log(error);
            });

        }
    };
};