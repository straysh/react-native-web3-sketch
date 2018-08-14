export const wait = (ms = 1) => new Promise(resolve => setTimeout(resolve, ms))

export function tryAsync2(error, cb) {
  try {
    cb().catch(e => {
      error(e)
      console.error(e)
    })
  } catch (e) {
    error(e)
    console.error(e)
  }
}
