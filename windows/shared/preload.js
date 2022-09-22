const {
  contextBridge,
  ipcRenderer
} = require("electron");

const validChannels = [
  "light-config-updated",
]

contextBridge.exposeInMainWorld(
  "api", {
    receive: (channel, func) => {
      if (validChannels.includes(channel)) {
        ipcRenderer.on(channel, (event, ...args) => func(...args));
      }
    },
    send: (channel, data) => {
      if (validChannels.includes(channel)) {
        ipcRenderer.send(channel, data);
      }
    }
  }
);