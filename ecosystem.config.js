module.exports = {
    apps: [
        {
            name: 'Keystone',
            script: 'bot.js',
            watch: ['events','commands','utils','bot.js'],
            ignore_watch: [],
            watch_options: {
                "followSymlinks": false
            }
        },
        {
            name: 'Payload',
            script: 'payload.js',
        }
    ]
};