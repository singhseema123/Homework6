// Initial array of stocks
let stocks = ['FB', 'AAPL', 'TSLA', 'GOOG'];

// displaystockInfo function re-renders the HTML to display the appropriate content
const displaystockInfo = function () {

  const stock = $(this).attr('data-name');
  const queryURL = `https://api.iextrading.com/1.0/stock/${stock}/batch?types=quote,logo,news&range=12m&last=12`;

  // Creates AJAX call for the specific stock button being clicked
  $.ajax({
    url: queryURL,
    method: 'GET'
  }).then(function(response) {
    
  console.log(response);
  $('.stocktabbody').append("<tr><td>Company Name: " + response.quote.companyName + "</td></tr>");

  $('.stocktabbody').append("<tr><td>Symbol: " + response.quote.symbol + "</td></tr>");
   
    const stockLogo = response.logo.url;
    const logoHolder = `<img src=${stockLogo}>`;
    $('.stocktabbody').append("<tr><td>Logo: " + logoHolder + "</td></tr>");
  
    
    $('.stocktabbody').append("<tr><td>Price: " + response.quote.latestPrice + "</td></tr>");

    for (let i=0; i<response.news.length; i++)
    {
      $('.stocktabbody').append("<tr><td>News: " +response.news[i].summary + "</td></tr>" );
    }
    $('.stocktabbody').append("<tr> <td> </td></tr>");
  });
 
}

// Function for displaying stock data
const render = function () {

  // Deletes the stocks prior to adding new stocks
  // (this is necessary otherwise you will have repeat buttons)
  $('#buttons-view').empty();
  // Loops through the array of stocks
  for (let i = 0; i < stocks.length; i++) {

    // Then dynamicaly generates buttons for each stock in the array
    // This code $("<button>") is all jQuery needs to create the beginning and end tag. (<button></button>)
    let newButton = $('<button>');
    // Adds a class of stock to our button
    newButton.addClass('stock');
    // Added a data-attribute
    newButton.attr('data-name', stocks[i]);
    // Provided the initial button text
    newButton.text(stocks[i]);
    // Added the button to the buttons-view div
    $('#buttons-view').append(newButton);
  }
}

// This function handles events where one button is clicked
const addButton = function(event) {

  // event.preventDefault() prevents the form from trying to submit itself.
  // We're using a form so that the user can hit enter instead of clicking the button if they want
  event.preventDefault();

  // This line will grab the text from the input box
  const stock = ($('#stock-input').val().trim()).toUpperCase();
  
  // if the stock from the textbox is valid, then added to our array
  if (validationList.indexOf(stock) > -1 )
  {
    stocks.push(stock);
  }
  else
    alert("Not a valid stock. Please try again");
  // Deletes the contents of the input
  $('#stock-input').val('');

  // calling render which handles the processing of our stock array
  render();
}


// Get list of all stocksymbols
let validationList = [];
const setValidationList = function()
{
  const allSymbols = `https://api.iextrading.com/1.0/ref-data/symbols`;
  $.ajax({
    url: allSymbols,
    method: 'GET'
  }).then(function(response) {
    console.log(response.length);
    for (let i=0; i<response.length; i++)
    {
      validationList.push(response[i].symbol);
    }
    console.log(validationList);
    
  });

}

const clearStockDetails = function()
{
  $('.stocktabbody').empty();
}

setValidationList();

// Event listener for #add-stock button
$('#add-stock').on('click', addButton);

// Adding click event listeners to all elements with a class of "stock"
$('#buttons-view').on('click', '.stock', displaystockInfo);

// Event listener for clear button
$('#clear').on('click', clearStockDetails);

// Calling the render function to display the intial buttons
render();
