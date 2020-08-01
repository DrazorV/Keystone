module.exports = {
    apps: [
        {
            name: 'Keystone',
            script: 'bot.js',
            watch: true,
            ignore_watch: ['node_modules', 'json.sqlite', 'README.md', 'LICENSE', '.gitignore'],
            watch_options: {
                "followSymlinks": false
            },
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
            user: 'pi',
            host: '192.168.1.200',
            ref: 'origin/master',
            repo: 'git@github.com:DrazorV/Keystone.git',
            path: '/home/pi/Repos/Keystone',
            "ssh_options": ["StrictHostKeyChecking=no", "PasswordAuthentication=no"],
            'post-deploy': 'npm install; npm run build; pm2 startOrRestart ecosystem.config.js --env production && pm2 save',
            "env"  : {
                "NODE_ENV": "production"
            }
        },
    },
};