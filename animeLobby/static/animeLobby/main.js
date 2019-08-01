var app = new Vue({
    el: '#app',
    delimiters: ['[[', ']]'],
    data: {
      content: "",
    },
    methods:{
      displayAbout: function(event){
        var a = 2;
        this.content = "<p>I am about</p>"
      }
    },
  })