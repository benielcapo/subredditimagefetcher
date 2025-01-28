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
    
    async GetImageFromSubreddit(SUBREDDIT, WHERE_TO_STORE, RETURN_URL) {
        if (!SUBREDDIT) {throw new Error("You didnt specify the subreddit!");}
        try {
            var LINK = "https://www.reddit.com/r/" + SUBREDDIT + "/.json"
            var RES = await fetch(LINK)
            var DATA = await RES.json()
            var _ = DATA.data.children
            var POSTS = _.filter(POST => POST.data.thumbnail && POST.data.thumbnail.startsWith("http")) || {}
            if (POSTS.length == 0) {throw new Error("There are 0 posts with images")}
            var POST = POSTS[Math.floor(Math.random() * POSTS.length)]
            var POST_DATA = POST.data
            var IMAGE_URL = POST_DATA.thumbnail
            if (RETURN_URL) {
                return IMAGE_URL
            } else {
                this.SaveToPath(WHERE_TO_STORE, IMAGE_URL)
            }
        } catch (ERR) {
            throw new Error(ERR); 
        }
    }
}

module.exports = new Fetcher()
