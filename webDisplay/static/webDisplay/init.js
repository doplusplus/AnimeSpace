'use strict';

function detectMob() {
    const toMatch = [
        /Android/i,
        /webOS/i,
        /iPhone/i,
        /iPad/i,
        /iPod/i,
        /BlackBerry/i,
        /Windows Phone/i
    ];

    return toMatch.some((toMatchItem) => {
        return navigator.userAgent.match(toMatchItem);
    });
}

var isMobile = detectMob();

// loads mainvue as a function after retrieving its ranking template
if (axios != undefined) {

    let template = isMobile ? "rankingMobileTemplate" : "rankingTemplate";

    axios.get(template).then(response => {
        let rankingHtml = response.data;
        var app = getmainVue(rankingHtml);
    });
} else {
    alert('Issue with fetching data (Axios is undefined)');
}