function showMsg(type, code, title, message, time) {
  for (let msg of $('.msg')){
    if($(msg).data('code') === code) return;
  }
  let msgDOM
  switch(type) {
    case 'error':
      msgDOM = `<div class="msg error" data-code=${code}><i class="fa fa-exclamation-triangle"></i> <b>${title}</b> ${message}</div>`;
    break;
    case 'success':
      msgDOM = `<div class="msg success" data-code=${code}><i class="fa fa-check"></i> <b>${title}</b> ${message}</div>`;
    break;
  }

  const msg = $(msgDOM).prependTo('#messages');
  if (time) {
    setTimeout(() => {
      msg.fadeOut(function () {
        $(this).remove()
      });
    }, time);
  }
}
