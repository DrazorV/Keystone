


exports.run = async (client,message,args)=>{
    let targets = message.mentions.users.array();

    while (targets.length>0){
        const user = targets.pop();
        message.channel.send(user.avatarURL);
    }
};