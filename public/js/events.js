Array.prototype.without = function(item) {
  var a = [];
  for (var i = 0; i < this.length; i++) {
    if (this[i] === item) continue;
    a.push(this[i]);
  }
  return a;
};

var loadedVideoContainerEls = [];

var ytDeferred = Promise.defer();
var ytPromise = ytDeferred.promise;
var ytPlayer;

function onYouTubeIframeAPIReady() {
  ytDeferred.resolve(YT);
}

function onPlayerReady(evt) {
  evt.target.playVideo();
}

function findNextImgEl(containerEl) {
  var nextTr = containerEl.parentElement.nextElementSibling;
  if (!nextTr) return;
  var nextImgEl = nextTr.querySelector('img');
  if (nextImgEl) {
    return nextImgEl;
  } else {
    containerEl = nextTr.querySelector('td');
    return findNextImgEl(containerEl);
  }
}

function playNextVideo() {
  var containerEl = document.querySelector('#player').parentElement;
  var nextImgEl = findNextImgEl(containerEl);
  if (!nextImgEl) return;
  unloadVideo(containerEl);
  loadVideo(nextImgEl);
}

// Play next video on right arrow key press
document.addEventListener('keydown', function(evt) {
  var key = evt.keyCode || evt.which;
  if (key !== 39) return;
  playNextVideo();
});

function onPlayerStateChange(evt) {
  if (evt.data == YT.PlayerState.ENDED) {
    playNextVideo();
  }
}

function hide(el) {
  el.style.display = 'none';
}

function show(el) {
  el.style.display = '';
}

function unloadVideo(containerEl) {
  var iframeEl = containerEl.querySelector('iframe');
  var imgEl = containerEl.querySelector('img');
  containerEl.removeChild(iframeEl);
  show(imgEl);
  loadedVideoContainerEls = loadedVideoContainerEls.without(containerEl);
}

function loadVideo(imgEl) {
  ytPromise.then(function(YouTube) {
    // Unload other videos.
    loadedVideoContainerEls.forEach(unloadVideo);

    // Load this video.
    hide(imgEl);
    var div = document.createElement('div');
    div.id = 'player';
    var containerEl = imgEl.parentElement;
    var videoId = imgEl.dataset.videoId;
    containerEl.appendChild(div);
    ytPlayer = new YouTube.Player('player', {
      height: '240',
      width: '320',
      videoId: videoId,
      events: {
        'onReady': onPlayerReady,
        'onStateChange': onPlayerStateChange
      }
    });
    

    loadedVideoContainerEls.push(containerEl);
  });
}

// Load YouTube API
var scriptTag = document.createElement('script');
scriptTag.src = 'https://www.youtube.com/iframe_api';
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(scriptTag, firstScriptTag);

