module.exports = {
  apps : [
    {
      name: 'Keystone',
      script: 'bot.js',
      env_production: {
        NODE_ENV: "production"
      }
    }
  ],
  deploy : {
    production : {
      user : 'pi',
      host : '192.168.1.200',
      ref  : 'origin/master',
      repo : 'git@github.com:DrazorV/Keystone.git',
      path : '',
      'pre-deploy-local': '',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production && pm2 save',
      'pre-setup': ''
    }
  }
};
