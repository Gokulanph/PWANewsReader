
var APIKey = "c1bc494c90d34d028a4c3f17101cdb4d";

//Check for the service worker in navigator object, the register the service worker
if("serviceWorker" in navigator)
{
     window.addEventListener('load',() => {
        navigator.serviceWorker.register('serviceworker.js')
        .then(() => {console.log('Service Worker Registered successfully');})
        .catch((e) => {console.log('Service Worker Registeration failed' + e);});
     });

}

//INIT Method
window.addEventListener('load', e => {
    GetLatestNews();
});

//Fetches the latest news from NEWS API and appends it to the UI
async function GetLatestNews()
{
     var response = await fetch(`https://newsapi.org/v2/top-headlines?sources=bbc-news&apiKey=${APIKey}`);
     var jsonResponse = await response.json();
     var mainDOM = document.querySelector('.container');
     mainDOM.innerHTML = '';
     mainDOM.innerHTML = jsonResponse.articles.map(GetNewsTemplate).join('\n'); 
     var resultCountDOM = document.getElementById('newsCount');
     resultCountDOM.innerHTML = `Showing ${jsonResponse.totalResults} Results`;
}

function GetNewsTemplate(news)
{
    return `<div class="panel panel-default"> 
    <div class="panel-heading">
    <h2> ${news.title}.</h2>  
    </div> 
    <div class="panel-body">
     <h4> ${news.description} </h4>
    <div> <img src="${news.urlToImage}" /> </div>
    </div> 
    </div>`;
}

