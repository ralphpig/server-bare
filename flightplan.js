var plan = require('flightplan');

var host = '';
var username = '';
var privateKey = ''

plan.target('production', {
   host: host,
   username: username,
   privateKey: privateKey,
   agent: process.env.SSH_AUTH_SOCK
}, {
   "production": true,
   "serverDir": "~/server"
});

plan.target('staging', {
   host: host,
   username: username,
   privateKey: privateKey,
   agent: process.env.SSH_AUTH_SOCK
}, {
   "production": false,
   "serverDir": "~/server-staging"
});

plan.local(function(local) {
   var production = plan.runtime.options.production;
   local.log("Gulp Build");
   if(production) {
      local.exec("gulp");
   } else {
      local.exec("gulp staging");
   }


   local.log("Copying Files");
   var dist = local.find('dist -type f', {silent: true}).stdout.split('\n');
   local.transfer(dist, "~/server_tmp");
});

plan.remote(function(remote) {
   var serverDir = plan.runtime.options.serverDir;
   var production = plan.runtime.options.production;

   remote.log("Copying from tmp dir");
   remote.exec("sudo rm " + serverDir + " -R");
   remote.exec("cp -R ~/server_tmp/dist " + serverDir);

   remote.log("NPM Install");
   remote.exec("sudo npm install --production --prefix " + serverDir);

   if(production) {
      remote.log("Starting production servers");
      remote.exec("sudo npm run production --prefix " + serverDir);
   } else {
      remote.log("Starting staging servers");
      remote.exec("sudo npm run staging --prefix " + serverDir);
   }

   remote.log("Update NGINX config");
   remote.exec("sudo cp -f " +  serverDir + "/default /etc/nginx/sites-available");

   remote.log("Restarting Server");
   remote.exec("sudo service nginx restart");

   remote.log("Removing tmp dir");
   remote.rm("~/server_tmp -R");
});
