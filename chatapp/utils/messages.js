const dateFns = require('date-fns');

function formatMessage(username, text) {
    return {
        username,
        text,
        time: dateFns.format(new Date(), 'hh:mm'),
    }

}

module.exports = formatMessage;