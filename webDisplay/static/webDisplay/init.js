'use strict';

// loads mainvue as a function after retrieving its ranking template
if (axios != undefined) {
    axios.get("rankingTemplate").then(response => {
        let rankingHtml = response.data;
        var app = getmainVue(rankingHtml);
    });
} else {
    alert('Issue with fetching data (Axios is undefined)');
}