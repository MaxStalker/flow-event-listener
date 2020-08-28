import { getEvents, getLatestBlock } from '../utils'

class FlowEventListener {
  constructor({ dispatch, pollInterval }) {
    this.dispatch = dispatch
    this.pollInterval = pollInterval
    this.latestBlock = null
  }

  setDispatch(newDispatch) {
    this.dispatch = newDispatch
  }

  setPollInterval(newInterval) {
    this.pollInterval = newInterval
  }

  subscribe() {
    const { pollInterval, dispatch } = this

    this.pollId = setInterval(async () => {
      const latestBlock = await getLatestBlock()
      if (this.latestBlock !== null) {
        if (latestBlock > this.latestBlock) {
          const events = await getEvents(
            {
              from: this.latestBlock + 1,
              to: latestBlock,
            },
            ''
          )

          for (let i = 0; i < events.length; i++) {
            const { type, data } = events[i]
            const [_, contractAddress, contractName, eventType] = type.split('.')
            console.log({ contractName, eventType })
            dispatch({
              rawType: type,
              contractAddress,
              contractName,
              eventType,
              data,
            })
          }

          this.latestBlock = latestBlock
        }
      } else {
        this.latestBlock = latestBlock
      }
    }, pollInterval)
  }

  unsubscribe() {
    clearInterval(this.pollId)
  }
}

export default FlowEventListener
