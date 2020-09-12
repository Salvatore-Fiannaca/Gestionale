Disponibile la [demo statica](https://demo-gestionale.herokuapp.com/)

Primo progetto con node js, express e con Mongodb.
Ho iniziato questo progetto, semplicemente per far pratica con questo linguaggio
e per toccare con mano la struttura di una webapp. Mi sono aiutato con un tema open source e l'ho riscritto per le mie esigenze.

Funzioni / Obiettivi del progetto:
  - Gestione clienti ( Dati anagrafici + Allegati Generali + Contatti )
  - Gestione dei lavori per ogni cliente ( Info sul lavoro + Allegati relativi ad ogni lavoro + Stato attuale ) 
  - Gestione quindi degli allegati ( Caricamento, Apertura e  Scaricamento )
  - Tabelle funzionali con ricerca istantanea ( dentro le rispettive tabelle )
  
Ogni clienti è organizzato e catalogato in questa maniera:
![Schema Clienti](/public/img/flow.svg)
  
Una volta scaricato, presupponendo che si abbia già installato e configurato:
  - Nodejs
  - Mongodb

Si puo avviare il comando " npm install " dentro la relativa cartella per scaricare le dipendenze.
Una volta scaricato tutte le dipendenze, si deve creare un file e una cartella:
  - File ".env" dove verranno indicate le variabili d'ambiente ( indirizzo del database + chiave segreta criptare le sessioni, email e password per inviare la password di recupero. )
    È già settato per un dominio "gmail", inserire solo la prima parte della mail.  
    Esempio contenuto file " .env "
      DB_STRING=mongodb://127.0.0.1:27017/Gestionale
      SECRET=ChiaveSuperSegreta
      MAIL=LaTuaMailDiProva
      PSW=PasswordDellaMailDiProva
      
  - Creare una cartella (sempre all'interno del progetto) rinominandola "upload" (ovviamente senza virgolette)

Fatto il tutto e dopo essersi assicurato che il servizio mongodb è in funzione,
si puo dare il comando " npm run dev "  o  " npm run start " per far partire la webapp.

Una volta fatto, visitare dal browser "http://localhost:3000/register" o "http://YOUR-LOCAL-IP:3000/register" e creare un account amministratore.

Chiaramente  non è completo ne completamente sicuro e affidabile, accetto comunque consigli o collaborazioni.
