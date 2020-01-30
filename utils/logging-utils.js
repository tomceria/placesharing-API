const getDatabaseInteractMsg = (controllerName, messageObj) => {
  console.log(`[controller: ${controllerName}]: DatabaseInteractError: ${JSON.stringify(messageObj)}`)
}

const getUserReqMessage = (controllerName, messageObj) => {
  console.log(`[controller: ${controllerName}]: UserRequestError: ${JSON.stringify(messageObj)}`)
}

exports.getDatabaseInteractMsg = getDatabaseInteractMsg
exports.getUserReqMessage = getUserReqMessage
