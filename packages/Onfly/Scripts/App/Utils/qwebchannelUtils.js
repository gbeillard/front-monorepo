import store from '../Store/Store';
import QWebChannel from './qwebchannel.js';

let core_channel = null;

export function isConnected() {
  return core_channel != null;
}

export function setPort(port) {
  const baseUrl = `ws://localhost:${port}`;

  // output("Connecting to WebSocket server at " + baseUrl + ".");
  const socket = new WebSocket(baseUrl);

  socket.onclose = function () {
    store.dispatch({ type: 'SOCKET_STATUS', data: false });
    console.error('web channel closed');
  };
  socket.onerror = function (error) {
    store.dispatch({ type: 'SOCKET_STATUS', data: false });
    console.error(`web channel error: ${error}`);
  };
  socket.onopen = function () {
    // output("WebSocket connected, setting up QWebChannel.");
    new QWebChannel(socket, (channel) => {
      // make core object accessible globally
      core_channel = channel.objects.core;

      core_channel.sendText.connect((message) => {
        receiveMessage(message);
      });

      store.dispatch({ type: 'SOCKET_STATUS', data: true });
    });
  };
}

export function sendMessage(object) {
  if (core_channel != null) {
    const serialized = JSON.stringify(object);
    core_channel.receiveText(serialized);
  }
}

export function receiveMessage(message) {
  const message_json = JSON.parse(message);

  if (message_json.Action == 'set') {
    switch (message_json.Category) {
      case 'BundleList':
        store.dispatch({ type: 'setBundles', data: JSON.parse(message_json.Data) });
        break;

      case 'SummaryUploadList':
        store.dispatch({ type: 'setSummaryUploadList', data: JSON.parse(message_json.Data) });
        break;

      default:
        break;
    }
  } else {
    switch (message_json.Category) {
      case 'Test':
        sendMessage({ Category: 'Test', Action: 'set', Data: 'OK' });
      default:
        break;
    }
  }
}
window.receiveMessage = receiveMessage;
