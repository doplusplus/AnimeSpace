// NOT TESTED YET
'use strict';


var rateAnimesComponent = function(HTMLTemplate) {
    return {
        delimiters: ['[[', ']]'],
        data: function() {
            return {
                statsSent: false,
                allTicked: false,
                characteritics: ["Visuals", "Audio", "Violence", "Sexy M", "Sexy F", "Violence", "Sexy M", "Sexy F"],
                charactCheckboxes: [false, false, true, false, false, false, false, false],
                checkboxChanged: false,
                allTickedChanged: false,
            }
        },
        watch: {
            allTicked: function(allRequested) {
                if (this.checkboxChanged) {
                    this.checkboxChanged = false;
                    return;
                }
                this.allTickedChanged = true;
                this.charactCheckboxes = allRequested ? [true, true, true, true, true, true, true, true] : [false, false, false, false, false, false, false, false];
            },

            charactCheckboxes: function(value) {
                if (this.allTickedChanged) {
                    this.allTickedChanged = false;
                    return;
                }
                for (let i = 0; i < value.length; i++) {
                    if (value[i] == false && this.allTicked) {
                        this.checkboxChanged = true;
                        this.allTicked = false;
                        break;
                    }
                }
            },
        },
        methods: {
            onCheckboxClicked: function(ticked) {
                if (allTicked && !ticked) { allTicked = false; }
            }
        },

        template: HTMLTemplate
    };
}