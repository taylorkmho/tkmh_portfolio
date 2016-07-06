export default class VideoBG {
  constructor(selector) {
    this.selector = selector
    this.el = document.querySelector(selector)
    this.videoEl = document.querySelector(selector + '__video')
    this.videoID = document.querySelector(selector).getAttribute('data-video-id')
    this.videoVars = {
      autoplay: 1,
      autohide: 1,
      controls: 0,
      rel: 0,
      loop: 1,
      playlist: this.videoID,
      showinfo: 0,
      iv_load_policy: 3,
      start: 127
    }

    if (this.videoEl !== null) {
      this.loadPlayer()
    }
  }
  loadPlayer() {
    if (typeof(YT) == 'undefined' || typeof(YT.Player) == 'undefined') {
      // Add Youtube Video API script
      var tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      var firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      window.onYouTubeIframeAPIReady = () => {
        this.onYoutubeReady()
      }
    } else {
      this.onYoutubeReady()
    }
  }
  onYoutubeReady() {
    this.videoEl.id = 'ytplayer'
    this.player = new YT.Player('ytplayer', {
      videoId: 'VSEhrhzK830',
      playerVars: this.videoVars,
      events: {
        'onReady': this.onPlayerReady
      }
    });
  }
  onPlayerReady(event) {
    event.target.mute();
    event.target.playVideo();
  }
}