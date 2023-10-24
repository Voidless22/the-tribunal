const { readdirSync } = require("fs");
const ExtendedClient = require("../class/ExtendedClient");

module.exports = (client) => {
  for (const type of readdirSync('./src/commands/')) 
  {
    const typeDirectory = './src/commands/' + type;
    for (const dir of readdirSync(typeDirectory)) 
    {
      const commandCategoryFolder = "./src/commands/" + type + "/" + dir + "/";
      for (const file of readdirSync(commandCategoryFolder).filter((f) => f.endsWith('.js'))) 
      {
        const module = require('../commands/' + type + '/' + dir + '/' + file);
        if (!module) continue;
        if (type === "prefix") 
        {
          if (!module.structure?.name || !module.run) 
          {
            console.log( "Unable to load the command " + file + " due to missing 'name' and/or 'run' properties.", "warn");
            continue;
          }
          client.collection.prefixcommands.set(module.structure.name, module);

          if (module.structure.aliases && Array.isArray(module.structure.aliases)) 
          {
            module.structure.aliases.forEach((alias) => {
              client.collection.aliases.set(alias, module.structure.name);
            });
          }
        } 
        else 
        {
          if (!module.structure?.name || !module.run) 
          {
            console.log( "Unable to load the command " + file + " due to missing 'name' and/or 'run' properties.", "warn");
            continue;
          }
          client.collection.interactioncommands.set(module.structure.name, module);
          client.applicationcommandsArray.push(module.structure);
        }
        console.log("Loaded new command: " + file, "info");
      }
    }
  }
};
