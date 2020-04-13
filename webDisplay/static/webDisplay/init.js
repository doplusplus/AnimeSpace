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

    let Rankingtemplate = isMobile ? "rankingMobileTemplate" : "rankingTemplate";
    let rankingRequest = axios.get(Rankingtemplate);

    let RateAnimestemplate = isMobile ? "rateAnimesTemplate" : "rateAnimesTemplate";
    let rateAnimesRequest = axios.get(RateAnimestemplate);

    axios.all([rankingRequest, rateAnimesRequest]).then(axios.spread((...responses) => {
        let rankingHtml = responses[0].data;
        let rateAnimesHtml = responses[1].data;

        var app = getmainVue(rankingHtml, rateAnimesHtml, isMobile);
    })).catch(errors => {
        alert('some error occured');
    });
} else {
    alert('Issue with fetching data (Axios is undefined)');
}