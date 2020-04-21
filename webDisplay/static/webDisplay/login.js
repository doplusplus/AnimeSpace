'use strict';

var loginComponent = function(htmlTemplate) {
    return {
        delimiters: ['[[', ']]'],
        props: ['identify', 'confirmed'],
        data: function() {
            return {
                login: "",
                password: "",
                message: ""
            }
        },
        watch: {},
        computed: {},
        methods: {
            authenticate: function(goOn) {

                if (!goOn) {
                    this.confirmed(false);
                    return;
                }

                let tosend = {
                    login: this.login,
                    password: this.password,
                }

                axios({
                        method: 'post',
                        url: 'accounts/',
                        data: tosend,
                    })
                    .then(response => {
                        if (response.data['validUser']) {
                            this.confirmed(true, response.data['userID']);
                        } else {
                            this.message = '<h4 style="color:red;"> Invalid user / password combination</h4>'
                        }
                    })
                    .catch(function(error) {
                        console.log(error);
                    });
            }
        },
        template: htmlTemplate

    };
};