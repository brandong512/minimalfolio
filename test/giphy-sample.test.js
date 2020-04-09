describe('Minimalfolio stock search example', () => {
  beforeEach(() => {
    fixture.setBase('test')
    fixture.load('search.fixture.html')
    window.MinimalfolioSearchController.init()
  })

  afterEach(() => fixture.cleanup())

  it('should start with an empty search field', () => expect($('#search-term').val()).toBe(''))
  it('should start with a disabled search button', () => expect($('#search-button').prop('disabled')).toBe(true))

  describe('search button', () => {
    let searchTerm
    let searchButton
    let searchForm 

    beforeEach(() => {
      searchTerm = $('#search-term')
      searchButton = $('#search-button')
      searchForm = $('form.search-form')
      $('form').on('submit', () => {return false})
    })

    it('should be enabled when the search field is not blank', () => {
      searchTerm.val('AAPL').trigger('input')
      expect(searchButton.prop('disabled')).toBe(false)
    })

    it('should be disabled when the search field is blank', () => {
      searchTerm.val('').trigger('input')
      expect(searchButton.prop('disabled')).toBe(true)
    })

    it('should shorten string to 5 characters or less, when the submit button is clicked', () =>{
      searchTerm.val('AAPL: Apple Inc.').trigger('input')
      $('form.search-form').submit()
      expect(searchTerm.val().length).toBeLessThan(6)
    })

  })

  describe('API calls', () => {
    beforeEach(() => {
      sinon.stub(window.ApiService, 'searchPredictionData')
      $('form').on('submit', () => {return false})

      window.ApiService.searchPredictionData.returns(Promise.resolve({
        "bestMatches": [
        {
          "1. symbol": "BA",
          "2. name": "The Boeing Company",
          "3. type": "Equity",
          "4. region": "United States",
          "5. marketOpen": "09:30",
          "6. marketClose": "16:00",
          "7. timezone": "UTC-04",
          "8. currency": "USD",
          "9. matchScore": "1.0000"
        },
        {
          "1. symbol": "BABA",
          "2. name": "Alibaba Group Holding Limited",
          "3. type": "Equity",
          "4. region": "United States",
          "5. marketOpen": "09:30",
          "6. marketClose": "16:00",
          "7. timezone": "UTC-04",
          "8. currency": "USD",
          "9. matchScore": "0.8000"
        },
        {
          "1. symbol": "BAC",
          "2. name": "Bank of America Corporation",
          "3. type": "Equity",
          "4. region": "United States",
          "5. marketOpen": "09:30",
          "6. marketClose": "16:00",
          "7. timezone": "UTC-04",
          "8. currency": "USD",
          "9. matchScore": "0.6667"
        },
        {
          "1. symbol": "BLDP",
          "2. name": "Ballard Power Systems Inc.",
          "3. type": "Equity",
          "4. region": "United States",
          "5. marketOpen": "09:30",
          "6. marketClose": "16:00",
          "7. timezone": "UTC-04",
          "8. currency": "USD",
          "9. matchScore": "0.5000"
        },
        {
          "1. symbol": "BIDU",
          "2. name": "Baidu Inc.",
          "3. type": "Equity",
          "4. region": "United States",
          "5. marketOpen": "09:30",
          "6. marketClose": "16:00",
          "7. timezone": "UTC-04",
          "8. currency": "USD",
          "9. matchScore": "0.4000"
        },
        {
          "1. symbol": "GOLD",
          "2. name": "Barrick Gold Corporation",
          "3. type": "Equity",
          "4. region": "United States",
          "5. marketOpen": "09:30",
          "6. marketClose": "16:00",
          "7. timezone": "UTC-04",
          "8. currency": "USD",
          "9. matchScore": "0.4000"
        },
        {
          "1. symbol": "BHC",
          "2. name": "Bausch Health Companies Inc.",
          "3. type": "Equity",
          "4. region": "United States",
          "5. marketOpen": "09:30",
          "6. marketClose": "16:00",
          "7. timezone": "UTC-04",
          "8. currency": "USD",
          "9. matchScore": "0.3333"
        },
        {
          "1. symbol": "BK",
          "2. name": "The Bank of New York Mellon Corporation",
          "3. type": "Equity",
          "4. region": "United States",
          "5. marketOpen": "09:30",
          "6. marketClose": "16:00",
          "7. timezone": "UTC-04",
          "8. currency": "USD",
          "9. matchScore": "0.3333"
        },
        {
          "1. symbol": "SAN",
          "2. name": "Banco Santander, S.A.",
          "3. type": "Equity",
          "4. region": "United States",
          "5. marketOpen": "09:30",
          "6. marketClose": "16:00",
          "7. timezone": "UTC-04",
          "8. currency": "USD",
          "9. matchScore": "0.1538"
        }
        ]
      }))


      $('input').val('B')
      $('input').keyup()
      $('input').val('BA')
      $('input').keyup()
      $('form.search-form').submit()
    })

    afterEach(() => window.ApiService.searchPredictionData.restore())

    it('should trigger a search prediction lookup based on the first character', () =>
      expect(window.ApiService.searchPredictionData.firstCall.args[0]).toEqual({
        // function: 'SYMBOL_SEARCH',
        keywords: 'B'
      })
      )

    describe('failed API calls', () => {
    beforeEach(() => {
      window.ApiService.searchPredictionData.returns(Promise.reject('Mock failure'))
    })

    it('should display an alert when the API call fails', done => setTimeout(() => {
      expect($('.alert').length > 0).toBe(true)
      done()
    }, 250))
  })
})
})


