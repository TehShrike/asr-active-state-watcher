module.exports = function createStateWatcher(stateRouter) {
	const currentDomApis = {}
	const currentAttachListeners = []
	const currentDetachListeners = []

	function attachToState({ state, domApi }) {
		currentDomApis[state.name] = domApi
		currentAttachListeners.forEach(fn => fn(domApi))
	}

	function detachFromState({ state, domApi }) {
		if (!currentDomApis[state.name]) {
			console.error('detaching, but no current dom api for that name was found')
		}
		currentDetachListeners.forEach(fn => fn(domApi))
		delete currentDomApis[state.name]
	}

	stateRouter.on('afterCreateState', attachToState)
	stateRouter.on('afterResetState', attachToState)

	stateRouter.on('beforeResetState', detachFromState)
	stateRouter.on('beforeDestroyState', detachFromState)

	function addDomApiAttachListener(attachListener) {
		Object.keys(currentDomApis).forEach(stateName => attachListener(currentDomApis[stateName]))

		return addToArrayAndReturnRemover(currentAttachListeners, attachListener)
	}

	function addDomApiDetachListener(detachListener) {
		return addToArrayAndReturnRemover(currentDetachListeners, detachListener)
	}

	return {
		addDomApiAttachListener: addDomApiAttachListener,
		addDomApiDetachListener: addDomApiDetachListener
	}
}

function addToArrayAndReturnRemover(ary, thingy) {
	ary.push(thingy)

	return function removeListener() {
		var index = ary.indexOf(thingy)
		if (index !== -1) {
			ary.splice(index, 1)
		}
	}
}
