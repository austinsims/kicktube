if ('geolocation' in window.navigator) {
  navigator.geolocation.getCurrentPosition(function(position) {
    // What... why... why do I take the negative here? wtf?
    window.location.href = `/events?lat=${position.coords.latitude}&lon=${position.coords.longitude}`;
  });
} else {
  document.body.innerText = 'Sorry, Kicktube requires a browser that supports the geolocation API.';
}
