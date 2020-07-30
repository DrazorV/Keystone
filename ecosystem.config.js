module.exports = {
  apps : [{
    name: 'Keystone',
    script: 'bot.js',
    watch: 'true',
    ignore_watch: ['json.sqlite','node_modules'],
    watch_options: {
      "followSymlinks": false
    }
  ],
  deploy : {
    production : {
      user : 'raspi',
      host : '192.168.1.200',
      ref  : 'origin/master',
      repo : 'git@github.com:DrazorV/Keystone.git',
      path : 'home/pi/Repos/Keystone',
      'pre-deploy-local': '',
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production && pm2 save',
      'pre-setup': ''
    }
  }
};
