const Axios = require('axios');

exports.randomNumber = (nm) =>{
    return Math.floor(Math.random() * nm);
}


exports.checkURL = (url) => {
    return url.match(/\.(jpeg|jpg|gif|png)$/) != null;
}

exports.build = async (url) => {
    try {
        const result = await Axios.get(url);

        if (result.status === 200) {
            const children = result.data.data.children;
            let post = children[exports.randomNumber(children.length)].data;
            let trys = 0;

            while (!exports.checkURL(post.url)) {
                post = children[exports.randomNumber(children.length)].data;
                if (trys >= 50) new Error('Cannot get image post from ' + url)
                trys++;
            }
            return post;
        } else new Error('Cannot get image post from ' + url);
    } catch (e) {
        throw new Error(e);
    }
}