describe('Minimalfolio results page', () => {
  beforeEach(() => {
    fixture.setBase('test')
    fixture.load('results.fixture.html')
    window.MinimalfolioResultsController.init()
  })

  afterEach(() => fixture.cleanup())



  describe('failed API calls', () => {
    beforeEach(() => {
      sinon.stub(window.ApiService, 'graphData')
      window.ApiService.graphData.returns(Promise.reject({"Note": "Thank you for using Alpha Vantage! Our standard..."}))

    })

    // afterEach(() => window.ApiService.graphData.restore())

    it('should display an alert when the API call fails', done => setTimeout(() => {
      // window.MinimalfolioResultsController.loadData('?symbol=AAPL')
      expect($('.alert').length > 0).toBe(true)
      done()
    }, 2000))

  })


  describe('API calls', () => {
    beforeEach(() => {
      sinon.stub(window.ApiService, 'stockData')

      window.ApiService.stockData.returns(Promise.resolve({
        "Global Quote": {
          "01. symbol": "AAPL",
          "02. open": "234.5900",
          "03. high": "237.5800",
          "04. low": "234.2900",
          "05. price": "236.4100",
          "06. volume": "21772221",
          "07. latest trading day": "2019-10-18",
          "08. previous close": "235.2800",
          "09. change": "1.1300",
          "10. change percent": "0.4803%"
        }
      }))

    })

    afterEach(() => window.ApiService.stockData.restore())

    it('should trigger a quote response when page loads', done => setTimeout(() => {
      window.MinimalfolioResultsController.loadData('?symbol=AAPL')
      expect(window.ApiService.stockData.firstCall.args[0]).toEqual({
        // function: 'GLOBAL_QUOTE',
        symbol:  'AAPL'
      })
      done()
    }, 250))


    describe('displaying & sanitizing data', () => {
      let mockGraphData
      let mockDataQuote
      let dates
      let prices

      beforeEach(() => {
        mockDataQuote = {
          "Global Quote": {
          "01. symbol": "AAPL",
          "02. open": "234.5900",
          "03. high": "237.5800",
          "04. low": "234.2900",
          "05. price": "236.4100",
          "06. volume": "21772221",
          "07. latest trading day": "2019-10-18",
          "08. previous close": "235.2800",
          "09. change": "1.1300",
          "10. change percent": "0.4803%"
        }
        }

        mockGraphData = {
          "Meta Data": {
            "1. Information": "Monthly Prices (open, high, low, close) and Volumes",
            "2. Symbol": "MSFT",
            "3. Last Refreshed": "2019-10-24",
            "4. Time Zone": "US/Eastern"
          },
          "Monthly Time Series": {
            "2019-10-24": {
              "1. open": "139.6600",
              "2. high": "141.7900",
              "3. low": "133.2200",
              "4. close": "139.9400",
              "5. volume": "421997381"
            },
            "2019-09-30": {
              "1. open": "136.6100",
              "2. high": "142.3700",
              "3. low": "134.5100",
              "4. close": "139.0300",
              "5. volume": "472544800"
            },
            "2019-08-30": {
              "1. open": "137.0000",
              "2. high": "140.9400",
              "3. low": "130.7800",
              "4. close": "137.8600",
              "5. volume": "584482000"
            },
            "2019-07-31": {
              "1. open": "136.6300",
              "2. high": "141.6800",
              "3. low": "134.6700",
              "4. close": "136.2700",
              "5. volume": "484079900"
            },
            "2019-06-28": {
              "1. open": "123.8500",
              "2. high": "138.4000",
              "3. low": "119.0100",
              "4. close": "133.9600",
              "5. volume": "508324300"
            },
            "2019-05-31": {
              "1. open": "130.5300",
              "2. high": "130.6500",
              "3. low": "123.0400",
              "4. close": "123.6800",
              "5. volume": "547218800"
            },
            "2019-04-30": {
              "1. open": "118.9500",
              "2. high": "131.3700",
              "3. low": "118.1000",
              "4. close": "130.6000",
              "5. volume": "433157700"
            },
            "2019-03-29": {
              "1. open": "112.8900",
              "2. high": "120.8200",
              "3. low": "108.8000",
              "4. close": "117.9400",
              "5. volume": "589095800"
            },
            "2019-02-28": {
              "1. open": "103.7750",
              "2. high": "113.2400",
              "3. low": "102.3500",
              "4. close": "112.0300",
              "5. volume": "469095900"
            },
            "2019-01-31": {
              "1. open": "99.5500",
              "2. high": "107.9000",
              "3. low": "97.2000",
              "4. close": "104.4300",
              "5. volume": "714212800"
            },
            "2018-12-31": {
              "1. open": "113.0000",
              "2. high": "113.4200",
              "3. low": "93.9600",
              "4. close": "101.5700",
              "5. volume": "944314600"
            },
            "2018-11-30": {
              "1. open": "107.0500",
              "2. high": "112.2409",
              "3. low": "99.3530",
              "4. close": "110.8900",
              "5. volume": "720228600"
            },
            "2018-10-31": {
              "1. open": "114.7500",
              "2. high": "116.1796",
              "3. low": "100.1100",
              "4. close": "106.8100",
              "5. volume": "927548000"
            },
            "2018-09-28": {
              "1. open": "110.8500",
              "2. high": "115.2900",
              "3. low": "107.2300",
              "4. close": "114.3700",
              "5. volume": "480255500"
            },
            "2018-08-31": {
              "1. open": "106.0300",
              "2. high": "112.7770",
              "3. low": "104.8400",
              "4. close": "112.3300",
              "5. volume": "456628100"
            },
            "2018-07-31": {
              "1. open": "98.1000",
              "2. high": "111.1500",
              "3. low": "98.0003",
              "4. close": "106.0800",
              "5. volume": "569352300"
            },
            "2018-06-29": {
              "1. open": "99.2800",
              "2. high": "102.6900",
              "3. low": "97.2600",
              "4. close": "98.6100",
              "5. volume": "602585200"
            },
            "2018-05-31": {
              "1. open": "93.2100",
              "2. high": "99.9900",
              "3. low": "92.4500",
              "4. close": "98.8400",
              "5. volume": "509417900"
            },
            "2018-04-30": {
              "1. open": "90.4584",
              "2. high": "97.9000",
              "3. low": "87.5100",
              "4. close": "93.5200",
              "5. volume": "668130700"
            },
            "2018-03-29": {
              "1. open": "93.9900",
              "2. high": "97.2400",
              "3. low": "87.0800",
              "4. close": "91.2700",
              "5. volume": "750754800"
            },
            "2018-02-28": {
              "1. open": "94.7900",
              "2. high": "96.0700",
              "3. low": "83.8357",
              "4. close": "93.7700",
              "5. volume": "725663300"
            },
            "2018-01-31": {
              "1. open": "86.1250",
              "2. high": "95.4500",
              "3. low": "85.5000",
              "4. close": "95.0100",
              "5. volume": "574258400"
            }
          }
        }

        dates = ['2018-11-30', '2018-12-31', '2019-01-31', '2019-02-28', '2019-03-29', '2019-04-30', '2019-05-31', '2019-06-28', '2019-07-31', '2019-08-30', '2019-09-30', '2019-10-24']
        prices = [110.89, 101.57, 104.43, 112.03, 117.94, 130.6, 123.68, 133.96, 136.27, 137.86, 139.03, 139.94]


      })

      it('properly formats data into array for use with graph', () => {
        expect(window.MinimalfolioResultsController.formattedGraphData(mockGraphData['Monthly Time Series'])[1].length).toBe(12)
      })

      it('properly adds a new chart with properly formatted data', () => {
        window.MinimalfolioResultsController.populateChart(dates, prices)
        expect($('.chartjs-size-monitor').length).toBe(1)
      }) 

      it('properly sanitizes data when the function cleanStockData is called on response', () => {
        expect(window.MinimalfolioResultsController.cleanStockData(mockDataQuote['Global Quote']).hasOwnProperty('symbol')).toEqual(true)
      })

      it('properly maps data when displayStockData called', () => {
        const fields = ['name', 'price', 'change', 'change_percent', 'previous_close', 'latest_trading_day', 'symbol', 'open', 'high', 'low']
        let cleanData = window.MinimalfolioResultsController.cleanStockData(mockDataQuote['Global Quote'])
        
        window.MinimalfolioResultsController.displayStockData(cleanData, fields)
        
        expect($('#open').text()).toEqual(cleanData['open'])
      })


    })
  })    

})