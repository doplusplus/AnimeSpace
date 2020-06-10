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

    //cookie necessary to prevent csrf attacks on post requests
    axios.defaults.xsrfCookieName = 'csrftoken'
    axios.defaults.xsrfHeaderName = "X-CSRFTOKEN"

    let Rankingtemplate = isMobile ? "rankingMobileTemplate" : "rankingTemplate";
    let rankingRequest = axios.get(Rankingtemplate);

    let RateAnimestemplate = isMobile ? "rateAnimesTemplate" : "rateAnimesTemplate";
    let rateAnimesRequest = axios.get(RateAnimestemplate);

    let AdvisedTemplate = isMobile ? "advisedTemplate" : "advisedTemplate";
    let advisedTRequest = axios.get(AdvisedTemplate);

    let accountTemplate = isMobile ? "accountTemplate" : "accountTemplate";
    let accountRequest = axios.get(accountTemplate);

    let loginTemplate = isMobile ? "loginTemplate" : "loginTemplate";
    let loginTRequest = axios.get(loginTemplate);

    let aboutTemplate = isMobile ? "aboutTemplate" : "aboutTemplate";
    let aboutRequest = axios.get(aboutTemplate);


    axios.all([rankingRequest, rateAnimesRequest, advisedTRequest, accountRequest, loginTRequest, aboutRequest]).then(axios.spread((...responses) => {
        let rankingHtml = responses[0].data;
        let rateAnimesHtml = responses[1].data;
        let advisedHtml = responses[2].data;
        let accountHTML = responses[3].data;
        let loginHtml = responses[4].data;
        let aboutHtml = responses[5].data;

        var app = getmainVue(rankingHtml, rateAnimesHtml, advisedHtml, accountHTML, loginHtml, aboutHtml, isMobile);

    })).catch(errors => {
        alert('some error occured');
    });
} else {
    alert('Issue with fetching data (Axios is undefined)');
}