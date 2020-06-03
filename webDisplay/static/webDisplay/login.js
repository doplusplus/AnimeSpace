'use strict';

var loginComponent = function(htmlTemplate) {
    return {
        delimiters: ['[[', ']]'],
        props: ['identify', 'confirmed'],
        data: function() {
            return {
                login: "",
                password: "",
                register: false,

                requestedLogin: "",
                email: "",
                requestedPassword: "",
                passwordBis: "",

                message: "",
            }
        },
        watch: {
            register: function() {
                this.message = "";
            }

        },
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
                    email: this.email,
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
            },
            registerUser: function(goOn) {
                this.message = '<h4 style="color:red;">';

                let pass = true;
                if (!goOn) {
                    this.confirmed(false);
                    this.register = false;
                    return;
                }

                if (this.requestedLogin == "") {
                    this.message += "- The username field is empty<br>";
                    pass = false;
                }

                if (this.requestedPassword != this.passwordBis) {
                    this.message += "- The provided passwords don't match <br>";
                    pass = false;
                } else {
                    if (this.requestedPassword == "") {
                        this.message += "- The password field is empty<br>";
                        pass = false;
                    }
                }

                //check email structure is valid
                let re = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,24}$/;
                if (this.email.match(re) == null) {

                    this.message += this.email == "" ? "- The email field is empty<br>" : "- The email entry doesn't look like an email <br>";
                    pass = false;

                }
                this.message += '</h4>'

                if (pass) {
                    let tosend = {
                        login: this.requestedLogin,
                        email: this.email,
                        password: this.requestedPassword,
                    };

                    axios({
                            method: 'post',
                            url: 'accounts/register',
                            data: tosend,
                        })
                        .then(response => {
                            this.message = '<h4 style="color:green;">' + response['data'] + '</h4>';
                        })
                        .catch((error) => {
                            console.log(error);
                            this.message = '<h4 style="color:red;">' + error.response.data + '</h4>';
                        });

                    this.register = false;
                }


            },
        },

        template: htmlTemplate

    };
};