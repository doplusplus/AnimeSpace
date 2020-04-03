//Youtube API
var players = [];
var videoIds = [];
var YouTubeReady = false;

function loadYoutubeAPI(divName) {
    var tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementById(divName);
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
};

function onYouTubeIframeAPIReady() {
    YouTubeReady = true;
};

function displayVideos(animesNumber) {
    if (!YouTubeReady) { setTimeout(() => displayVideos(animesNumber), 3000); return; }

    for (let indx = 0; indx < animesNumber; indx++) {
        let player = new YT.Player('player' + indx, {
            height: '500',
            width: '2000',
            enablejsapi: 1,
            origin: 'http://localhost:8000',
            host: 'https://www.youtube-nocookie.com',
            videoId: videoIds[indx],
            events: {
                'onStateChange': onPlayerStateChange
            }
        });

        players.push(player);
    }
};

function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.PLAYING) {
        let playerId = event.target.l.id;
        for (let indx = 0; indx < animePerPage; indx++) {
            if (players[indx].l.id != playerId) {
                players[indx].pauseVideo();
            }
        }
    }
};

var fillVideoIds = function(emptyList, responseData) {
    for (let indx = 0; indx < animePerPage; indx++) {
        emptyList[indx] = responseData[indx].videoId;
    }
};