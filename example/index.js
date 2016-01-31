import { React, Route, Application,
         connect, bindActionCreators } from 'reactuate'

import { enableEvents } from '../src'

import Promise from 'bluebird'

class App extends React.Component {
  render() {
    return <div>{this.props.children}</div>
  }
}

class Example extends React.Component {

  state = {showInput: false, sayHello: false};

  constructor() {
    super()
    this.createEvent('ButtonClick')
    this.createEvent('Input')
    this.processor()
  }

  async processor() {
    const Timeout = Symbol("timeout")
    while (true) {
      const result = await Promise.any([this.waitForButtonClick, new Promise((resolve) => setTimeout(() => resolve(Timeout), 3000))])
      if (result === Timeout) {
        this.setStateAndWait({sayHello: true})
      } else {
        await this.setStateAndWait({showInput: true, sayHello: false})
        await this.setStateAndWait({showInput: false, text: await this.waitForInput})
      }
    }
  }

  render() {
    return (<div>
     <h1>Reactuate Events Component</h1>
     <button onClick={() => this.handleButtonClick()}>Test</button>
     {this.state.showInput ? <input type="text" onChange={(e) => this.handleInput(e.target.value)} /> : null}
     <p>{this.state.sayHello ? "Hello? Can you click the button?" : null}</p>
     <p>You entered: {this.state.text}</p>
    </div>)
  }
}

Example = connect(state => ({}))(enableEvents(Example))

const routes = (
  <Route component={App}>
    <Route path="/" component={Example} />
  </Route>
)

new Application({routes, domains: {}}).render()
