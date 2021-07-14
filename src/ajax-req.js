function loadDoc(url) {
  if (url === window.location.pathname + 'dontrun') {
    setInterval(() => {
      const xhttp = new XMLHttpRequest();

      xhttp.onload = function() {
        document.getElementById("queue-ui").innerHTML = this.responseText;
      }
      xhttp.open("GET", url, true);
      xhttp.send();
    }, 2000)
  }
}