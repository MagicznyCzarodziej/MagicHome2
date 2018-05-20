const config = new Config();

$(() => {
  console.log('JQuery ready');
  console.log(`API IP: ${config.API_IP}`);

  $('input[name="API_IP"]').val(config.API_IP);
  $('input[name="LIGHTS_REFRESH_TIME"]').val(config.LIGHTS_REFRESH_TIME);
  $('input[name="THERMOMETERS_REFRESH_TIME"]').val(config.THERMOMETERS_REFRESH_TIME);

  $('#save-button').on('click', () => {
    this.API_IP = $('input[name="API_IP"]').val();
    Cookies.set('API_IP', this.API_IP, {expires: new Date(9999, 12, 31)});

    this.LIGHTS_REFRESH_TIME = $('input[name="LIGHTS_REFRESH_TIME"]').val();
    Cookies.set('LIGHTS_REFRESH_TIME', this.LIGHTS_REFRESH_TIME, {expires: new Date(9999, 12, 31)});

    this.THERMOMETERS_REFRESH_TIME = $('input[name="THERMOMETERS_REFRESH_TIME"]').val();
    Cookies.set('THERMOMETERS_REFRESH_TIME', this.THERMOMETERS_REFRESH_TIME, {expires: new Date(9999, 12, 31)});

    showMsg('success', 'saved', 'Zapisano', '', 2000);
  });
});
