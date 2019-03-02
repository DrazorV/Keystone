


exports.run = async (client,message,args)=>{
    let targets = message.mentions.users.array();
    try{
        message.delete();
    }catch (e) {

    }
    while (targets.length>0){
        const user = targets.pop();
        try{
            message.channel.send(user.avatarURL);
        }catch (e) {
            message.channel.send("This user has no Avatar.")
        }
    }
};