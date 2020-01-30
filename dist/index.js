"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.activate = activate;
exports.deactivate = deactivate;

var _electron = require("electron");

let listener = null;

function activate() {
  if (!inkdrop.isMainWindow) {
    return;
  }

  const lastProcessId = inkdrop.config.get('minimize-on-launch.pid') || -1;
  const currentProcessId = _electron.remote.process.pid; // If the process id is the same as the last saved id, we can assume the
  // window was simply reloaded. While there is a chance for the pid to be the
  // same during restarts, there is no better way to differentiate between an
  // app restart and a window reload.

  if (lastProcessId === currentProcessId) {
    return;
  }

  inkdrop.config.set('minimize-on-launch.pid', currentProcessId); // The window is not always restored to the correct size if it is minimized
  // before the app is ready.

  listener = inkdrop.onAppReady(() => {
    inkdrop.window.minimize();
  });
}

function deactivate() {
  if (listener !== null) {
    listener.dispose();
    listener = null;
  }
}
//# sourceMappingURL=index.js.map