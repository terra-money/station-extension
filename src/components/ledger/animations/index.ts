// nanos
import nanosConnect from './nanos/connect.json';
import nanosUnlock from './nanos/unlock.json';
import nanosOpenApp from './nanos/openApp.json';
import nanosConfirm from './nanos/confirm.json';

// nanosp
import nanospConnect from './nanosp/connect.json';
import nanospUnlock from './nanosp/unlock.json';
import nanospOpenApp from './nanosp/openApp.json';
import nanospConfirm from './nanosp/confirm.json';

// nanox
import nanoxConnect from './nanox/connect.json';
import nanoxUnlock from './nanox/unlock.json';
import nanoxOpenApp from './nanox/openApp.json';
import nanoxConfirm from './nanox/confirm.json';

export default {
  nanos: {
    connect: nanosConnect,
    unlock: nanosUnlock,
    openApp: nanosOpenApp,
    confirm: nanosConfirm,
  },
  nanosp: {
    connect: nanospConnect,
    unlock: nanospUnlock,
    openApp: nanospOpenApp,
    confirm: nanospConfirm,
  },
  nanox: {
    connect: nanoxConnect,
    unlock: nanoxUnlock,
    openApp: nanoxOpenApp,
    confirm: nanoxConfirm,
  },
};