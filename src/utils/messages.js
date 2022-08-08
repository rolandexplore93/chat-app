const generateMessages = (username, text) => {
    return {
        username,
        text,
        createdAt: new Date().getTime()
    }
}

const geoLocationMessage = (username, url) => {
    return {
        username,
        url,
        createdAt: new Date().getTime()
    }
}

module.exports = {
    generateMessages,
    geoLocationMessage
}