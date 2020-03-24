const app = document.getElementById('root')

const container = document.createElement('div')
container.setAttribute('class', 'container')

app.appendChild(container)

var request = new XMLHttpRequest()
var url = 'https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/The%20Xytoz'
var key = 'api_key='+'RGAPI-f23e7642-dde7-4ce6-9ff9-e8ef1c751f26'
request.open('GET', url+'?'+key, true)
request.onload = function() {
   // Begin accessing JSON data here
   var data = JSON.parse(this.response)
  
   if (true) {
     
     
       
 
     const p = document.createElement('p')
     p.textContent = data.accountId
     var accountId = data.accountId
 
    
 
     container.appendChild(p)
       
    
   } else {
     const errorMessage = document.createElement('h1')
     errorMessage.textContent = `Gah, it's not working!`
     app.appendChild(errorMessage)
   }
}

request.send()
