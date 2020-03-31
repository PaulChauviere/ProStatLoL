function convertDateFormat(uneDate){
    var chaineDate = uneDate.split(' ')
    switch(chaineDate[1]){
      case 'Jan': return (chaineDate[2]+'/01/'+chaineDate[3]+ ' à '+chaineDate[4].substring(0,5)); break;
      case 'Feb': return (chaineDate[2]+'/02/'+chaineDate[3]+ ' à '+chaineDate[4].substring(0,5)); break;
      case 'Mar': return (chaineDate[2]+'/03/'+chaineDate[3]+ ' à '+chaineDate[4].substring(0,5)); break;
      case 'Apr': return (chaineDate[2]+'/04/'+chaineDate[3]+ ' à '+chaineDate[4].substring(0,5)); break;
      case 'May': return (chaineDate[2]+'/05/'+chaineDate[3]+ ' à '+chaineDate[4].substring(0,5)); break;
      case 'Jun': return (chaineDate[2]+'/06/'+chaineDate[3]+ ' à '+chaineDate[4].substring(0,5)); break;
      case 'Jul': return (chaineDate[2]+'/07/'+chaineDate[3]+ ' à '+chaineDate[4].substring(0,5)); break;
      case 'Aug': return (chaineDate[2]+'/08/'+chaineDate[3]+ ' à '+chaineDate[4].substring(0,5)); break;
      case 'Sep': return (chaineDate[2]+'/09/'+chaineDate[3]+ ' à '+chaineDate[4].substring(0,5)); break;
      case 'Oct': return (chaineDate[2]+'/10/'+chaineDate[3]+ ' à '+chaineDate[4].substring(0,5)); break;
      case 'Nov': return (chaineDate[2]+'/11/'+chaineDate[3]+ ' à '+chaineDate[4].substring(0,5)); break;
      case 'Dec': return (chaineDate[2]+'/12/'+chaineDate[3]+ ' à '+chaineDate[4].substring(0,5)); break;
    }
    return 'ERROR_DATE_CONVERTION'
}//convertDateFormat


function toMinute(nbSec){
    var nbSeconde = nbSec % 60
    var nbMinute = nbSec/60
    text = Math.trunc(nbMinute) + 'min ' + nbSeconde +'s'
    return text
}//toMinute



function affichePartieCheck(){   
    var zoneRecherche = document.getElementById("zoneRecherche")
    if( !(zoneRecherche.value=="") ){
        afficheParties(zoneRecherche.value)
    }   
}


