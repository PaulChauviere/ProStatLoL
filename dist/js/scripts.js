//Constantes du code
const key = 'RGAPI-def873a0-a9a3-44d4-a29f-24731fa503b8'
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

function typeMatch(queueId){
    switch(queueId){
        case 0: return 'Partie personnalisée'; break;
        case 430: return '5vs5 aveugle'; break;
        case 420: return 'Classée solo/duo'; break;
        case 440: return 'Classée flexible'; break;
        case 840: return 'Coop vs IA'; break;
        case 850: return 'Coop vs IA'; break;
        case 400: return '5vs5 draft'; break;
        case 450: return '5vs5 ARAM'; break;
        case 1020: return 'One for all'; break;
        case 76: return 'URF'; break;
    }
    return "";
}

function typeQueueToId(queueType){
    switch(queueType){
        case 'RANKED_SOLO_5x5': return 420; break;
        case 'RANKED_FLEX_SR': return  440; break;
    }
    return "";
}



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

    var spinner = new Spinner().spin();
    app.appendChild(spinner.el);

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
            var encrId = dataSummoner.id
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
                                cardDuree.textContent = duree 
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
                                lienPartie.setAttribute('onclick', "afficheDetailsPartie("+gameId.toString()+", \""+accountId.toString()+"\",\"" + encrId.toString() + "\")")
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
                    spinner.stop();

                } else {
                    console.log('Erreur dans le chargement de la liste des matchs')
                }
            }
            requestMatchList.send()



        } else {
            spinner.stop();
            var msgErreur = document.createElement('div')
            msgErreur.setAttribute('class','text-center msgErreur')

            msgErreur.textContent = 'Ce nom d\'invocateur n\'existe pas'
            app.appendChild(msgErreur)
        }
    }

    requestSummoner.send()
}








