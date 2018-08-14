exports.pbkdf2 = {
  deriveAsync: async function (key: Uint8Array, salt: Uint8Array, iter: number, len: number, alg: string) {
    if (alg !== 'sha512') {
      throw new Error('ErrorUnsupportedPbkdf2Algorithm: ' + alg)
    }

    return new Promise((resolve, reject) => {
      require('crypto').pbkdf2(key, salt, iter, len, 'sha512', (err, result) => {
        if (err) return reject(err)
        resolve(result)
      })
    })
  }
}
