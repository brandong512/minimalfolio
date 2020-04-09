(() => {
  let api = 'https://misconfigured-app.com/'
  const API_KEY = 'MR0Q0CNKR23G9D98'

  const apiHost = host => { api = host }
  const urlFor = resource => `${api}${resource}`

  const HTTP_OK = 200

  const throwResponseError = response => {
    const error = new Error(response.statusText)
    error.response = response
    throw error
  }

  const emitNativeError = error => {
    throw error
  }

  const statusCheck = successStatuses => response => {
    if (successStatuses.includes(response.status)) {
      return response
    } else {
      throwResponseError(response)
    }
  }

  const okCheck = statusCheck([HTTP_OK])

  const headers = {
    'Content-Type': 'application/json'
  }

  const paramsWithApiKey = params => {
    const result = new URLSearchParams(params)
    result.set('apikey', API_KEY)
    return result
  }

  const query = (resource, params) => fetch(`${urlFor(resource)}${paramsWithApiKey(params)}`, {
    headers
  }).then(okCheck, emitNativeError)
    .then(response => response.json())

  const searchPredictionData = params => query('/query?function=SYMBOL_SEARCH&', params)
  const stockData = params => query('/query?function=GLOBAL_QUOTE&', params)
  const graphData = params => query('/query?function=TIME_SERIES_MONTHLY&', params)

  window.ApiService = {
    apiHost,
    searchPredictionData,
    stockData,
    graphData
  }
})()
