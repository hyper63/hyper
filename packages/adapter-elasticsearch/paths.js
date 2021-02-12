
function createIndexPath (root, index) {
  return `${root}/${index}`
}

function deleteIndexPath (root, index) {
  return `${root}/${index}`
}

function indexDocPath (root, index, key) {
  return `${root}/${index}/_doc/${key}`
}

function updateDocPath (root, index, key) {
  return `${root}/${index}/_doc/${key}`
}

function removeDocPath (root, index, key) {
  return `${root}/${index}/_doc/${key}`
}

function getDocPath (root, index, key) {
  return `${root}/${index}/_doc/${key}/_source`
}

function bulkPath (root) {
  return `${root}/_bulk`
}

function queryPath (root, index) {
  return `${root}/${index}/_search`
}

module.exports = {
  createIndexPath,
  deleteIndexPath,
  indexDocPath,
  updateDocPath,
  removeDocPath,
  getDocPath,
  bulkPath,
  queryPath
}