const securityString = {};

let customerId = '';
let token = '';
let timestamp = '';
let encProjectId = ''
Object.defineProperty(securityString, 'customerId', {
  get() {
    return customerId;
  },
  set(newValue) {
    customerId = newValue;
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(securityString, 'token', {
  get() {
    return token;
  },
  set(newValue) {
    token = newValue;
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(securityString, 'timestamp', {
  get() {
    return timestamp;
  },
  set(newValue) {
    timestamp = newValue;
  },
  enumerable: true,
  configurable: true
});

Object.defineProperty(securityString, 'encProjectId', {
  get() {
    return encProjectId;
  },
  set(newValue) {
    encProjectId = newValue;
  },
  enumerable: true,
  configurable: true
});


export default securityString;
