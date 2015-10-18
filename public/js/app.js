var loadedVideoContainerEls = [];

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
  loadedVideoContainerEls = _.without(containerEl);
}

function loadVideo(imgEl) {
  // Unload other videos.
  loadedVideoContainerEls.forEach(unloadVideo);

  // Load this video.
  var videoUrl = imgEl.dataset.videoUrl;
  var containerEl = imgEl.parentElement;
  var iframeEl = document.createElement('iframe');
  iframeEl.src = videoUrl;
  iframeEl.frameBorder = '0';
  hide(imgEl);
  containerEl.appendChild(iframeEl);

  loadedVideoContainerEls.push(containerEl);
}
