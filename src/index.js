import { remote } from 'electron';

let listener = null;

export function activate() {
  if (!inkdrop.isMainWindow) {
    return;
  }

  const lastProcessId = inkdrop.config.get('minimize-on-launch.pid') || -1;
  const currentProcessId = remote.process.pid;

  // If the process id is the same as the last saved id, we can assume the
  // window was simply reloaded. While there is a chance for the pid to be the
  // same during restarts, there is no better way to differentiate between an
  // app restart and a window reload.
  if (lastProcessId === currentProcessId) {
    return;
  }

  inkdrop.config.set('minimize-on-launch.pid', currentProcessId);

  // The window is not always restored to the correct size if it is minimized
  // before the app is ready.
  listener = inkdrop.onAppReady(() => {
    inkdrop.window.minimize();
  });
}

export function deactivate() {
  if (listener !== null) {
    listener.dispose();
    listener = null;
  }
}
