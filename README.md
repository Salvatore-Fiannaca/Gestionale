Primo progetto con node js, express e con Mongodb.
[Demo statica](https://demo-gestionale.herokuapp.com/)

### Requisiti:
  - Nodejs
  - Mongodb
  - Una "GMAIL" valida per il recupero password

### Installazione:
  - `npm install`
  - Creare un file ".env" dove verranno indicate le variabili d'ambiente. Esempio:
      - DB_STRING=mongodb://127.0.0.1:27017/Gestionale
      - SECRET=ChiaveSuperSegreta
      - MAIL=LaTuaMailDiProva
      - PSW=PasswordDellaMailDiProva
      
  - `npm run dev`
  -  Prima registrazione "http://localhost:3000/register" 


### Obiettivo del progetto:
  - Organizzare, catalogare e ordinare tutto ciò che serve a supporto di un archivio reale.

### Flusso dei dati:
<p align="center">
  <img width="460" height="400" src="/public/img/flow.svg">
</p>