function afficheDetailsPartie(idPartie, idJoueur,idCompte){

    document.getElementById("application").style.display = "none";
    document.getElementById("barre").style.display = "none";
    document.getElementById("zoneBarre").style.display = "none";

   

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
            typeEtDuree.textContent = typeMatch(gameData.queueId)+" - "+toMinute(gameData.gameDuration)  //METTRE LE TYPE DE GAME + LA DUREE
            console.log("id game :"+gameData.queueId)
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
            var indexPerso;
            var indexTeam;
            var nbCreepsTeam = 0;
            var nbDmgObjTeam = 0;
            var nbKillAssist = 0;
            var nbDmgChampionsEnemyTot = 0;
            var nbDeathsTot = 0;
            var scoreVisionTeam = 0;

            var nbCreepsTeamRed = 0;
            var nbDmgObjTeamRed = 0;
            var nbDmgChampionsEnemyRed = 0;
            var nbDeathsRed =0;
            var scoreVisionRed = 0;

            var nbCreepsTeamBlue = 0;
            var nbDmgObjTeamBlue = 0;
            var nbDmgChampionsEnemyBlue = 0;
            var nbDeathsBlue = 0;
            var scoreVisionBlue = 0;


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
                            indexPerso = i;
                            indexTeam = 100;
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
                            indexPerso = i+5;
                            indexTeam = 200;
                            dPseudo.setAttribute('class','equipeDroite ligneJoueur')
                            dCreep.setAttribute('class','equipeDroite ligneJoueur')
                            dKDA.setAttribute('class','equipeDroite ligneJoueur')
                            dGold.setAttribute('class','equipeDroite ligneJoueur')
                        }

                        
                        //Fin partie droite

                        //Calcul des variables d'équipe
                            nbCreepsTeamRed += gameData.participants[i+5].stats.totalMinionsKilled + gameData.participants[i+5].stats.neutralMinionsKilled
                            nbDmgObjTeamRed += gameData.participants[i+5].stats.damageDealtToObjectives
                            nbDmgChampionsEnemyRed += gameData.participants[i+5].stats.totalDamageDealtToChampions
                            nbDeathsRed += gameData.participants[i+5].stats.deaths
                            scoreVisionRed += gameData.participants[i+5].stats.visionScore

                            nbCreepsTeamBlue += gameData.participants[i].stats.totalMinionsKilled + gameData.participants[i].stats.neutralMinionsKilled
                            nbDmgObjTeamBlue += gameData.participants[i].stats.damageDealtToObjectives
                            nbDmgChampionsEnemyBlue += gameData.participants[i].stats.totalDamageDealtToChampions
                            nbDeathsBlue += gameData.participants[i].stats.deaths
                            scoreVisionBlue += gameData.participants[i].stats.visionScore


                        //Fin calcul des variables d'équipe
                    }

                
                
            //Fin tableau des scores

            //Création détails
            if(indexPerso <= 5){
                nbCreepsTeam = nbCreepsTeamBlue
                nbDmgObjTeam = nbDmgObjTeamBlue
                nbKill = blueKills
                nbDmgChampionsEnemyTot = nbDmgChampionsEnemyBlue
                nbDeathsTot = nbDeathsBlue
                scoreVisionTeam = scoreVisionBlue
            }
            else{
                nbCreepsTeam = nbCreepsTeamRed
                nbDmgObjTeam = nbDmgObjTeamRed
                nbKill = redKills
                nbDmgChampionsEnemyTot = nbDmgChampionsEnemyRed
                nbDeathsTot = nbDeathsRed
                scoreVisionTeam = scoreVisionRed
            }




            //Remplissage de la zone de détails
            var emplacementDetails = document.getElementById("details")

            var listeDetails = document.createElement('ol')
            listeDetails.setAttribute('class',"breadcrumb mb-4")
            listeDetails.setAttribute('id',"lstDtls")
            emplacementDetails.appendChild(listeDetails)

            var enTete = document.createElement('li')
            enTete.setAttribute('class','breadcrumb-item','barre')
            enTete.innerHTML = 'Voyons un peu tes statistiques ' + gameData.participantIdentities[indexPerso].player.summonerName + ' !'
            listeDetails.appendChild(enTete)

            // Remlissage image champion + rank + lane

            var requestRank = new XMLHttpRequest()
            requestRank.open('GET','https://euw1.api.riotgames.com/lol/league/v4/entries/by-summoner/'+idCompte+'?api_key='+key, false) // recupère rank 
            requestRank.onload = function(){
                var liste = document.getElementById("lstDtls")
                var rank =""
                var tier =""
                var lp 
                var dataRank = JSON.parse(this.response)
                dataRank.forEach(mode =>{  
                    if(gameData.queueId == typeQueueToId(mode.queueType)){
                        rank = mode.rank 
                        tier = mode.tier
                        lp = mode.leaguePoints
                    }
                    
                })

                var imageChamp = document.createElement('li')
                imageChamp.setAttribute('class','breadcrumb-item','barre')
                var role = gameData.participants[indexPerso].timeline.lane // Determine le role
                if(role == "BOTTOM" && gameData.participants[indexPerso].timeline.role == "DUO_CARRY")
                    role = "ADC"

                if(tier != ""){ //cas Partie classé
                    if(role != "NONE")
                        imageChamp.innerHTML = "<img class=\"img-fluid img-squareDetail\" src=\"../data/champImg/"+gameData.participants[indexPerso].championId.toString()+".png\" alt=\"image du champion\"/> <img class=\"img-fluid img-squareDetail\" src=\"../data/rangImg/"+tier+".png\" alt=\"image du role\"/> <img class=\"img-fluid img-squareDetail\" src=\"../data/posteImg/"+tier+role+".png\" alt=\"image du role\"/>"
                    else
                        imageChamp.innerHTML = "<img class=\"img-fluid img-squareDetail\" src=\"../data/champImg/"+gameData.participants[indexPerso].championId.toString()+".png\" alt=\"image du champion\"/> <img class=\"img-fluid img-squareDetail\" src=\"../data/rangImg/"+tier+".png\" alt=\"image du role\"/> <img class=\"img-fluid img-squareDetail\" src=\"../data/posteImg/"+role+".png\" alt=\"image du role\"/>"
                    liste.appendChild(imageChamp)
                    var infoRank = document.createElement('li')
                    infoRank.setAttribute('class','breadcrumb-item','barre')
                    infoRank.innerHTML = tier + " " + rank + "  -  " + lp + " LP"
                    liste.appendChild(infoRank)
                }
                    
                else{ //cas Partie non classé
                    imageChamp.innerHTML = "<img class=\"img-fluid img-squareDetail\" src=\"../data/champImg/"+gameData.participants[indexPerso].championId.toString()+".png\" alt=\"image du champion\"/> <img class=\"img-fluid img-squareDetail\" src=\"../data/posteImg/"+role+".png\" alt=\"image du role\"/>"
                    liste.appendChild(imageChamp)
                }
                    
            }
            requestRank.send()

            

            //Séparateur farming
            var separatorFarm = document.createElement('div')
            separatorFarm.setAttribute('class','separateur')
            var farm = document.createElement('p')
            farm.textContent = 'Farming'
            separatorFarm.appendChild(farm)
            listeDetails.appendChild(separatorFarm)

            //TABLE concernant le farming
                var tableauStatFarm = document.createElement('table')
                tableauStatFarm.setAttribute('class','statJoueur')
                listeDetails.appendChild(tableauStatFarm)
                
                //Début de la ligne creeps
                    var statCreeps = document.createElement('tr')
                    tableauStatFarm.appendChild(statCreeps)

                    var creepsTue = document.createElement('th')
                    creepsTue.setAttribute('class','th')
                    creepsTue.textContent = 'Creeps tués'

                    statCreeps.appendChild(creepsTue)

                    //Chiffre + Image
                    var nbCreepsTue = document.createElement('th')
                    nbCreepsTue.innerHTML = (gameData.participants[indexPerso].stats.totalMinionsKilled + gameData.participants[indexPerso].stats.neutralMinionsKilled).toString()+"<img class=\"img-fluid img-squareStat\" src=\"../data/ressourcesImg/minion.png\" alt=\"image du champion\">"
                    statCreeps.appendChild(nbCreepsTue)
                    //Fin chiffre + image

                    //Texte "Participation :"
                    var txtParticipationCreep = document.createElement('th')
                    txtParticipationCreep.setAttribute('class','th')
                    txtParticipationCreep.textContent = 'Participation :'
                    statCreeps.appendChild(txtParticipationCreep)
                    //Fin texte

                    //Création de la colonne
                    var barreProgCol = document.createElement('th')
                    barreProgCol.setAttribute('class','th')
                    statCreeps.appendChild(barreProgCol)
                    //Création de la div
                    var barreProgDiv = document.createElement('div')
                    barreProgDiv.setAttribute('class','pourcentage')
                    barreProgCol.appendChild(barreProgDiv)

                    var tauxCreepsTue = Math.trunc(((gameData.participants[indexPerso].stats.totalMinionsKilled + gameData.participants[indexPerso].stats.neutralMinionsKilled) / nbCreepsTeam)*100)
                
                   

                    var progressBarre = document.createElement('div')
                    progressBarre.setAttribute('class','progress-done progress-done-creep')

                    progressBarre.setAttribute('data-done',tauxCreepsTue) 
                    progressBarre.textContent = tauxCreepsTue.toString()+"%"
                    progressBarre.style.width = progressBarre.getAttribute('data-done') + '%';
                    progressBarre.style.opacity = 1;
                    barreProgDiv.appendChild(progressBarre)
                //Fin de la ligne creeps
            //Fin table farming


            //Séparateur objectifs
            var separatorObj = document.createElement('div')
            separatorObj.setAttribute('class','separateur')
            var obj = document.createElement('p')
            obj.textContent = 'Objectifs'
            separatorObj.appendChild(obj)
            listeDetails.appendChild(separatorObj)
            
            //TABLE concernant le farming
            var tableauStatObj = document.createElement('table')
            tableauStatObj.setAttribute('class','statJoueur')
            listeDetails.appendChild(tableauStatObj)
            
                //Début de la ligne dommages aux objectifs
                    //Création de la ligne
                    var ligneDmgObj = document.createElement('tr')
                    tableauStatObj.appendChild(ligneDmgObj)

                    var dmgObj = document.createElement('th')
                    dmgObj.setAttribute('class','th')
                    dmgObj.textContent = 'Dégats aux objectifs'
                    ligneDmgObj.appendChild(dmgObj)

                    //Chiffre + Image
                    var nbDmgObj = document.createElement('th')
                    nbDmgObj.innerHTML = (gameData.participants[indexPerso].stats.damageDealtToObjectives).toString()+"<img class=\"img-fluid img-squareStat\" src=\"../data/ressourcesImg/objectif.png\" alt=\"2 épées croisées\">"
                    ligneDmgObj.appendChild(nbDmgObj)
                    //Fin chiffre + image

                    //Texte "Participation :"
                    var txtParticipationDmgObj = document.createElement('th')
                    txtParticipationDmgObj.setAttribute('class','th')
                    txtParticipationDmgObj.textContent = 'Participation :'
                    ligneDmgObj.appendChild(txtParticipationDmgObj)
                    //Fin texte

                    //Création de la colonne
                    var barreProgColDmgObj = document.createElement('th')
                    barreProgColDmgObj.setAttribute('class','th')
                    ligneDmgObj.appendChild(barreProgColDmgObj)
                    //Création de la div
                    var barreProgDivDmgObj = document.createElement('div')
                    barreProgDivDmgObj.setAttribute('class','pourcentage')
                    barreProgColDmgObj.appendChild(barreProgDivDmgObj)

                    var tauxDmgObj = Math.trunc(((gameData.participants[indexPerso].stats.damageDealtToObjectives) / nbDmgObjTeam)*100)
                
                    

                    var progressBarreDmgObj = document.createElement('div')
                    progressBarreDmgObj.setAttribute('class','progress-done progress-done-degobj')

                    progressBarreDmgObj.setAttribute('data-done',tauxDmgObj) 
                    progressBarreDmgObj.textContent = tauxDmgObj.toString()+"%"
                    progressBarreDmgObj.style.width = progressBarreDmgObj.getAttribute('data-done') + '%';
                    progressBarreDmgObj.style.opacity = 1;
                    barreProgDivDmgObj.appendChild(progressBarreDmgObj)
                //Fin de la ligne dommages aux objectifs
            

            var separatorKda = document.createElement('div')
            separatorKda.setAttribute('class','separateur')
            var kda = document.createElement('p')
            kda.textContent = 'K/D/A'
            separatorKda.appendChild(kda)
            listeDetails.appendChild(separatorKda)
            
            //Début table Kill/Assist
                //Début de la ligne Kill/Assist
                    //Création de la ligne

                    var tableauStatKillAssist = document.createElement('table')
                    tableauStatKillAssist.setAttribute('class','statJoueur')
                    listeDetails.appendChild(tableauStatKillAssist)


                    var ligneKillAssist = document.createElement('tr')
                    tableauStatKillAssist.appendChild(ligneKillAssist)

                    var killAssist = document.createElement('th')
                    killAssist.setAttribute('class','th')
                    killAssist.textContent = 'Kill / Assistance'
                    ligneKillAssist.appendChild(killAssist)

                    //Chiffre + Image
                    var nbKillAssist = document.createElement('th')
                    nbKillAssist.innerHTML = (gameData.participants[indexPerso].stats.kills).toString()+"/" + (gameData.participants[indexPerso].stats.assists).toString() +"<img class=\"img-fluid img-squareStat\" src=\"../data/ressourcesImg/score.png\" alt=\"2 épées croisées\">"
                    ligneKillAssist.appendChild(nbKillAssist)
                    //Fin chiffre + image

                    //Texte "Participation :"
                    var txtParticipationKillAssist = document.createElement('th')
                    txtParticipationKillAssist.setAttribute('class','th')
                    txtParticipationKillAssist.textContent = 'Participation :'
                    ligneKillAssist.appendChild(txtParticipationKillAssist)
                    //Fin texte

                    //Création de la colonne
                    var barreProgColKillAssist = document.createElement('th')
                    barreProgColKillAssist.setAttribute('class','th')
                    ligneKillAssist.appendChild(barreProgColKillAssist)
                    //Création de la div
                    var barreProgDivKillAssist = document.createElement('div')
                    barreProgDivKillAssist.setAttribute('class','pourcentage')
                    barreProgColKillAssist.appendChild(barreProgDivKillAssist)

                    var tauxKillAssist = Math.trunc((((gameData.participants[indexPerso].stats.kills)+(gameData.participants[indexPerso].stats.assists)) / nbKill)*100)
                
                    

                    var progressBarreKillAssist = document.createElement('div')
                    progressBarreKillAssist.setAttribute('class','progress-done progress-done-kda')

                    progressBarreKillAssist.setAttribute('data-done',tauxKillAssist) 
                    progressBarreKillAssist.textContent = tauxKillAssist.toString()+"%"
                    progressBarreKillAssist.style.width = progressBarreKillAssist.getAttribute('data-done') + '%';
                    progressBarreKillAssist.style.opacity = 1;
                    barreProgDivKillAssist.appendChild(progressBarreKillAssist)
                //Fin de la ligne Kill/Assist
            //Fin table kill/assists
            
            //Début table Dommages aux champions ennemis
                //Début de la ligne Dommages aux champions ennemis
                    var tableauStatDamage = document.createElement('table')
                    tableauStatDamage.setAttribute('class','statJoueur')
                    listeDetails.appendChild(tableauStatDamage)
                    //Création de la ligne
                    var ligneDmgChampionsEnemy = document.createElement('tr')
                    tableauStatDamage.appendChild(ligneDmgChampionsEnemy)

                    var DmgChampionsEnemy = document.createElement('th')
                    DmgChampionsEnemy.setAttribute('class','th')
                    DmgChampionsEnemy.textContent = 'Dommages aux champions ennemies'
                    ligneDmgChampionsEnemy.appendChild(DmgChampionsEnemy)

                    //Chiffre + Image
                    var nbDmgChampionsEnemy = document.createElement('th')
                    nbDmgChampionsEnemy.innerHTML = (gameData.participants[indexPerso].stats.totalDamageDealtToChampions).toString()+"<img class=\"img-fluid img-squareStat\" src=\"../data/ressourcesImg/dmg.png\" alt=\"2 épées croisées\">"
                    ligneDmgChampionsEnemy.appendChild(nbDmgChampionsEnemy)
                    //Fin chiffre + image

                    //Texte "Participation :"
                    var txtParticipationDmgChampionsEnemy = document.createElement('th')
                    txtParticipationDmgChampionsEnemy.setAttribute('class','th')
                    txtParticipationDmgChampionsEnemy.textContent = 'Participation :'
                    ligneDmgChampionsEnemy.appendChild(txtParticipationDmgChampionsEnemy)
                    //Fin texte

                    //Création de la colonne
                    var barreProgColDmgChampionsEnemy = document.createElement('th')
                    barreProgColDmgChampionsEnemy.setAttribute('class','th')
                    ligneDmgChampionsEnemy.appendChild(barreProgColDmgChampionsEnemy)
                    //Création de la div
                    var barreProgDivDmgChampionsEnemy = document.createElement('div')
                    barreProgDivDmgChampionsEnemy.setAttribute('class','pourcentage')
                    barreProgColDmgChampionsEnemy.appendChild(barreProgDivDmgChampionsEnemy)

                    var tauxDmgChampionsEnemy = Math.trunc(((gameData.participants[indexPerso].stats.totalDamageDealtToChampions)/ nbDmgChampionsEnemyTot)*100)
                    
                    

                    var progressBarreDmgChampionsEnemy = document.createElement('div')
                    progressBarreDmgChampionsEnemy.setAttribute('class','progress-done progress-done-degchamp')

                    progressBarreDmgChampionsEnemy.setAttribute('data-done',tauxDmgChampionsEnemy) 
                    progressBarreDmgChampionsEnemy.textContent = tauxDmgChampionsEnemy.toString()+"%"
                    progressBarreDmgChampionsEnemy.style.width = progressBarreDmgChampionsEnemy.getAttribute('data-done') + '%';
                    progressBarreDmgChampionsEnemy.style.opacity = 1;
                    barreProgDivDmgChampionsEnemy.appendChild(progressBarreDmgChampionsEnemy)
                //Fin de la ligne dommages aux champions ennemies
            //Fin table dommages aux ennemis
            
            //Début table morts
                var tableauStatDeath = document.createElement('table')
                tableauStatDeath.setAttribute('class','statJoueur')
                listeDetails.appendChild(tableauStatDeath)
                //Début de la ligne Morts
                    //Création de la ligne
                    var ligneDeaths = document.createElement('tr')
                    tableauStatDeath.appendChild(ligneDeaths)

                    var deaths = document.createElement('th')
                    deaths.setAttribute('class','th')
                    deaths.textContent = 'Morts'
                    ligneDeaths.appendChild(deaths)

                    //Chiffre + Image
                    var nbDeaths = document.createElement('th')
                    nbDeaths.innerHTML = (gameData.participants[indexPerso].stats.deaths).toString()+"<img class=\"img-fluid img-squareStat\" src=\"../data/ressourcesImg/mort.png\" alt=\"2 épées croisées\">"
                    ligneDeaths.appendChild(nbDeaths)
                    //Fin chiffre + image

                    //Texte "Participation :"
                    var txtParticipationDeaths = document.createElement('th')
                    txtParticipationDeaths.setAttribute('class','th')
                    txtParticipationDeaths.textContent = 'Participation :'
                    ligneDeaths.appendChild(txtParticipationDeaths)
                    //Fin texte

                    //Création de la colonne
                    var barreProgColDeaths = document.createElement('th')
                    barreProgColDeaths.setAttribute('class','th')
                    ligneDeaths.appendChild(barreProgColDeaths)
                    //Création de la div
                    var barreProgDivDeaths = document.createElement('div')
                    barreProgDivDeaths.setAttribute('class','pourcentage')
                    barreProgColDeaths.appendChild(barreProgDivDeaths)

                    var tauxDeaths = Math.trunc(((gameData.participants[indexPerso].stats.deaths)/ nbDeathsTot)*100)
                    
                    var progressBarreDeaths = document.createElement('div')
                    progressBarreDeaths.setAttribute('class','progress-done progress-done-morts')

                    progressBarreDeaths.setAttribute('data-done',tauxDeaths) 
                    progressBarreDeaths.textContent = tauxDeaths.toString()+"%"
                    progressBarreDeaths.style.width = progressBarreDeaths.getAttribute('data-done') + '%';
                    progressBarreDeaths.style.opacity = 1;
                    barreProgDivDeaths.appendChild(progressBarreDeaths)
                //Fin de la ligne morts
            //Fin table mort

            var separatorVision = document.createElement('div')
            separatorVision.setAttribute('class','separateur')
            var vision = document.createElement('p')
            vision.textContent = 'Vision'
            separatorVision.appendChild(vision)
            listeDetails.appendChild(separatorVision)

            //TABLE concernant la vision
                var tableaustatVision = document.createElement('table')
                tableaustatVision.setAttribute('class','statJoueur')
                listeDetails.appendChild(tableaustatVision)
                
                //Début de la ligne Vision
                    var statVision = document.createElement('tr')
                    tableaustatVision.appendChild(statVision)

                    var txtVision = document.createElement('th')
                    txtVision.setAttribute('class','th')
                    txtVision.textContent = 'Score de vision'

                    statVision.appendChild(txtVision)

                    //Chiffre + Image
                    var scoreVision = document.createElement('th')
                    scoreVision.innerHTML = (gameData.participants[indexPerso].stats.visionScore).toString()+"<img class=\"img-fluid img-squareStat\" src=\"../data/ressourcesImg/ward.png\" alt=\"image du champion\">"
                    statVision.appendChild(scoreVision)
                    //Fin chiffre + image

                    //Texte "Participation :"
                    var txtParticipationVision = document.createElement('th')
                    txtParticipationVision.setAttribute('class','th')
                    txtParticipationVision.textContent = 'Participation :'
                    statVision.appendChild(txtParticipationVision)
                    //Fin texte

                    //Création de la colonne
                    var barreProgColVision = document.createElement('th')
                    barreProgColVision.setAttribute('class','th')
                    statVision.appendChild(barreProgColVision)
                    //Création de la div
                    var barreProgDivVision = document.createElement('div')
                    barreProgDivVision.setAttribute('class','pourcentage')
                    barreProgColVision.appendChild(barreProgDivVision)

                    var tauxVision = Math.trunc(((gameData.participants[indexPerso].stats.visionScore) / scoreVisionTeam)*100)
                
                   

                    var progressBarreVision = document.createElement('div')
                    progressBarreVision.setAttribute('class','progress-done progress-done-creep')

                    progressBarreVision.setAttribute('data-done',tauxVision) 
                    progressBarreVision.textContent = tauxVision.toString()+"%"
                    progressBarreVision.style.width = progressBarreVision.getAttribute('data-done') + '%';
                    progressBarreVision.style.opacity = 1;
                    barreProgDivVision.appendChild(progressBarreVision)
                //Fin de la ligne Vision
            //Fin table Vision


        }//Fin if(this.status == 200)

        var divBouton = document.createElement('div')
        divBouton.setAttribute('class',"divBouton")
        emplacementDetails.appendChild(divBouton)

        var bouton = document.createElement('button')
        var t = document.createTextNode("Retour");       // Créer un noeud textuel
        bouton.appendChild(t);

        bouton.setAttribute('class','btn-retour')
        bouton.setAttribute('onclick','retourApp()')

        divBouton.appendChild(bouton)

    }

    requestMatchId.send()

    descr.scrollIntoView();
}




function retourApp(){
    document.getElementById("zoneBarre").style.display = "flex";
    document.getElementById("barre").style.display = "flex";
    
    document.getElementById("application").style.display = "flex";
    
    document.getElementById("description").innerHTML =""
    document.getElementById("details").innerHTML =""
    
}
