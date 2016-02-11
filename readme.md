So you start with an [abstract-state-router](https://github.com/TehShrike/abstract-state-router), right?

When you call `addDomApiAttachListener`, your callback will be called for *every currently active state*, as well as every state that becomes active after that point.

When you call `addDomApiDetachListener`, your callback will be called every time a state is navigated away from.

Your callbacks will be passed one argument: the DOM API object for the state.

```js

const stateWatcher = makeAsrStateWatcher(stateRouter)

const removeAttachListener = magicalDomThingy.addDomApiAttachListener(domApi => {
	domApi.get() // the starting state, probably!
})

const removeDetachListener = magicalDomThingy.addDomApiDetachListener(domApi => {
	domApi.get() // the final state, presumably!
})

function cleanUp() {
	removeAttachListener()
	removeDetachListener()
}

```
