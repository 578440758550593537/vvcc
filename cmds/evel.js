const Discord = module.require("discord.js");
const config = process.env
var owner = '386477101374504960'
const fs = require("fs");
module.exports.run = async (bot, message, args) => {
  
 function clean(text) {
  if (typeof(text) === "string")
    return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
  else
      return text;
}
    if(message.author.id !== owner) return;
    
    try {
      const code = args.join(" ");
      let evaled = eval(code);

      if (typeof evaled !== "string")
        evaled = require("util").inspect(evaled);
if(evaled === "Promise { <pending> }") return;
        message.react("✅");

      message.channel.send(clean(evaled), {code:"xl"});
    } catch (err) {
message.react("⚠");
      message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
    }  
        };

module.exports.help= {
    name:'eval',
}
