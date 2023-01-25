# Secrets

Plusieurs variables secrètes sont necessaires pour faire fonctionner
le projet et doivent se trouver dans les services respectifs dans
un `.env`:

### API

* POSTGRES_USER
* POSTGRES_PORT
* CLIENT_ID
* CLIENT_SECRET

### WEBAPP

* REACT_APP_CLIENT_ID
* REACT_APP_REDIRECT_URI

### ALL

Il y a egalement un autre .env necessaire pour utiliser lerna,
a mettre a la racine du projet avec toutes les variables cités
plus haut.

* POSTGRES_USER
* POSTGRES_DB
* POSTGRES_PORT
* CLIENT_ID
* CLIENT_SECRET
* REACT_APP_CLIENT_ID
* REACT_APP_REDIRECT_URI