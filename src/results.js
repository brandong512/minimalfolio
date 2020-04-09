(() => {

  const getStockSymbol = url => {
    const urlParamaters = new URLSearchParams(url)
    return urlParamaters.get('symbol')
  }

  const cleanStockData = JSONResponse => {
    let stockInfo = new Object()
    Object.keys(JSONResponse).map(key => {stockInfo[key.substring(4).replace(/ /g, '_')] = JSONResponse[key]})
    return stockInfo
  }

  const displayStockData = (stockInfo, allFields) => {
    allFields.map(value => $(`#${value}`).text(stockInfo[value]))
  }

  const formattedGraphData = JSONResponse => {
    let cleanData = [], data = Object.entries(JSONResponse)
    for (let i = 0; i < 12; i++) {cleanData.push(data[i])}

    let lastTwelveMonths = [], lastTwelveMonthPrices = []
    cleanData.reverse().forEach(value => {
      lastTwelveMonths.push(value[0]), lastTwelveMonthPrices.push(Number(value[1]['4. close']))
    })
    return [lastTwelveMonths, lastTwelveMonthPrices]

  }

  const loadData = async urlParamaters => {
    let quoteResult
    let graphResult
    const fields = ['name', 'price', 'change', 'change_percent', 'previous_close',
      'latest_trading_day', 'symbol', 'open', 'high', 'low']
    try {
      quoteResult = await window.ApiService.stockData({
        symbol: getStockSymbol(urlParamaters)
      })
      graphResult = await window.ApiService.graphData({
        symbol: getStockSymbol(urlParamaters)
      })
      const cleanGraphData = formattedGraphData(graphResult['Monthly Time Series'])
      populateChart(cleanGraphData[0], cleanGraphData[1])

      const data = cleanStockData(quoteResult["Global Quote"])
      displayStockData(data, fields)
      
    } catch (error) {
      if (quoteResult !== undefined && Object.prototype.hasOwnProperty.call(quoteResult, 'Note') ||
          graphResult !== undefined && Object.prototype.hasOwnProperty.call(graphResult, 'Note')) {
        $(`<div class="alert alert-warning col-sm-6 container text-center" role="alert">
              Sorry, you've reached the limit for the API!
            </div>`).insertBefore(".container")
      } else {
        $(`<div class="alert alert-danger col-sm-6 container text-center" role="alert">
                 Sorry, something went wrong!
               </div>`).insertBefore(".container")
      }

    }
  }

  const populateChart = (dates, closingPrices) => {

    new window.Chart(document.getElementById("myChart"), {
      type: 'line',
      data: {
        labels: dates,
        datasets: [{ 
          data: closingPrices,
          label: "Closing Price",
          borderColor: "#428bca",
          fill: false,
          lineTension: 0
        }
        ]
      },
      options: {
        title: {
          display: true,
          text: 'Closing Price for the Last Twelve Months'
        },
        aspectRatio: 1.8,
        responsiveAnimationDuration: 2,
        responsive: true
      }
    })
  }

  const init = () => {
    window.ApiService.apiHost('https://www.alphavantage.co')
    loadData(location.search)
  }

  window.MinimalfolioResultsController = {
    init,
    loadData,
    cleanStockData,
    displayStockData,
    formattedGraphData,
    populateChart
  }
})()
