
function isNextJs() {
  return Object.keys(globalThis).some(key => key.startsWith('__NEXT'))
}

module.exports = function shouldSkipPonyfill() {
  // Bun and Deno already have a Fetch API
  if (globalThis.Deno) {
    return true
  }
  if (process.versions.bun) {
    return true
  }
  if (isNextJs()) {
    return true
  }
  return false
}