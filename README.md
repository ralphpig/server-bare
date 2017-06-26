# Bare Server

## Setting up

### Locally
- Configure `nginx/default`
- Configure `package.json` and npm scripts (`connect`)
- Configure `flightplan.js`
- Configure `util/config.js` as needed
- *Optional*: `npm i -g nodemon` for server testing. `nodemon` to run server. Use your own development workflow as you want

### Remotely
- Install nginx. `apt-get install nginx`
- Install pm2. `npm i -g pm2`
- Download letencrypt for https certs. https://letsencrypt.org/

## Technologies
- `flightplan` is used for deployment to your server. Use this by `fly production | staging`.
- `pm2` is used on the server to manage node server instances. 
    - `production.json` is the config for the production instance (`fly production`)
    - `staging.json` is the config for the staging instance (`fly staging`)
-  `gulp` is used for building the distribution of the server instances. Build output is `/dist`
- `nginx` is used for passing port `80` traffic to production port `3000`, and passing port `8080` traffic to staging port `8000`

## Workflow
1. Make code changes
2. `fly staging` to push changes to staging instance
3. Access staging server by `domain:8080`
4. *Remotely*: `pm2 logs server | server-staging` to view verbose & error logs
5. `fly production` to push changes to production