const config = new Config();

// Get data and draw items
(function setup() {
  const lightsPromise = getLightsData();
  const thermometersPromise = getThermometersList();

  Promise.all([lightsPromise, thermometersPromise]).catch(() => {
    showMsg('error', 'api_connection', 'Błąd', 'Brak połączenia z API');
  });

  getRoomsList().then((rooms) => {
    rooms.map(drawRoom);

    lightsPromise.then((lights) => {
      lights.map(drawLight);
      setInterval(updateLights, config.LIGHTS_REFRESH_TIME);
    })
    thermometersPromise.then((thermometers) => {
      drawThermometers(thermometers);
    })
  }).catch(() => {
    showMsg('error', 'api_connection', 'Błąd', 'Brak połączenia z API');
  });

})();

$(() => {
  console.log('JQuery ready');
  console.log(`API IP: ${config.API_IP}`);

  // Light listeners
  $('#board').on('click', '.light-switch', switchLight);
  $('#board').on('click', '.controls-lights-off', switchRoomOff);

});

function getRoomsList() {
  return $.ajax({
    url: config.API_IP + '/rooms/list',
    async: true,
  }).done((rooms) => {
    return (rooms);
  });
}

function drawRoom(room) {
      const roomDOM = `<div class="room" data-room-id='${room.id}'>
                        <div class="room-name">${room.name}</div>
                        <div class="room-temps"></div>
                        <div class="room-lights"></div>
                        <div class="room-blinds"></div>
                        <div class="room-controls">
                          <div class="room-control controls-lights-off" title="Wyłącz wszystkie światła w pokoju"><i class="fa fa-power-off"></i></div>
                          <div class="room-control controls-spacer"></div>
                          <div class="room-control controls-blinds-up" title="Podnieś wszystkie rolety"><i class="fa fa-chevron-up"></i></div>
                          <div class="room-control controls-blinds-down" title="Opuść wszystkie rolety"><i class="fa fa-chevron-down"></i></div>
                        </div>
                      </div>`;
      $('#board').append(roomDOM);
}

function getThermometersList() {
  return $.ajax({
    url: config.API_IP + '/thermometers/list/all',
  }).done((ids) => {
    return (ids);
  });
}

function getThermometerData(id) {
  return $.ajax({
    url: config.API_IP + '/thermometers/data/id/' + id,
  });
}

function drawThermometers(ids) {
  for (let id of ids) {
    getThermometerData(id).then((thermometer) => {
      drawThermometer(thermometer);
    });
  }
}

function drawThermometer(thermometer) {
  const { id, description, temp, room_id } = thermometer;
  const thermometerDOM = `<div class="room-temp">
  <div class="temp-name">${description}</div>
  <dic class="temp-value" style="color: #16a085;">${temp}&#176;C</div>
  </div>`;
  $(`.room[data-room-id=${room_id}] .room-temps`).append(thermometerDOM);
}

function getLightsData() {
  return $.ajax({
    url: config.API_IP + '/lights/data/all',
  }).done((data) => {
    return (data);
  });
}

function drawLight(light) {
  const { id, description, state, room_id } = light;
  const stateIconClass = state ? 'fa-square' : 'fa-square-o';
  const lightDOM = `<div class="room-light">
                      <div class="light-name">${description}</div>
                      <div class="light-switch fa ${stateIconClass}" data-light-id=${id} data-state=${state}></div>
                    </div>`;
  $(`.room[data-room-id=${room_id}] .room-lights`).append(lightDOM);
}

function switchLight(event) {
  const id = $(event.target).data('light-id');
  const dot = $('#light-switch-indicator').fadeIn(100);

  $.ajax({
    url: config.API_IP + '/lights/switch/id/' + id,
  }).done((state) => {
    dot.fadeOut(100);
    $(event.target).attr('data-state', state);
    if(state) {
      $(event.target).removeClass('fa-square-o');
      $(event.target).addClass('fa-square');
    } else {
      $(event.target).removeClass('fa-square');
      $(event.target).addClass('fa-square-o');
    }
  });
}

function switchRoomOff(event) {
  const id = $(event.target).closest('.room').data('room-id');
  $.ajax({
    url: config.API_IP + '/lights/set/room/id/' + id + '/off',
  }).done(() => {
    $(event.target).closest('.room').find('.light-switch').attr('data-state', false);
  });
}

function updateLights() {
  const dot = $('#light-update-indicator').fadeIn(300);
  getLightsData().then((lights) => {
    lights.map(updateLight);
    dot.fadeOut(200);
  }).catch(() => {
    showMsg('error', 'api_connection', 'Błąd', 'Brak połączenia z API', 1000);
  });
}

function updateLight(light) {
  const lightDOM = $(`.light-switch[data-light-id=${light.id}]`);
  const state = light.state;
  lightDOM.attr('data-state', state);
  if(state) {
    lightDOM.removeClass('fa-square-o');
    lightDOM.addClass('fa-square');
  } else {
    lightDOM.removeClass('fa-square');
    lightDOM.addClass('fa-square-o');
  }
}
