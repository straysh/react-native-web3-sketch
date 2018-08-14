export function tryAsync(cb) {
  try {
    cb().catch(e => {
      console.log(e)
    })
  } catch (e) {
    console.log(e)
  }
}
