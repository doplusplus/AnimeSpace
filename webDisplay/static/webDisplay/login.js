'use strict';

var loginComponent = {
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
                    console.log(response.data);

                    if (response.data['valiUser']) {
                        this.confirmed(true);
                    } else {
                        this.message = '<h4 style="color:red;"> Invalid user / password combination</h4>'
                    }
                })
                .catch(function(error) {
                    console.log(error);
                });
        }
    },
    mounted: function() {},

};


axios.get('loginTemplate')
    .then(response => {
        loginComponent.template = response.data;
    })
    .catch(error => { console.log(error); });