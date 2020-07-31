// NOT TESTED YET
'use strict';
const universalCharRegex = /^([a-zA-Z0-9\u0600-\u06FF\u0660-\u0669\u06F0-\u06F9 _.-]+)$/; //todo tester
const defaultCharacteristics = [
    { name: "Visuals", value: 5, selected: true },
    { name: "Audio", value: 5, selected: true },
    { name: "Sexy M", value: 5, selected: true },
    { name: "Sexy F", value: 5, selected: true },
    { name: "Violence", value: 5, selected: true },
    { name: "Story", value: 5, selected: true },
    { name: "Character design", value: 5, selected: true },
    { name: "Fight scenes", value: 5, selected: true }
];


var rateAnimesComponent = function(HTMLTemplate) {
    return {
        delimiters: ['[[', ']]'],
        props: ['framesize'],
        data: function() {
            return {
                animeName: "",
                animeSelected: false,
                genre: isMobile ? '' : 'Genre',
                genreList: [],
                characteristics: defaultCharacteristics,
                charactCheckboxes: [false, false, false, false, false, false, false, false], //use characteristics.selected instead ?
                allTicked: false,
                tagEntry: "",
                statsSent: false,
                searchList: [],
                rated: true,
                read: false,
                write: false,
                //mobile only
                showgenre: true,
                screen: 'name',
            }
        },
        computed: {
            canSend: function() {
                return this.animeSelected && this.genre != null && this.genre.indexOf('No idea') == -1;
            },
            oneUnticked: function() {
                for (let i = 0; i < this.charactCheckboxes.length; i++) {
                    if (!this.charactCheckboxes[i]) {
                        return true;
                    }
                }
                return false;
            },


            //not used anymore
            // long: function() {
            //     return this.framesize < 631;
            // },
        },
        watch: {
            // frameSize: function(newHeight) {
            //     this.long = newHeight < 631;
            // },
            allTicked: function(allRequested) {
                if (!this.read) {
                    this.charactCheckboxes = allRequested ? [true, true, true, true, true, true, true, true] : [false, false, false, false, false, false, false, false];
                    this.write = true;
                }
                this.read = false;
            },
            oneUnticked: function(exist) {
                if (!this.write) {
                    this.allTicked = !exist;
                    this.read = true;
                }
                this.write = false;
            },
            animeName: function(value) {

                this.statsSent = false;
                this.searchList = [];
                var isalphaNum = universalCharRegex.test(value);

                if (isalphaNum) {
                    axios.get('ranking/search/' + value)
                        .then(response => {
                            // when selecting an anime, a search is automically launched because the name changed
                            if (response.data.length == 1 && response.data[0].name == this.animeName) {
                                //using the fact that name selection triggers a call
                                this.getStats(this.animeName);
                                this.getGenre(this.animeName);
                                this.animeSelected = true;
                                return;
                            } else {
                                this.animeSelected = false;
                            }

                            response.data.forEach(obj => { this.searchList.push(obj.name); });
                        })
                        .catch(error => { console.log(error); });
                }
            },
        },
        methods: {
            getStats: async function(name) {
                axios.get('rating/stats/' + name)
                    .then(response => {
                        this.rated = response.data.length > 0;
                        this.characteristics = this.rated ? response.data : defaultCharacteristics;
                    })
                    .catch(error => { console.log(error); });
            },
            getGenre: async function(name) {
                axios.get('rating/genre/' + name)
                    .then(response => {
                        this.genre = response.data ? response.data : null
                    })
                    .catch(error => { console.log(error); });
            },
            optionSelected: function() {
                animeClicked = true;
            },
            SendRatings: function() {
                let selectedchar = [];
                this.characteristics.forEach((element, index) => {
                    selectedchar.push({ name: element.name, value: this.charactCheckboxes[index] ? element.value : -1 });
                });

                let tosend = {
                    name: this.animeName,
                    genre: this.genre,
                    characteristics: selectedchar,
                    tags: this.tagEntry,
                };

                axios({
                        method: 'post',
                        url: 'rating/',
                        data: tosend,
                    })
                    .then(response => {
                        this.statsSent = true;
                    })
                    .catch(function(error) {
                        console.log(error);
                    });
            },
            //mobile only
            select: function(element) {
                this.showgenre = element == 'genre';
            },
            selectScreen: function(element) {
                this.screen = element;
            },
            toggle: function(index) {
                // this.charactCheckboxes[index] = !this.charactCheckboxes[index];
                let value = this.characteristics[index];
                value.selected = !value.selected
                this.characteristics.splice(index, 1, value)
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

            // let frameHeight = document.getElementById('mainDisplay').clientHeight;
            // this.long = frameHeight < 631;
        },

        template: HTMLTemplate
    };
};