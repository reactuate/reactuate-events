import React from 'react'

export function createEvent(name) {
  let executor = (resolve, reject) => {
    this[`handle${name}`] = (...v) => {
      this[`waitFor${name}`] = new Promise(executor)
      resolve(...v)
    }
  }
  this[`waitFor${name}`] = new Promise(executor)
}

export function enableEvents(Component) {
  if (!Component instanceof React.Component) {
    throw `enableEvent() only accepts React.Component, please use createEvent() for other configurations`
  }
  class EventedComponent extends Component {
    createEvent(e) {
      createEvent.bind(this)(e)
    }
    setStateAndWait(update) {
      return new Promise(resolve => this.setState(update, () => resolve(this.state)))
    }
  }
  return EventedComponent
}
