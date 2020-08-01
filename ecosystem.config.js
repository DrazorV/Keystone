module.exports = {
    apps: [
        {
            name: 'Keystone',
            script: 'bot.js',
            watch: ['events','commands','utils','bot.js'],
            ignore_watch: ['node_modules', 'json.sqlite', 'README.md', 'LICENSE', '.gitignore'],
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