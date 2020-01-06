module.exports = response => {
    const isAuthorized = response.data.isAuthorized ? true : false;
    response.reply({isAuthorized});
}