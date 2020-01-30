"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.activate = activate;
exports.deactivate = deactivate;
exports.config = void 0;

var _electron = require("electron");

let listener = null;
const PID_KEY = 'minimize-on-launch.pid';
const ALWAYS_MINIMIZE_KEY = 'minimize-on-launch.alwaysMinimize';
const config = {
  alwaysMinimize: {
    title: 'Always minimize on launch',
    description: 'By default Inkdrop is only minimized on launch if the --minimize flag is provided.',
    type: 'boolean',
    default: false
  }
};
exports.config = config;

function activate() {
  if (!inkdrop.isMainWindow) {
    return;
  }

  const lastProcessId = inkdrop.config.get(PID_KEY) || -1;
  const currentProcessId = _electron.remote.process.pid;
  inkdrop.config.set(PID_KEY, currentProcessId);
  const alwaysMinimize = inkdrop.config.get(ALWAYS_MINIMIZE_KEY);

  const minimizeFlag = _electron.remote.process.argv.includes('--minimize');

  if (!alwaysMinimize && !minimizeFlag) {
    return;
  } // If the process id is the same as the last saved id, we can assume the
  // window was simply reloaded. While there is a chance for the pid to be the
  // same during restarts, there is no better way to differentiate between an
  // app restart and a window reload.


  if (lastProcessId === currentProcessId) {
    return;
  } // The window is not always restored to the correct size if it is minimized
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