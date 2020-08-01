let exec = require('child_process').exec;
const CronJob  = require('cron').CronJob;
const needsPull = require('git-needs-pull');

const init = async () => {
    new CronJob('0 * * * * *', function () {
        if(needsPull()) {
            console.log('pulling code from GitHub...');
            exec('git -C ~/Repos/Keystone reset --hard', execCallback);
            exec('git -C ~/Repos/Keystone  clean -df', execCallback);
            exec('git -C ~/Repos/Keystone  pull -f', execCallback);
            exec('npm -C ~/Repos/Keystone  install --production', execCallback);
            exec('tsc', execCallback);
        }
    },null, true);
}
init().then();

function execCallback(err, stdout, stderr) {
    if(stdout) console.log(stdout);
    if(stderr) console.log(stderr);
}