function afficheParties(nomJoueur){
    
    var cartes = document.getElementById("cartes");
    var imageTresh = document.getElementById("img")
    var msgBienvenue = document.getElementById("title")
    var msgLesCreateurs = document.getElementById("title2")
    var barre = document.getElementById("barre")
    
    

    cartes.style.display = 'none'
    imageTresh.style.display = 'none'
    msgLesCreateurs.style.display = 'none'
    msgBienvenue.style.display = 'none'
    barre.innerHTML = 'Voici vos parties'

    

    const app = document.getElementById('parties')
    app.innerHTML = "" //"clear" de l'affichage des parties
    app.style.display = 'flex'
    
    
    //Création de la requête pour le profile du joueur
    var requestSummoner = new XMLHttpRequest()
    var key = 'RGAPI-e7e07f02-da5c-4e51-b23f-14974c0faa88'
    var pseudo = nomJoueur
    requestSummoner.open('GET', 'https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/'+pseudo+'?api_key='+key, true)
    
    requestSummoner.onload = function() {
    // Begin accessing JSON data here
    var dataSummoner = JSON.parse(this.response)
    
    if (this.status == 200) {
            const p = document.createElement('p')
            const liste = document.createElement('ul')
            const test = document.createElement('p')
            p.textContent ="Joueur : " + dataSummoner.name +"\t Level : "+ dataSummoner.summonerLevel
            
            //Variables de récupération des données
            var role
            var lane
            var numChampion
            var gameId
            var date
            var participantIdentity
            var participant
            var teamId
            var team
            var text
            var duree

            //Variables d'édition
            var container 
            var card
            var cardTitle
            var cardDuree
            var cardChampion
            var imgChamp
            var txtKDA
            var footer 
            


            

            //Création de la requête pour l'historique des matchs
            var accountId = dataSummoner.accountId
            var requestMatchList = new XMLHttpRequest()
            requestMatchList.open('GET','https://euw1.api.riotgames.com/lol/match/v4/matchlists/by-account/'+accountId+'?api_key='+key, true)
    
            requestMatchList.onload = function(){
                var dataMatchList = JSON.parse(this.response)
    
                if(this.status == 200){
    
                    for(var i= 0; i<12 ;i++){
                        //Récupération des données
                        role        = dataMatchList.matches[i].role
                        lane        = dataMatchList.matches[i].lane
                        numChampion = dataMatchList.matches[i].champion
                        gameId      = dataMatchList.matches[i].gameId
                        date        = convertDateFormat( (new Date(dataMatchList.matches[i].timestamp).toString() ) )
                                             
            
                        //Création des emplacements 
                        emplacement = document.createElement('div')
                        emplacement.setAttribute('class', "col-xl-4 col-md-6")
                        app.appendChild(emplacement)
                        //Création d'une card (-> partie)
                        card = document.createElement('div')
                        card.setAttribute('class', "card bg-card text-white mb-4 card-parties")
                        emplacement.appendChild(card)

                        //Création de la date de la card
                        cardDate = document.createElement('div')
                        cardDate.setAttribute('class', "card-title1")
                        cardDate.textContent = date
                        card.appendChild(cardDate)

                        

                        //Création du champion
                        cardChampion = document.createElement('div')    
                        cardChampion.setAttribute('class', "champion")
                        //Création de l'image du champion
                        imgChamp = document.createElement("img")
                        imgChamp.setAttribute('class', "img-fluid img-square")
                        imgChamp.setAttribute('src', "./../data/champImg/"+numChampion+".png")
                        cardChampion.appendChild(imgChamp)
                        //Création du KDA
                        txtKDA = document.createElement('p')
                        txtKDA.setAttribute('class',"champion")
                        txtKDA.textContent = 'TEST KDA'
                        cardChampion.appendChild(txtKDA)
                        //cardChampion.textContent = "KDA TEST" //METTRE LE KDA
                        
                        card.appendChild(cardChampion)


                        


                        text = "Partie du "+ date +" | Role : " +role+" | Lane :"+lane + " | Numéro de champion :"+numChampion+" | Id de la partie : "+gameId+" | Victoire ou non : "
    
                        var requestMatchId = new XMLHttpRequest()
                        requestMatchId.open('GET','https://euw1.api.riotgames.com/lol/match/v4/matches/'+gameId+'?api_key='+key, false)
    
                        requestMatchId.onload = function(){
                            var dataMatchId = JSON.parse(this.response)
    
                            if(this.status == 200){
    
                                //Récupération des infos de victoire ou non
                                participantIdentity = dataMatchId.participantIdentities.find(joueur => joueur.player.summonerName == dataSummoner.name)
                                participant         = dataMatchId.participants.find(participant => participant.participantId == participantIdentity.participantId)
                                teamId              = participant.teamId
                                team                = dataMatchId.teams.find(team => team.teamId == teamId)
                                text += team.win
    
                                console.log(text)

                                duree = toMinute(dataMatchId.gameDuration)
                                //Création de la durée de la card
                                cardDuree = document.createElement('div')
                                cardDuree.setAttribute('class', "card-title2")
                                cardDuree.textContent = duree // ICI IL FAUDRA METTRE LA DUREE
                                cardDate.appendChild(cardDuree)
    
                            
    
                            } else {
                                console.log('Erreur dans le chargement des infos de la partie')
                            }
                        }
    
                        requestMatchId.send()
    
                    }
    
                } else {
                    console.log('Erreur dans le chargement de la liste des matchs')
                }
            }
            requestMatchList.send()

    
    
        } else {
            console.log('Erreur dans le chargement des infos du joueur')
        }
    }
    
    requestSummoner.send()
} 