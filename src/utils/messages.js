const generateMessages = (text) => {
    return {
        text,
        createdAt: new Date().getTime()
    }
}

const geoLocationMessage = (url) => {
    return {
        url,
        createdAt: new Date().getTime()
    }
}

module.exports = {
    generateMessages,
    geoLocationMessage
}