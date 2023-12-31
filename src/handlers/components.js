const { readdirSync } = require('fs');
const ExtendedClient = require('../class/ExtendedClient');

module.exports = (client) => {
    for (const dir of readdirSync('./src/components/')) {
        for (const file of readdirSync('./src/components/' + dir).filter((f) => f.endsWith('.js'))) {
            const module = require('../components/' + dir + '/' + file);
            if (!module) continue;
            if (dir === 'buttons') {
                if (!module.customId || !module.run) {
                    console.log('Unable to load the component ' + file + ' due to missing \'structure#customId\' or/and \'run\' properties.', 'warn');
                    continue;
                };
                client.collection.components.buttons.set(module.customId, module);
            } else if (dir === 'selects') {
                if (!module.customId || !module.run) {
                    console.log('Unable to load the select menu ' + file + ' due to missing \'structure#customId\' or/and \'run\' properties.', 'warn');

                    continue;
                };
                client.collection.components.selects.set(module.customId, module);
            } else if (dir === 'modals') {
                if (!module.customId || !module.run) {
                    console.log('Unable to load the modal ' + file + ' due to missing \'structure#customId\' or/and \'run\' properties.', 'warn');

                    continue;
                };
                client.collection.components.modals.set(module.customId, module);
            } else {
                console.log('Invalid component type: ' + file, 'warn');
                continue;
            };
            console.log('Loaded new component: ' + file, 'info');
        };
    };
};