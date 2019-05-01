require('colors')
const fs = require('fs')

const checkpointFilePath = './lazy-commit.temp'

let checkpointData = {}

/**
 * Error handler
 * @param {string} error 
 */
function errorHandler(error) {
  if (error) {
    console.log(`Error: ${error}`.red)
  }
}

/**
 * createCheckpointFile
 * This will create a checkpoint temp file
 */
function createCheckpointFile(callback) {
  fs.appendFile(checkpointFilePath, JSON.stringify(checkpointData), 'utf8', callback)
  console.log('Checkpoint file created'.green)
}

/**
 * saveCheckpointFile
 * This will save the checkpoint data in the checkpoint temp file
 */
function saveCheckpointFile() {
  fs.writeFile(checkpointFilePath, JSON.stringify(checkpointData), 'utf8', errorHandler)
  console.log('Checkpoint saved'.green)
}

/**
 * getCheckpoint
 * Return checkpoint data from a temp file if exists, if does not exist, return empty object
 */
function getCheckpoint() {
  return new Promise((resolve, reject) => {
    fs.open(checkpointFilePath, 'r', (error, file) => {
      if (error && error.code === 'ENOENT') {
        createCheckpointFile((error) => {
          if (error) {
            errorHandler(error)
            reject(error)
          }
          resolve()
        })
      } else {
        fs.readFile(checkpointFilePath, (error, data) => {
          if (error) {
            errorHandler(error)
            reject(error)
          } else {
            checkpointData = JSON.parse(data)
            resolve(checkpointData)
          }
        })
      }
    })
  })
}

/**
 * saveCheckpoint
 * Save current checkpoint data to the checkpoint temp file
 * @param {object} data - Object data to merge
 */
function saveCheckpoint(data) {
  return getCheckpoint()
    .then(() => {
      Object.assign(checkpointData, data)

      saveCheckpointFile()

      return
    })
}

/**
 * deleteCheckpoint
 * Delete the checkpoint file
 */
function deleteCheckpoint() {
  fs.unlink(checkpointFilePath, errorHandler)
  console.log('Checkpoint file deleted'.green)
}

module.exports = {
  checkpointFilePath,
  createCheckpointFile,
  deleteCheckpoint,
  getCheckpoint,
  saveCheckpoint,
  saveCheckpointFile,
}

