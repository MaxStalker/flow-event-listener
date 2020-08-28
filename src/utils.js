import * as fcl from '@onflow/fcl'
import * as sdk from '@onflow/sdk'

export const fixNames = (item) => {
  var result = {}

  for (let name of Object.keys(item)) {
    const value = item[name]
    const fixedName = name.replace(/\w+_/, '')
    result[fixedName] = value
  }

  return result
}

export const getEvents = async (params, type) => {
  // Define event type from params
  let eventType = type
  /*
  if (type !== undefined) {
    eventType = type;
  } else {
    const { contractAddress, contractName, eventName } = params;
    eventType = `A.${contractAddress}.${contractName}.${eventName}`;
  }

   */

  const { from = 0, to } = params
  let toBlock
  if (to === undefined) {
    // Get latest block
    const blockResponse = await fcl.send(await sdk.build([sdk.getLatestBlock()]))
    toBlock = blockResponse.latestBlock.height
  } else {
    toBlock = to
  }

  const response = await fcl.send(await sdk.build([sdk.getEvents(eventType, from, toBlock)]))

  const events = await fcl.decode(response)
  const fixedEvents = events.map((item) => {
    const { data } = item
    item.data = fixNames(data)
    return item
  })

  // Return a list of events
  return fixedEvents
}

export const getLatestBlock = async () => {
  const blockResponse = await fcl.send(await sdk.build([sdk.getLatestBlock()]))
  const height = blockResponse.block.height

  return height
}
