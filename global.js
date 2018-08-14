// Inject node globals into React Native global scope.
global.Buffer = require('buffer').Buffer
global.process = require('process')

// https://tc39.github.io/ecma262/#sec-%typedarray%.prototype.slice
if (!Uint8Array.prototype.slice) {
  Object.defineProperty(Uint8Array.prototype, 'slice', {
    value: Array.prototype.slice,
    configurable: true,
    writable: true,
  })
}
