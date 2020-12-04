Primo progetto con node js, express e con Mongodb.
[Demo statica](https://demo-gestionale.herokuapp.com/)

Problema risolto:
  - Organizzare, catalogare e ordinare tutto ciò che serve a supporto di un archivio reale.

Funzioni del progetto:
  - Gestione clienti 
    - Dati anagrafici + Allegati Generali + Contatti
  - Gestione dei lavori per ogni cliente: 
    - Info sul lavoro + Allegati relativi ad ogni lavoro + Stato attuale  
  - Gestione quindi degli allegati:
    - Caricamento, apertura e/o download 
  - Tabelle funzionali con ricerca istantanea: 
    - Dentro le rispettive tabelle 
  
Ogni cliente viene organizzato in questa maniera:

<p align="center">
  <img width="460" height="400" src="/public/img/flow.svg">
</p>
  
Requisiti:
  - Nodejs
  - Mongodb
  - Una "GMAIL" valida per la gestione del recupero password

Installazione:
-Avviare il comando npm install per scaricare le dipendenze.
-Creare un file ".env" dove verranno indicate le variabili d'ambiente
    Esempio contenuto del file
      DB_STRING=mongodb://127.0.0.1:27017/Gestionale
      SECRET=ChiaveSuperSegreta
      MAIL=LaTuaMailDiProva
      PSW=PasswordDellaMailDiProva
      
- Creare una cartella "upload" 

-Dopo essersi assicurato che il servizio mongodb è in funzione,
 avviare la webapp con il comando "npm run dev"

 -Creare un account amministratore
   -"http://localhost:3000/register" 
   -"http://YOUR-LOCAL-IP:3000/register" 
