const sharp = require("sharp")
const axios = require("axios")
const os = require("os");
const path = require("path");

class Fetcher {
    async SaveToPath(PATH, IMAGE_URL) {
        try {
          const response = await axios({
            url: IMAGE_URL,
            responseType: 'arraybuffer',
          });
          await sharp(response.data)
            .toFile(PATH);
      
        } catch (err) {
          throw new Error(err)
        }
    }

    IsImage(url) {
        return url.includes('.gifv') && url.includes('.jpg') || url.includes('.png') || url.includes('.gif') || url.includes('.jpeg')
    }
    
    async GetImageFromSubreddit(SUBREDDIT, WHERE_TO_STORE, RETURN_URL) {
        if (!SUBREDDIT) {throw new Error("You didnt specify the subreddit!");}
        try {
            var LINK = "https://api.reddit.com/r/" + SUBREDDIT
            var RES = await fetch(LINK)
            var DATA = await RES.json()
            var _ = DATA.data.children
            var IMAGES = []
            _.forEach(POSTREAL => {
                if (this.IsImage(POSTREAL.data.url)) {
                    IMAGES.push(POSTREAL.data.url)
                }
            });
            if (IMAGES.length === 0) {throw new Error("Bru no post had images crazy yk what else is crazy");}
            if (RETURN_URL) {
                return IMAGES[Math.floor(Math.random() * IMAGES.length)]
            } else {
                this.SaveToPath(WHERE_TO_STORE, IMAGES[Math.floor(Math.random() * IMAGES.length)])
            }
        } catch (ERR) {
            throw new Error(ERR); 
        }
    }
}

module.exports = new Fetcher()
