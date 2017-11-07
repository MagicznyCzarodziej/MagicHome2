function showError(title, message, time) {
  const errorDOM = `<div class="error"><b>${title}</b> ${message}</div>`;
  const error = $(errorDOM).prependTo('#errors');
  if (time) {
    setTimeout(() => {
      error.fadeOut();
    }, time);
  }
}
