const ExtendedClient = require('../../class/ExtendedClient');

module.exports = {
    event: 'ready',
    once: true,
    /**
     * 
     * @param {ExtendedClient} _ 
     * @param {import('discord.js').Client<true>} client 
     * @returns 
     */
    run: (_, client) => {
        console.log('Logged in as: ' + client.user.tag, 'done');
    }
};