(() => {
  const setupEventListeners = () => {
    const searchField = $('input')
    const searchForm = $('form.search-form')
    const searchButton = $('#search-button')

    searchField.on("keyup", async event => {
      const searchTerm = $(event.currentTarget).val()   
      if (searchTerm.length === 1){
        searchField.prop('disabled', true)
        try {
          const result = await window.ApiService.searchPredictionData({
            keywords: searchTerm
          })
          const predictionData = parseData(result)
          searchField.prop('disabled', false)
          $("#search-term").autocomplete({
            source: predictionData
          })
        } catch (error) {
          $(`<div class="alert alert-danger col-sm-6 container text-center" role="alert">
               Sorry, something went wrong!
             </div>`).insertAfter("form")
          searchField.prop('disabled', true)
          searchButton.prop('disabled', true)
        }
      }

    })
  
    searchField.bind('input', () => searchButton.prop('disabled', !searchField.val()))
    
    searchForm.submit(() => {
      let searchTerm = $('input').val()
      $('input').val(sanitizeSearchString(searchTerm))
    })

  }



  const parseData = JSONResponse => {
    let searchPredictions = []
    JSONResponse['bestMatches'].forEach(value => searchPredictions.push(value['1. symbol'].concat(': ', value['2. name'])))
    return searchPredictions
  }

  const sanitizeSearchString = originalInput => {
    if (originalInput.length >= 5) {return originalInput.substring(0, originalInput.indexOf(":"))} else {return originalInput}
  }


  const init = () => {
    window.ApiService.apiHost('https://www.alphavantage.co')
    $('form').each(function() {
      this.reset()
    })
    setupEventListeners()
  }

  window.MinimalfolioSearchController = {
    init
  }
})()
