# Installation

## Sources

Envoyez les sources de ce repository sur votre serveur, dans le futur dossier du projet.

Par exemple dans `/var/www/{DOMAINE}` (Prenez bien soin de **toujours remplacer `{DOMAINE}`** par le nom de domaine assigné à votre projet).

## Node.js et NPM

Voir la [doc interne](https://docs.webart.space/nodejs/installation/) à ce sujet.

## Certificat de sécurité

- Faites pointez votre nom de domaine vers le serveur, à l'aide d'un champ "A" ou "CNAME".

- Installez CertBot ([avec Debian 9](https://docs.webart.space/server/debian9-from-scratch/#certbot-sous-nginx)).

- Dépoyez un certificat pour votre domaine sans modifier les vHosts (paramètre `certonly`)
```bash
certbot certonly -d {DOMAINE}
```

## Nginx

Un vHost d'exemple est disponible à la racine du projet.

- Installez Nginx et PHP ([avec Debian 9](https://docs.webart.space/server/debian9-from-scratch/#nginx-mysql-php) ou [avec CentOS 7](https://docs.webart.space/server/centos72-from-scratch/));

- Indiquez votre socket PHP ligne 4 ou 6, dans le vHost d'exemple;

- Replacez tous les `{DOMAINE}` ligne 9 à 15, en prenant soit de vérifier que tous les chemins sont correctes;

- Copiez les lignes 2 à 11, décommentées, dans un vHost : `nano /etc/nginx/sites-available/{DOMAINE}`

- Activez le vHost `nginx_modsite -e {DOMAINE}`;

## MongoDb

Attention, il faut installer le package suivant `apt install dirmngr`

Pour Debian 9/8, vous pouvez ensuite suivre le [tuto Officiel](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-debian/).

## Dépendances

- Avec votre user web, placez vous à la racine de votre projet déploez NPM et les packages annexes :
```bash
cd /var/www/{DOMAINE}
npm install
```

binding.gyp :
````
{
  "targets": [
    {
      "target_name": "binding",
      "sources": [ "src/binding.cc" ]
    }
  ]
}
````
- Optionnel, mais utile. Déjà présent sur certaines installs. À lancer en root :
```bash
sudo npm install nodemon -g --save
```

## Configuration de base

- Copiez le fichier `/app/etc/config.xml.sample` vers `/app/etc/config.xml`;

- Modifiez le fichier `/app/etc/config.xml` et indiquez y votre configuration.

# Utilisation

## Faire marcher le front
Côté server, en SSH avec votre user web, lancez le serveur Node :
```bash
cd /var/www/{DOMAINE}
node server.js
```

Côté client, ouvrez votre domaine dans un navigateur, entrez votre mot de passe et goooo

## Ajouter une stratégie


# Mises à jour

- Envoyez vos fichier modifiés sur le serveur. Si le fichier `server/app.js` à été modifié, relancez le serveur node avec la commande `node server/app.js`.

- Lancez une mise à jour des dépendances de temps en temps avec `npm install`.
