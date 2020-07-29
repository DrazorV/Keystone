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
            let tries = 0;

            while (!exports.checkURL(post.url)) {
                post = children[exports.randomNumber(children.length)].data;
                if (tries >= 50) new Error('Cannot get image post from ' + url)
                tries++;
            }
            return post;
        } else new Error('Cannot get image post from ' + url);

    } catch (e) {
        throw new Error(e);
    }
}

exports.joke = async (url) => {
    let urlRE= new RegExp("([a-zA-Z0-9]+://)?([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?([^ ])+");
    try {
        const result = await Axios.get(url);
        if (result.status === 200) {
            const children = result.data.data.children;
            let post = children[exports.randomNumber(children.length)].data;
            while (post.selftext.length > 300 || post.selftext.match(urlRE))
                post = children[exports.randomNumber(children.length)].data;
            return post;
        }
    } catch (e) {
        throw new Error(e);
    }
}
