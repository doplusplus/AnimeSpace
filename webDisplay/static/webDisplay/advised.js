'use strict';

var adviseComponent = function(HTMLTemplate) {

    return {
        delimiters: ['[[', ']]'],
        data: function() {
            return {
                bySimilarities: true,
                byCharateristics: true,

            }
        },
        computed: {
            filteringMethodTicked: function() {
                return this.bySimilarities || this.byCharateristics;
            },
            searchButtonTitle: function() {
                return this.filteringMethodTicked ? "Search for animes" : "Can't search because no filtering method selected"
            },
        },
        methods: {},
        mounted: function() {},
        template: HTMLTemplate
    };
}