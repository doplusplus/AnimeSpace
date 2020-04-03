'use strict';

if (axios != undefined) {
    axios.get("rankingTemplate").then(response => {
        let rankingHtml = response.data;
        var app = getmainVue(rankingHtml);
    });
} else {
    alert('Issue with fetching data (Axios is undefined)');
}