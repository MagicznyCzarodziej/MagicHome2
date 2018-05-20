function updateClock() {
  const d = new Date();
  $('#menu-time').text(("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2));
}
updateClock();
setInterval(updateClock, 60000);
