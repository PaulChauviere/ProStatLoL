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
    barre.innerHTML = 'Voici les parties de ' + nomJoueur


    //Récupération de la zone d'affichage des parties
    const app = document.getElementById('application')
    app.innerHTML = "" //"clear" de l'affichage des parties
    app.style.display = 'flex'


    //Création de la requête pour le profile du joueur
    var requestSummoner = new XMLHttpRequest()
    var key = 'RGAPI-c7886d4f-adf6-46b1-8f6a-69b8af2d42b6'
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

            //Création de la requête pour l'historique des matchs
            var accountId = dataSummoner.accountId
            var requestMatchList = new XMLHttpRequest()
            requestMatchList.open('GET','https://euw1.api.riotgames.com/lol/match/v4/matchlists/by-account/'+accountId+'?api_key='+key, true)

            requestMatchList.onload = function(){
                var dataMatchList = JSON.parse(this.response)

                if(this.status == 200){

                    for(var i= 0; i<12 ;i++){

                        //Création de la requête pour les détails d'un match
                        var gameId      = dataMatchList.matches[i].gameId
                        var requestMatchId = new XMLHttpRequest()
                        requestMatchId.open('GET','https://euw1.api.riotgames.com/lol/match/v4/matches/'+gameId+'?api_key='+key, false)
                        requestMatchId.onload = function(){
                            var dataMatchId = JSON.parse(this.response)
                            if(this.status == 200){
                                //Récupération des données
                                var role        = dataMatchList.matches[i].role
                                var lane        = dataMatchList.matches[i].lane
                                var numChampion = dataMatchList.matches[i].champion

                                var date        = convertDateFormat( (new Date(dataMatchList.matches[i].timestamp).toString() ) )
                                var duree = toMinute(dataMatchId.gameDuration)
                                //Récupération des infos de victoire ou non
                                var participantIdentity = dataMatchId.participantIdentities.find(joueur => joueur.player.summonerName == dataSummoner.name)
                                var participant         = dataMatchId.participants.find(participant => participant.participantId == participantIdentity.participantId)
                                var teamId              = participant.teamId
                                var team                = dataMatchId.teams.find(team => team.teamId == teamId)


                                var kda =  participant.stats.kills.toString()+" / "+participant.stats.deaths.toString()+" / "+ participant.stats.assists.toString()


                                //Création des emplacements
                                var emplacement = document.createElement('div')
                                emplacement.setAttribute('class', "col-xl-4 col-md-6")
                                app.appendChild(emplacement)
                                //Création d'une card (-> partie)
                                var card = document.createElement('div')
                                if(team.win == "Win"){
                                    card.setAttribute('class', "card bg-card-win text-white mb-4 card-parties")
                                    console.log("vert")
                                }
                                else{
                                    card.setAttribute('class', "card bg-card-lose text-white mb-4 card-parties")
                                    console.log("rouge")
                                }
                                emplacement.appendChild(card)

                                //Création de la date de la card
                                var cardDate = document.createElement('div')
                                cardDate.setAttribute('class', "card-title1")
                                cardDate.textContent = date
                                card.appendChild(cardDate)

                                //Création de la durée de la card
                                var cardDuree = document.createElement('div')
                                cardDuree.setAttribute('class', "card-title2")
                                cardDuree.textContent = duree // ICI IL FAUDRA METTRE LA DUREE
                                cardDate.appendChild(cardDuree)



                                //Création de la zone champion (icone + KDA)
                                var cardChampion = document.createElement('div')
                                cardChampion.setAttribute('class', "champion")

                                cardChampion.innerHTML = "<img class=\"img-fluid img-square\" src=\"../data/champImg/"+numChampion+".png\" alt=\"image du champion\"/>"+ kda


                                card.appendChild(cardChampion)


                                //Création du footer
                                var footer = document.createElement('div')
                                footer.setAttribute('class', "card-footer d-flex align-items-center justify-content-between")
                                //Création du lien vers la partie
                                var lienPartie = document.createElement('a')
                                lienPartie.setAttribute('class',"small text-white stretched-link")
                                lienPartie.setAttribute('onclick', "afficheDetailsPartie("+gameId.toString()+", \""+accountId.toString()+"\")")
                                lienPartie.setAttribute('href', "#")
                                lienPartie.textContent = 'Voir les détails'
                                footer.appendChild(lienPartie)
                                ///Création de la flèche
                                var containerFleche = document.createElement('div')
                                containerFleche.setAttribute('class', "small text-white")
                                footer.appendChild(containerFleche)
                                var fleche = document.createElement('i')
                                fleche.setAttribute('class', "fas fa-angle-right")
                                containerFleche.appendChild(fleche)

                                card.appendChild(footer)





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

function afficheDetailsPartie(idJoueur, idPartie){
    const app = document.getElementById('application')
    app.innerHTML = "" //"clear" de l'affichage des parties
    // app.style.display = 'none'


}
