//Constantes du code 
const key = 'RGAPI-abb0b886-e2cb-4a56-8bba-744f725d6bff'
//Fin constantes


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
        //const key = 'RGAPI-abb0b886-e2cb-4a56-8bba-744f725d6bff'
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
                                }
                                else{
                                    card.setAttribute('class', "card bg-card-lose text-white mb-4 card-parties")
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

function afficheDetailsPartie(idPartie, idJoueur){

    document.getElementById("application").style.display = "none";
    document.getElementById("barre").style.display = "none";

    const descr = document.getElementById('description')
    //descr.innerHTML = ""

    var requestMatchId = new XMLHttpRequest()
    requestMatchId.open('GET','https://euw1.api.riotgames.com/lol/match/v4/matches/'+idPartie+'?api_key='+key, false)
    requestMatchId.onload = function(){
        //Récupération des détails de la game
        var gameData = JSON.parse(this.response)

        if(this.status == 200){
            var redKills = 0;
            var blueKills = 0;
            var redAssists = 0;
            var blueAssists = 0;
            var redDeaths = 0;
            var blueDeaths = 0;

            var redWin = false;

            for(var i=0 ; i<5 ; i++){
                redKills += gameData.participants[i+5].stats.kills
                blueKills += gameData.participants[i].stats.kills

                redAssists += gameData.participants[i+5].stats.assists
                blueAssists += gameData.participants[i].stats.assists

                redDeaths += gameData.participants[i+5].stats.deaths
                blueDeaths += gameData.participants[i].stats.deaths
            }
            //Création de l'en-tête de la page (quelle équipe a gagné + KDA d'équipe + type de la game et durée)
            var lVictoire = document.createElement('table')
            lVictoire.setAttribute('class','resumePartie')
            descr.appendChild(lVictoire)


            var souslVictoire = document.createElement('tr')
            lVictoire.appendChild(souslVictoire)

            var motDefaite = document.createElement('th')
            motDefaite.setAttribute('class', "thDefaite")
            motDefaite.textContent = 'Défaite'

            var motVictoire  = document.createElement('th')
            motVictoire.setAttribute('class','thVictoire')
            motVictoire.textContent = 'Victoire'

            if(gameData.teams[0].win == 'Win'){
                souslVictoire.appendChild(motVictoire)
            }
            else{
                souslVictoire.appendChild(motDefaite)
            }
            

            var kdaBlue = document.createElement('th')
            kdaBlue.textContent = blueKills.toString()+" / "+blueDeaths.toString()+" / "+blueAssists
            souslVictoire.appendChild(kdaBlue)

            var typeEtDuree = document.createElement('th')
            typeEtDuree.textContent = 'ranked solo/duo - 26min59'  //METTRE LE TYPE DE GAME + LA DUREE
            souslVictoire.appendChild(typeEtDuree)

            var kdaRed = document.createElement('th')
            kdaRed.textContent = redKills.toString()+" / "+redDeaths.toString()+" / "+redAssists
            souslVictoire.appendChild(kdaRed)

            if(gameData.teams[0].win == 'Win'){
                souslVictoire.appendChild(motDefaite)
            }
            else{
                souslVictoire.appendChild(motVictoire)
            }
            
            //Fin en-tête de la page

            //Création du tableau des scores
            var tableau = document.createElement('table')
            tableau.setAttribute('class', 'table')
            descr.appendChild(tableau)

                //Création de la première ligne du tableau
                var head = document.createElement('thead')
                //Recopiage du code HTML puisque cette partie est fixe
                if(gameData.teams[0].win == 'Fail'){//Défaite à gauche, victoire à droite
                    head.innerHTML = '<TR><th class=\"equipeGauche equipeDefaite\">Champion</th><th class=\"equipeGauche equipeDefaite\">Pseudo</th><th class=\"equipeGauche equipeDefaite\">K/D/A</th><th class=\"equipeGauche equipeDefaite\">CS</th><th class=\"tabSeparation equipeDefaite\">Gold</th><th class=\"equipeDroite equipeVictoire\">Gold</th><th class=\"equipeDroite equipeVictoire\">CS</th><th class=\"equipeDroite equipeVictoire\">K/D/A</th><th class=\"equipeDroite equipeVictoire\">Pseudo</th><th class=\"equipeDroite equipeVictoire\">Champion</th></TR>'
                }
                else{//Victoire à gauche, défaite à droite
                    head.innerHTML = '<TR><th class=\"equipeGauche equipeVictoire\">Champion</th><th class=\"equipeGauche equipeVictoire\">Pseudo</th><th class=\"equipeGauche equipeVictoire\">K/D/A</th><th class=\"equipeGauche equipeVictoire\">CS</th><th class=\"tabSeparation equipeVictoire\">Gold</th><th class=\"equipeDroite equipeDefaite\">Gold</th><th class=\"equipeDroite equipeDefaite\">CS</th><th class=\"equipeDroite equipeDefaite\">K/D/A</th><th class=\"equipeDroite equipeDefaite\">Pseudo</th><th class=\"equipeDroite equipeDefaite\">Champion</th></TR>'
                }
                tableau.appendChild(head)
                //Fin première ligne

                //Création corps du tableau
                var tBody = document.createElement('tbody')
                tableau.appendChild(tBody)
                    //Création des lignes
                    for(var i=0 ; i<5 ; i++){
                        var ligne = document.createElement('tr')
                        tBody.appendChild(ligne)

                        //Partie gauche
                        var gChampion = document.createElement('td')
                        gChampion.setAttribute('class',"equipeGauche")
                        gChampion.innerHTML = "<img class=\"img-fluid img-squareTab\" src=\"../data/champImg/"+gameData.participants[i].championId.toString()+".png\" alt=\"image du champion\"/>"
                        ligne.appendChild(gChampion)

                        var gPseudo = document.createElement('td')
                        gPseudo.setAttribute('class',"equipeGauche")
                        gPseudo.textContent = gameData.participantIdentities[i].player.summonerName
                        ligne.appendChild(gPseudo)

                        var gKDA = document.createElement('td')
                        gKDA.setAttribute('class',"equipeGauche")
                        gKDA.textContent = gameData.participants[i].stats.kills.toString()+" / "+gameData.participants[i].stats.deaths.toString()+" / "+gameData.participants[i].stats.assists.toString()
                        ligne.appendChild(gKDA)

                        var gCreep = document.createElement('td')
                        gCreep.setAttribute('class',"equipeGauche")
                        gCreep.textContent = (gameData.participants[i].stats.totalMinionsKilled + gameData.participants[i].stats.neutralMinionsKilled).toString()
                        ligne.appendChild(gCreep)

                        var gGold = document.createElement('td')
                        gGold.setAttribute('class',"tabSeparation")
                        gGold.textContent = gameData.participants[i].stats.goldEarned.toString()
                        ligne.appendChild(gGold)

                        if(gameData.participantIdentities[i].player.accountId == idJoueur){
                            gPseudo.setAttribute('class','equipeGauche ligneJoueur')
                            gCreep.setAttribute('class','equipeGauche ligneJoueur')
                            gKDA.setAttribute('class','equipeGauche ligneJoueur')
                            gGold.setAttribute('class','tabSeparation ligneJoueur ')
                        }
                        //Fin partie gauche

                        //Partie droite
                        var dGold = document.createElement('td')
                        dGold.setAttribute('class',"equipeDroite")
                        dGold.textContent = gameData.participants[i+5].stats.goldEarned.toString()
                        ligne.appendChild(dGold) 
                        
                        var dCreep = document.createElement('td')
                        dCreep.setAttribute('class',"equipeDroite")
                        dCreep.textContent = (gameData.participants[i+5].stats.totalMinionsKilled + gameData.participants[i+5].stats.neutralMinionsKilled).toString()
                        ligne.appendChild(dCreep)

                        var dKDA = document.createElement('td')
                        dKDA.setAttribute('class',"equipeDroite")
                        dKDA.textContent = gameData.participants[i+5].stats.kills.toString()+" / "+gameData.participants[i+5].stats.deaths.toString()+" / "+gameData.participants[i+5].stats.assists.toString()
                        ligne.appendChild(dKDA)

                        var dPseudo = document.createElement('td')
                        dPseudo.setAttribute('class',"equipeDroite")
                        dPseudo.textContent = gameData.participantIdentities[i+5].player.summonerName
                        ligne.appendChild(dPseudo)

                        var dChampion = document.createElement('td')
                        dChampion.setAttribute('class',"equipeDroite")
                        dChampion.innerHTML = "<img class=\"img-fluid img-squareTab\" src=\"../data/champImg/"+gameData.participants[i+5].championId.toString()+".png\" alt=\"image du champion\"/>"
                        ligne.appendChild(dChampion)

                        if(gameData.participantIdentities[i+5].player.accountId == idJoueur){
                            dPseudo.setAttribute('class','equipeDroite ligneJoueur')
                            dCreep.setAttribute('class','equipeDroite ligneJoueur')
                            dKDA.setAttribute('class','equipeDroite ligneJoueur')
                            dGold.setAttribute('class','equipeDroite ligneJoueur')
                        }
                                             
                        //Fin partie droite
                    }
                
                //Fin lignes
            //Fin corps du tableau
            //Création des 5 lignes (contenant chacune 2 joueurs -> un perdant et un gagnant)
        //Fin tableau des scores

        //Création détails
        }

        var bouton = document.createElement('button')
        var t = document.createTextNode("Retour");       // Créer un noeud textuel
        bouton.appendChild(t);

        bouton.setAttribute('class','btn-retour')
        bouton.setAttribute('onclick','retourApp()')
        //bouton.setAttribute('id','btnR')
        //document.getElementById("bouton").innerHTML="Retour"

        descr.appendChild(bouton)

        

        
    }

    requestMatchId.send()

    descr.scrollIntoView();
}




function retourApp(){
    document.getElementById("application").style.display = "flex";
    document.getElementById("barre").style.display = "block";
    document.getElementById("description").innerHTML =""

}



