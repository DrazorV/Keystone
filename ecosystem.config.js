module.exports = {
    apps: [
        {
            name: 'Keystone',
            script: 'bot.js',
            instances: 1,
            autorestart: true,
            watch: false,
            max_memory_restart: '1G',
            env: {
                NODE_ENV: 'development',
            },
            env_production: {
                NODE_ENV: 'production',
            },
        },
    ],
    deploy: {
        production: {
            user: 'node',
            host: process.env.BOX_IP,
            ref: 'origin/master',
            repo: 'git@github.com:DrazorV/Keystone.git',
            path: '/home/node/Keystone',
            'post-deploy': 'npm install; npm run build; pm2 startOrRestart ecosystem.config.js --env production',
        },
    },
};