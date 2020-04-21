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
                themeColors: ['white', 'pink', 'yellow', 'blue', 'gray', 'cream'],
                selectedColor: null,
                extendedVideosAutoplay: "yes",
                message: ""
            };
        },
        watch: {
            extendedVideosAutoplay: function(val) {
                let autoplayActive = val == "yes";
                this.$root.$emit('autoplayChanged', autoplayActive);
            },
            selectedColor: function(val) {
                if (val) {
                    document.body.style.backgroundColor = val;
                }
            },

        },
        computed: {},
        methods: {
            sendSuggestedAnime: function() {
                let tosend = {
                    "userID": this.userid,
                    "animeName": this.animeName,
                    "genre": this.genre,
                    "videoLink": this.videoLink,
                    "tags": this.tags,
                };

                axios({
                    method: 'post',
                    url: 'accounts/saveSuggestion',
                    data: tosend,
                }).then(response => {
                    this.message = response.data;
                    setTimeout(() => { this.message = ''; }, 2000);
                }).catch(function(error) {
                    console.log(error);
                });


            },
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