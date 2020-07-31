module.exports = {
  apps : [
    {
      name: 'Keystone',
      script: 'bot.js',
    }
  ],
  deploy : {
    production : {
      key  : '~/.ssh/id_rsa',
      user : 'pi',
      host : '192.168.1.200',
      ref  : 'origin/master',
      repo : 'git@github.com:DrazorV/Keystone.git',
      path : '',
      'pre-deploy-local': "echo 'This is a local executed command'",
      'post-deploy' : 'npm install && pm2 reload ecosystem.config.js --env production && pm2 save',
      'post-setup': "ls -la",
      'pre-setup': 'apt-get install git ; ls -la'
    }
  }
};
