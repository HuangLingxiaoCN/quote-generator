const quoteContainer = document.getElementById('quote-container');
const quoteText = document.getElementById('quote');
const authorText = document.getElementById('author');
const twitterBtn = document.getElementById('twitter');
const newQuoteBtn = document.getElementById('new-quote');
const loader = document.getElementById('loader');
let errorCounter = 0;

function showLoadingSpinner() {
  // HTML element property "hidden" is a boolean value
  // which is true if the element is hidden; otherwise the value is false. 
  loader.hidden = false;
  quoteContainer.hidden = true;
}

function removeLoadingSpinner() {
  // if loader.hidden is false
  if (!loader.hidden) {
    quoteContainer.hidden = false;
    loader.hidden = true;
  }
}

// Get Quote From API
async function getQuote() {
  showLoadingSpinner();
  // We need to use a Proxy URL to make our API call in order to avoid a CORS error
  const proxyUrl = 'https://desolate-lake-64422.herokuapp.com/';
  const apiUrl = 'https://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=json';
  try {
    const response = await fetch(proxyUrl + apiUrl);
    const data = await response.json();
    // Check if Author field is blank and replace it with 'Unknown'
    if (data.quoteAuthor === '') {
      // innerText (similar to innerHTML and textContent), but it 
      // overlooks spacing and inner element tags
      authorText.innerText = 'Unknown';
    } else {
      authorText.innerText = data.quoteAuthor;
    }
    // Dynamically reduce font size for long quotes
    if (data.quoteText.length > 120) {
      quoteText.classList.add('long-quote');
    } else {
      quoteText.classList.remove('long-quote');
    }
    quoteText.innerText = data.quoteText;
    removeLoadingSpinner();
  } catch (error) {
    errorCounter++;
    // Add fetch failure limits to 10
    // When it reaches 10, display error message
    // and reset error number.
    if(errorCounter < 10){
      console.log('oops',error);
      getQuote();
    }
    else {
      quoteText.innerText = 'Something goes wrong';
      authorText.innerText = '';
      removeLoadingSpinner();
      errorCounter = 0;
    }
  }
}

// Tweet Quote
function tweetQuote() {
  const quote = quoteText.innerText;
  const author = authorText.innerText;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${quote} - ${author}`;
  // window.open() method opens a new browser tab or window
  window.open(twitterUrl, '_blank');
}

// Event Listeners
newQuoteBtn.addEventListener('click', getQuote);
twitterBtn.addEventListener('click', tweetQuote);

// On Load
getQuote();
