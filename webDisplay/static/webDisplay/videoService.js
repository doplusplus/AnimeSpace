//Youtube API

function onYouTubeIframeAPIReady() {
    videoService.YouTubeReady = true;
};

function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.PLAYING) {
        let playerId = event.target.l.id;
        for (let indx = 0; indx < animePerPage; indx++) {
            if (videoService.players[indx].l.id != playerId) {
                videoService.players[indx].pauseVideo();
            }
        }
    }
};


var videoService = {

    players: [],
    videoIds: [],
    YouTubeReady: false,

    // Loading api from js instead of html for better control of the loading. It avoids interupting the rendering flow as well
    loadYoutubeAPI: function(divName) {
        var tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        var firstScriptTag = document.getElementById(divName);
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    },
    generatePlayers: function(animesNumber) {
        if (!this.YouTubeReady) { setTimeout(() => generatePlayers(animesNumber), 3000); return; }

        for (let indx = 0; indx < animesNumber; indx++) {
            let player = new YT.Player('player' + indx, {
                height: '500',
                width: '2000',
                enablejsapi: 1,
                host: 'https://www.youtube-nocookie.com',
                videoId: this.videoIds[indx],
                events: {
                    'onStateChange': onPlayerStateChange
                }
            });

            this.players.push(player);
        }
    },
    fillVideoIds: function(emptyList, responseData) {
        for (let indx = 0; indx < animePerPage; indx++) {
            emptyList[indx] = responseData[indx].videoId;
        }
    },

    play: function(index) {
        this.players[index].playVideo();
    }
}