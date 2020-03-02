// NOT TESTED YET
'use strict';

var rateItHtml;
if (axios != undefined) {

    axios.get("rankingTemplate").then(response => {
        rateItHtml = response.data
        rateItComponent.template = rateItHtml;
    });
} else {
    alert('Issue with fetching data (Axios is undefined)');
}

var rateItComponent = {
    delimiters: ['[[', ']]'],
    data: function() {
        return {
            statsSent: false,
            allTicked: false,
        }
    },
    methods: {
        onAllTickedChanged: function(allRequested) {
            if (allRequested) {
                //check all checkboxes
            } else {
                //uncheck all checkboxes
            }
        },

        onCheckboxClicked: function(ticked) {
            if (allTicked && !ticked) { allTicked = false; }
        }

    },

    template: 'RATE IT'
}