module.exports = {
    apps: [
        {
            name: 'Keystone',
            script: 'bot.js',
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
            host: '192.168.1.200',
            ref: 'origin/master',
            repo: 'git@github.com:DrazorV/Keystone.git',
            path: '/home/node/Keystone',
            'post-deploy': 'npm install; npm run build; pm2 startOrRestart ecosystem.config.js --env production',
        },
    },
};