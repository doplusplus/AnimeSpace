// NOT TESTED YET
'use strict';


var rateAnimesComponent = function(HTMLTemplate) {
    return {
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

        template: HTMLTemplate
    };
}