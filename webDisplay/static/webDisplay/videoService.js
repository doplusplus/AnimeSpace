//Youtube API

function onYouTubeIframeAPIReady() {
    videoService.YouTubeReady = true;
};

function onPlayerStateChange(event) {

    //Playing only one video at a time
    if (event.data == YT.PlayerState.PLAYING) {
        let playerId = event.target.l;
        for (let indx = 0; indx < animePerPage; indx++) {
            if (videoService.players[indx].l != playerId) {
                videoService.players[indx].pauseVideo();
            } else {
                videoService.playingVideoIndex = indx;
            }
        }

    }
};

var videoService = {

    self: this,
    players: [],
    videoIds: [],
    YouTubeReady: false,
    playingVideoIndex: -1,

    // Loading api from js instead of html for better control of the loading. It avoids interupting the rendering flow as well
    loadYoutubeAPI: function(divName) {
        var tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        var firstScriptTag = document.getElementById(divName);
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    },
    generatePlayers: function(animesNumber) {
        if (!this.YouTubeReady) {
            setTimeout(() => videoService.generatePlayers(animesNumber), 3000);
            return;
        }

        for (let indx = 0; indx < animesNumber; indx++) {
            let player = new YT.Player('player' + indx, {
                // height: isMobile ? '100' : '500',
                // width: isMobile ? '300' : '2000',
                enablejsapi: 1,
                host: 'https://www.youtube-nocookie.com',
                videoId: this.videoIds[indx],
                events: {
                    'onStateChange': onPlayerStateChange,
                }
            });

            this.players.push(player);
        }
    },
    fillVideoIds: function(emptyList, responseData) {
        for (let indx = 0; indx < responseData.length; indx++) {
            emptyList[indx] = responseData[indx].videoId;
        }
    },
    play: function(index) {
        this.players[index].playVideo();
        this.playingVideoIndex = index;
    },
    playing: function() {
        return this.playingVideoIndex > -1;
    },
    ResumeVideo: function() {
        this.players[this.playingVideoIndex].playVideo();
    },
    PauseVideo: function(reset = false) {
        this.players[this.playingVideoIndex].pauseVideo();
        if (reset) { this.playingVideoIndex = -1; }
    },

    UpdateVideos: function() {
        for (let indx = 0; indx < this.videoIds.length; indx++) {
            if (this.players[indx].getVideoData().video_id != this.videoIds[indx]) {
                this.players[indx].cueVideoById({ videoId: this.videoIds[indx] });
            } else {
                this.players[indx].cueVideoById({ videoId: '' });
            }
        }
    }

}