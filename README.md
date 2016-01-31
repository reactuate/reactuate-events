[![npm package][npm-badge]][npm]
[![dependencies][david-dm]][david]

# Reactuate Events

Reactuate Events is an answer to maintaining complex single-component UX
workflows in React that do not exactly fit into the Flux architecture as they
don't belong to the global state of the application and should be rather kept
inside of the component. Most common examples of that would be generic components such as complex table navigators, forms with complex validation
and verification workflows.

Traditional answer to this is to use callbacks that modify the state to reflect
where the user is at and what should be rendered to him. The problem with this
approach is that different pieces of the workflow become disconnected. Not only
it's hard to comprehend such code, it is also difficult to maintain it because
of the complexity of servicing all potential scenarios.

Reactuate Events uses an **experimental** ES7 feature of [asynchronous functions](https://tc39.github.io/ecmascript-asyncawait/) to reduce the complexity of this problem. Instead of connecting disjoint pieces,
one can write a sequential event handling function.

*Please note that this is an extremely early prototype, bugs are very likely and the API* **will** *change.*

## Enabling Events

In order to enable component to use Reactuate Events, we need to compose it with `enableEvents`:

```js
import { enableEvents } from 'reactuate-events'

class MyComponent extends React.Component {}

MyComponent = enableEvents(MyComponent)
```

## Registering Events

We can enable events at any time, however, the initialization most commonly
would happen in the component's constructor:

```js
constructor() {
  super()

  this.createEvent("Click")
  this.eventProcessor()
}
```

## Triggering Events

Calling `createEvent` will create two properties in your component, `handleClick` and `waitForClick`. The former one is typically to be used in your `render()` function:

```html
<button onClick={() => this.handleClick()} />
```

## Handling Events

The latter (`waitForClick`) is to be used in the `eventProcessor` function that
we would define to process events as they come:

```js
async eventProcessor() {
  while (true) {
    await this.waitForClick
    await this.setStateAndWait({clicked: true})
  }
}
```

In the above example, we will wait for the button to be clicked and update
the state to reflect that click, indefinitely.

Of course, this is not very different from the traditional approach and adds
some ceremony. The elegance of this approach reveals itself when the workflows
become more complicated:

```js
async eventProcessor() {
  while (true) {
    await this.waitForClick
    await this.setStateAndWait({clicked: true})
    const value = await this.waitForInput
    await this.setStateAndWait({clicked: false, value})
  }
}
```

In the above example we will wait for some data input before recognizing another
button click, therefore significantly simplifying handling this workflow. And it
doesn't stop there.
If you use a Promise library like [bluebird](http://bluebirdjs.com), you can do interesting things, like waiting for an event *or* a timeout:

```js
const Timeout = Symbol("timeout")
while (true) {
  const waitForTimeout = new Promise(resolve =>
    setTimeout(() => resolve(Timeout), 2000))
  const result = await Promise.any([this.waitForClick, waitForTimeout])
  if (result === Timeout) {
  // ...
```

(Actually, `Timeout` and a generic version of `waitForTimeout` are also provided
by this library)

It is worth mentioning that it is unlikely to be a good practice to try to jam
all possible events into one event processor per component. It'll become rather
complicated. Instead, a number of small processors can be used and when their
proceedings are ready to be aggregated, they can trigger aggregation events
themselves.

# License

Reactuate Events is licensed under the terms of the Apache 2.0 license.

[npm]: https://www.npmjs.org/package/reactuate-events
[npm-badge]: https://badge.fury.io/js/reactuate-events.svg
[david-dm]: https://david-dm.org/reactuate/reactuate-events.svg
[david]: https://david-dm.org/reactuate/reactuate-events
