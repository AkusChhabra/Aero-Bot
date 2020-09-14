// DECLERATIONS ============================================================================================================================

const Discord = require('discord.js');
const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });
const config = require('./config.json');
const { prefix, token, bot_info } = require('./config.json');


// COMMANDHANDLER SETUP ============================================================================================================================


client.on('message', async message => {

    const args = message.content.slice(prefix.length).trim().split(' ');
    const cmd = args.shift().toLowerCase();

});


// STARTUP BOT ============================================================================================================================

client.once('ready', () => {
    console.log(bot_info.name);
    console.log(bot_info.version);

    client.user.setActivity('.help for commands', { type: 'LISTENING' });

});

// DEFINITIONS ============================================================================================================================

client.on('message', message => {
  if(message.author.bot) return;
  if(message.channel.type === 'dm') return;

  let prefix = config.prefix;
  let messageArray = message.content.split(' ');
  let command = messageArray[0];
  let args = messageArray.slice(1);

// REPORT COMMAND ============================================================================================================================

  if (command === `${prefix}report`) {

      let rUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
      if (!rUser) return message.channel.send('Couldn\'t find user.');
      let rreason = args.join(' ').slice(22);


      const reportEmbed = new Discord.MessageEmbed()
        .setTitle('General Report')
        .setColor('#FFD700')
        .addField('Reported User', `${rUser} with ID: ${rUser.id}`)
        .addField('Reported By', `${message.author} with ID: ${message.author.id}`)
        .addField('Channel', message.channel)
        .addField('Time', message.createdAt)
        .addField('Reason', rreason);

      const reportsChannel = client.channels.cache.get('750100364275220512');
      if(!reportsChannel) return message.channel.send('Couldn\'t find reports channel.');

    message.delete().catch(O_o=>{});
    reportsChannel.send(reportEmbed);

    return;
  }

// KICK COMMAND ============================================================================================================================

  if (command === `${prefix}kick`) {

      let kUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
      if (!kUser) return message.channel.send('Couldn\'t find user.');
      let kReason = args.join(' ').slice(22);

      const logsChannel = client.channels.cache.get('747254997397274665');

      if(!message.member.hasPermission('KICK_MEMBERS')) return logsChannel.send(`${message.author} attempted to access the kick command.`);
      if(kUser.hasPermission('KICK_MEMBERS')) return message.channel.send('Cannot kick this member!');

      const kickEmbed = new Discord.MessageEmbed()
        .setTitle('Kick Report')
        .setColor('#FFA500')
        .addField('Kicked User', `${kUser} with ID ${kUser.id}`)
        .addField('Kicked By', `${message.author} with ID ${message.author.id}`)
        .addField('Kicked In', message.channel)
        .addField('Time', message.createdAt)
        .addField('Reason', kReason);

      const kickChannel = client.channels.cache.get('750110977982464170');
      if(!kickChannel) return message.channel.send('Couldn\'t find kicks channel.');

    kUser.ban({ reason: kReason });

    message.delete().catch(O_o=>{});
    kickChannel.send(kickEmbed);

    return;
  }

  // BAN COMMAND ============================================================================================================================

  if (command === `${prefix}ban`) {

        let bUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
        if (!bUser) return message.channel.send('Couldn\'t find user.');
        let bReason = args.join(' ').slice(22);

          const logsChannel = client.channels.cache.get('747254997397274665');

        if(!message.member.hasPermission('BAN_MEMBERS')) return logsChannel.send(`${message.author} attempted to access the ban command.`);
        if(bUser.hasPermission('BAN_MEMBERS')) return message.channel.send('Cannot ban this member!');

        const banEmbed = new Discord.MessageEmbed()
          .setTitle('Ban Report')
          .setColor('#FF4500')
          .addField('Banned User', `${bUser} with ID ${bUser.id}`)
          .addField('Banned By', `${message.author} with ID ${message.author.id}`)
          .addField('Banned In', message.channel)
          .addField('Time', message.createdAt)
          .addField('Reason', bReason);

        const banChannel = client.channels.cache.get('750110995334299719');
        if(!banChannel) return message.channel.send('Couldn\'t find bans channel.');

      bUser.ban({ reason: bReason });

      message.delete().catch(O_o=>{});
      banChannel.send(banEmbed);

      return;

    }


  // PURGE COMMAND ============================================================================================================================

  if (command === `${prefix}purge`) {

    const args = message.content.slice(prefix.length).trim().split(' ');
    const command = args.shift().toLowerCase();

    const logsChannel = client.channels.cache.get('747254997397274665');

    if(!message.member.hasPermission('KICK_MEMBERS')) return logsChannel.send(`${message.author} attempted to access the purge command.`);

    const amount = parseInt(args[0]);

      if (isNaN(amount)) {
          return message.reply('Invalid number.');
      } else if (amount < 2 || amount > 100) {
	        return message.reply('cannot use this value.');
      }


    const channel = client.channels.cache.get(message.channel.id);

    channel.bulkDelete(amount, true)
      .then(messages => console.log(`Bulk deleted ${messages.size} messages`))
      .catch(console.error);

  }



  //   GENERAL COMMANDS ============================================================================================================================

      if (command === `${prefix}help`) {
        message.channel.send('\nList of Commands:\n\n.brr\n.joined\n.avatar [@person]\n.online\n.firstyearcourses\n.secondyearcourses\n.thirdyearcourses\n.fourthyearcourses');
    } else if (command === `${prefix}brr`) {
        message.channel.send('Airplane go brr!');
    } else if (command === `${prefix}joined`) {
        message.channel.send(`Total Members Joined: ${message.guild.memberCount}`);
    } else if (command === `${prefix}online`) {
        message.guild.members.fetch().then(fetchedMembers => {
	      const totalOnline = fetchedMembers.filter(member => member.presence.status === 'online');
	      message.channel.send(`There are currently ${totalOnline.size} member(s) online including me!`);
});
    } else if (message.content.startsWith(`${prefix}avatar`)) {
        const user = message.mentions.users.first() || message.author;
        const avEmbed = new Discord.MessageEmbed();
            avEmbed.setColor(0x00008b);
            avEmbed.setAuthor(user.username);
            avEmbed.setImage(user.avatarURL({ dynamic: true }));
        message.channel.send(avEmbed);
    }


});

   // JOIN MESSAGE + UNVERIFIED ROLE ============================================================================================================================



  client.on('guildMemberAdd', member => {

    const welcomeChannel = member.guild.channels.cache.find(channel => channel.name === 'welcome'); // finds welcome channel

    welcomeChannel.send(`${member} has joined the Ryerson Aerospace & Mechanical Engineering server!`);


    const errorChannel = member.guild.channels.cache.find(channel => channel.name === 'errors');  // finds errors channel

    member.roles.set(['747281710143766589'])
      .catch(error => {
            errorChannel.send(`An error has occurred while assigning a role for a new member with user ID: ${member.id}.`);
      });


        const AddEmbed = new Discord.MessageEmbed()
          .setColor('#2DFF0C')
          .setTitle(`_**${member.user.tag}**_ has arrived!`)
          .setImage(member.user.avatarURL({ dynamic: true }))
          .setTimestamp()
          .setFooter(member.id);

      welcomeChannel.send(AddEmbed);

  });


    // LEAVE MESSAGE ============================================================================================================================

    client.on('guildMemberRemove', member => {


    const welcomeChannel = member.guild.channels.cache.find(channel => channel.name === 'welcome'); // finds welcome channel

      welcomeChannel.send(`${member} has left the Ryerson Aerospace & Mechanical Engineering server! Farewell!`);

        const RemoveEmbed = new Discord.MessageEmbed()
          .setColor('#EF1313')
          .setTitle(`_**${member.user.tag}**_ has left!`)
          .setImage(member.user.avatarURL({ dynamic: true }))
          .setTimestamp()
          .setFooter(member.id);

      welcomeChannel.send(RemoveEmbed);

     });





 // REACTION SETUP  ============================================================================================================================




  client.on('message', message => {

    /*
    message.client.channels.fetch('753457390216544316').then(channel => {  // access channel ID
      channel.messages.fetch('753675738712113332').then(message => {  // access message
          message.react('🛩️');
          message.react('⚙️');
          message.react('');
          message.react('');
      });
    })
    */
  });


// =========================================================================================================================
// =========================================================================================================================
// =========================================================================================================================


                                            // ROLE REACTIONS BELOW



// REACTION TO RULES ============================================================================================================================


    client.on('messageReactionAdd', async (reaction, user) => {

      let applyRole = async () => {
            let roleAdded = reaction.message.guild.roles.cache.find(role => role.name === 'Verified');
            let roleRemoved = reaction.message.guild.roles.cache.find(role => role.name === 'Unverified');
            let member = reaction.message.guild.members.cache.find(member => member.id === user.id);

         try {
            if (roleAdded && member) {
                console.log('Role and member found');
                await member.roles.add(roleAdded);
                await member.roles.remove(roleRemoved);
                console.log('Done');
            }
         }
            catch(err) {
                console.log(err);
            }
      }

      // end of Apply Role function

        if (reaction.message.partial) {

            try {
                let message = await reaction.message.fetch();
                if (message.id === '753433269030354944') {
                      console.log('cached');
                      applyRole();
                }
            }
              catch(err) {
                  console.log(err);
              }
        }

        else {

          console.log('Not a partial');

              if (reaction.message.id === '753433269030354944') {
                console.log(true);
                applyRole();
              }
        }
    });

    // REMOVAL OF _____ ROLE
/*
   client.on('messageReactionRemove', async (reaction, user) => {

      let removeRole = async () => {
            let emojiName = reaction.emoji.name;
            let role = reaction.message.guild.roles.cache.find(role => role.name === ''); // add Role here
            let member = reaction.message.guild.members.cache.find(member => member.id === user.id);

         try {
            if (role && member && reaction.emoji.name === '') {  // add emoji name
                console.log('Role and member found');
                await member.roles.remove(role);
            }
         }
            catch(err) {
                console.log(err);
            }
      }

        if (reaction.message.partial) {

            try {
                let message = await reaction.message.fetch();
                if (message.id === '') {  // add message ID here
                      removeRole();
                }
            }
              catch(err) {
                  console.log(err);
              }
        }

        else {
              if (reaction.message.id === '') { // add message ID here
                console.log(true);
                removeRole();
              }
        }
    });
*/







// =========================================================================================================================
// =========================================================================================================================
// =========================================================================================================================



                      // REACTION TO 1ST YEAR ROLE ============================================================================================================================

                       client.on('messageReactionAdd', async (reaction, user) => {

                          const msg = reaction.message;
                          const guild = msg.guild;
                          const guildMembers = guild.members;
                          const guildMember = guildMembers.guild.members.cache.get(user.id);

                          if (guildMember.roles.cache.find(role => ['Second Year', 'Third Year', 'Fourth Year'].includes(role.name)) ) {
                                console.log('Cannot add role.');
                          }

                          else {
                              let applyRole = async () => {
                                      let roleAdded = reaction.message.guild.roles.cache.find(role => role.name === 'First Year');
                                      let member = reaction.message.guild.members.cache.find(member => member.id === user.id);

                                  try {
                                        if (roleAdded && member && reaction.emoji.name === '1⃣') {
                                            console.log('Role and member found');
                                            await member.roles.add(roleAdded);
                                            console.log('Done');
                                        }
                                     }
                                        catch(err) {
                                            console.log(err);
                                        }
                                  }

                                  if (reaction.message.partial) {

                                      try {
                                          let message = await reaction.message.fetch();
                                          if (message.id === '754542565780357197') {
                                                console.log('cached');
                                                applyRole();
                                          }
                                      }
                                        catch(err) {
                                            console.log(err);
                                        }
                                  }

                                  else {
                                    console.log('Not a partial');

                                        if (reaction.message.id === '754542565780357197') {
                                          console.log(true);
                                          applyRole();
                                        }
                                  }
                            }



                      // REACTION TO 2ND YEAR ROLE ============================================================================================================================

                          if (guildMember.roles.cache.find(role => ['First Year', 'Third Year', 'Fourth Year'].includes(role.name)) ) {
                                console.log('Cannot add role.');
                          }

                          else {
                              let applyRole = async () => {
                                      let roleAdded = reaction.message.guild.roles.cache.find(role => role.name === 'Second Year');
                                      let member = reaction.message.guild.members.cache.find(member => member.id === user.id);

                                  try {
                                        if (roleAdded && member && reaction.emoji.name === '2⃣') {
                                            console.log('Role and member found');
                                            await member.roles.add(roleAdded);
                                            console.log('Done');
                                        }
                                     }
                                        catch(err) {
                                            console.log(err);
                                        }
                                  }

                                  if (reaction.message.partial) {

                                      try {
                                          let message = await reaction.message.fetch();
                                          if (message.id === '754542565780357197') {
                                                console.log('cached');
                                                applyRole();
                                          }
                                      }
                                        catch(err) {
                                            console.log(err);
                                        }
                                  }

                                  else {
                                    console.log('Not a partial');

                                        if (reaction.message.id === '754542565780357197') {
                                          console.log(true);
                                          applyRole();
                                        }
                                  }
                            }



                    // REACTION TO 3RD YEAR ROLE ============================================================================================================================

                          if (guildMember.roles.cache.find(role => ['First Year', 'Second Year', 'Fourth Year'].includes(role.name)) ) {
                                console.log('Cannot add role.');
                          }

                          else {
                              let applyRole = async () => {
                                      let roleAdded = reaction.message.guild.roles.cache.find(role => role.name === 'Third Year');
                                      let member = reaction.message.guild.members.cache.find(member => member.id === user.id);

                                  try {
                                        if (roleAdded && member && reaction.emoji.name === '3⃣') {
                                            console.log('Role and member found');
                                            await member.roles.add(roleAdded);
                                            console.log('Done');
                                        }
                                     }
                                        catch(err) {
                                            console.log(err);
                                        }
                                  }

                                  if (reaction.message.partial) {

                                      try {
                                          let message = await reaction.message.fetch();
                                          if (message.id === '754542565780357197') {
                                                console.log('cached');
                                                applyRole();
                                          }
                                      }
                                        catch(err) {
                                            console.log(err);
                                        }
                                  }

                                  else {
                                    console.log('Not a partial');

                                        if (reaction.message.id === '754542565780357197') {
                                          console.log(true);
                                          applyRole();
                                        }
                                  }
                            }




                    // REACTION TO 4TH YEAR ROLE ============================================================================================================================

                          if (guildMember.roles.cache.find(role => ['First Year', 'Second Year', 'Third Year'].includes(role.name)) ) {
                                console.log('Cannot add role.');
                          }

                          else {
                              let applyRole = async () => {
                                      let roleAdded = reaction.message.guild.roles.cache.find(role => role.name === 'Fourth Year');
                                      let member = reaction.message.guild.members.cache.find(member => member.id === user.id);

                                  try {
                                        if (roleAdded && member && reaction.emoji.name === '4⃣') {
                                            console.log('Role and member found');
                                            await member.roles.add(roleAdded);
                                            console.log('Done');
                                        }
                                     }
                                        catch(err) {
                                            console.log(err);
                                        }
                                  }

                                  if (reaction.message.partial) {

                                      try {
                                          let message = await reaction.message.fetch();
                                          if (message.id === '754542565780357197') {
                                                console.log('cached');
                                                applyRole();
                                          }
                                      }
                                        catch(err) {
                                            console.log(err);
                                        }
                                  }

                                  else {
                                    console.log('Not a partial');

                                        if (reaction.message.id === '754542565780357197') {
                                          console.log(true);
                                          applyRole();
                                        }
                                  }
                            }
                        });

// =========================================================================================================================
// =========================================================================================================================
// =========================================================================================================================



                    // REACTION TO AIRCRAFT ROLE ============================================================================================================================

                       client.on('messageReactionAdd', async (reaction, user) => {

                          const msg = reaction.message;
                          const guild = msg.guild;
                          const guildMembers = guild.members;
                          const guildMember = guildMembers.guild.members.cache.get(user.id);

                         if (reaction.emoji.name === '✈️') {
                            if (guildMember.roles.cache.find(role => ['Avionics', 'Spacecraft', 'Mechatronics', 'Mechanical'].includes(role.name)) ) {
                                  console.log('Cannot add role.');
                            }

                            else if (guildMember.roles.cache.find(role => role.name === 'Aerospace')) {
                                let applyRole = async () => {
                                        let roleAdded = reaction.message.guild.roles.cache.find(role => role.name === 'Aircraft');
                                        let member = reaction.message.guild.members.cache.find(member => member.id === user.id);

                                    try {
                                          if (roleAdded && member && reaction.emoji.name === '✈️') {
                                              console.log('Role and member found');
                                              await member.roles.add(roleAdded);
                                              console.log('Done');
                                          }
                                       }
                                          catch(err) {
                                              console.log(err);
                                          }
                                    }

                                    if (reaction.message.partial) {

                                        try {
                                            let message = await reaction.message.fetch();
                                            if (message.id === '753680112116957184') {
                                                  console.log('cached');
                                                  applyRole();
                                            }
                                        }
                                          catch(err) {
                                              console.log(err);
                                          }
                                    }

                                    else {
                                      console.log('Not a partial');

                                          if (reaction.message.id === '753680112116957184') {
                                            console.log(true);
                                            applyRole();
                                          }
                                    }
                              } else return;
                         }



                    // REACTION TO AVIONICS ROLE ============================================================================================================================
                        if (reaction.emoji.name === '🧭') {
                          if (guildMember.roles.cache.find(role => ['Aircraft', 'Spacecraft', 'Mechatronics', 'Mechanical'].includes(role.name)) ) {
                                console.log('Cannot add role.');
                          }

                          else if (guildMember.roles.cache.find(role => role.name === 'Aerospace')) {
                              let applyRole = async () => {
                                      let roleAdded = reaction.message.guild.roles.cache.find(role => role.name === 'Avionics');
                                      let member = reaction.message.guild.members.cache.find(member => member.id === user.id);

                                  try {
                                        if (roleAdded && member && reaction.emoji.name === '🧭') {
                                            console.log('Role and member found');
                                            await member.roles.add(roleAdded);
                                            console.log('Done');
                                        }
                                     }
                                        catch(err) {
                                            console.log(err);
                                        }
                                  }

                                  if (reaction.message.partial) {

                                      try {
                                          let message = await reaction.message.fetch();
                                          if (message.id === '753680112116957184') {
                                                console.log('cached');
                                                applyRole();
                                          }
                                      }
                                        catch(err) {
                                            console.log(err);
                                        }
                                  }

                                  else {
                                    console.log('Not a partial');

                                        if (reaction.message.id === '753680112116957184') {
                                          console.log(true);
                                          applyRole();
                                        }
                                  }
                            } else return;
                        }



                    // REACTION TO SPACECRAFT ROLE ============================================================================================================================
                        if (reaction.emoji.name === '🚀') {
                          if (guildMember.roles.cache.find(role => ['Aircraft', 'Avionics', 'Mechatronics', 'Mechanical'].includes(role.name)) ) {
                                console.log('Cannot add role.');
                          }

                          else if (guildMember.roles.cache.find(role => role.name === 'Aerospace')) {
                              let applyRole = async () => {
                                      let roleAdded = reaction.message.guild.roles.cache.find(role => role.name === 'Spacecraft');
                                      let member = reaction.message.guild.members.cache.find(member => member.id === user.id);

                                  try {
                                        if (roleAdded && member && reaction.emoji.name === '🚀') {
                                            console.log('Role and member found');
                                            await member.roles.add(roleAdded);
                                            console.log('Done');
                                        }
                                     }
                                        catch(err) {
                                            console.log(err);
                                        }
                                  }

                                  if (reaction.message.partial) {

                                      try {
                                          let message = await reaction.message.fetch();
                                          if (message.id === '753680112116957184') {
                                                console.log('cached');
                                                applyRole();
                                          }
                                      }
                                        catch(err) {
                                            console.log(err);
                                        }
                                  }

                                  else {
                                    console.log('Not a partial');

                                        if (reaction.message.id === '753680112116957184') {
                                          console.log(true);
                                          applyRole();
                                        }
                                  }
                            } else return;
                        }



                   // REACTION TO MECHATRONICS ROLE ============================================================================================================================

                        if (reaction.emoji.name === '🤖') {
                          if (guildMember.roles.cache.find(role => ['Aircraft', 'Avionics', 'Spacecraft', 'Aerospace'].includes(role.name)) ) {
                                console.log('Cannot add role.');
                          }

                          else if (guildMember.roles.cache.find(role => role.name === 'Mechanical')) {
                              let applyRole = async () => {
                                      let roleAdded = reaction.message.guild.roles.cache.find(role => role.name === 'Mechatronics');
                                      let member = reaction.message.guild.members.cache.find(member => member.id === user.id);

                                  try {
                                        if (roleAdded && member && reaction.emoji.name === '🤖') {
                                            console.log('Role and member found');
                                            await member.roles.add(roleAdded);
                                            console.log('Done');
                                        }
                                     }
                                        catch(err) {
                                            console.log(err);
                                        }
                                  }

                                  if (reaction.message.partial) {

                                      try {
                                          let message = await reaction.message.fetch();
                                          if (message.id === '753680112116957184') {
                                                console.log('cached');
                                                applyRole();
                                          }
                                      }
                                        catch(err) {
                                            console.log(err);
                                        }
                                  }

                                  else {
                                    console.log('Not a partial');

                                        if (reaction.message.id === '753680112116957184') {
                                          console.log(true);
                                          applyRole();
                                        }
                                  }
                            }
                        } else return;
                      });






// =========================================================================================================================
// =========================================================================================================================
// =========================================================================================================================



                  // REACTION TO AEROSPACE ROLE ============================================================================================================================

                       client.on('messageReactionAdd', async (reaction, user) => {

                          const msg = reaction.message;
                          const guild = msg.guild;
                          const guildMembers = guild.members;
                          const guildMember = guildMembers.guild.members.cache.get(user.id);
                          const msgID = reaction.message.id;

                          if (guildMember.roles.cache.find(role => ['Mechatronics', 'Mechanical'].includes(role.name)) ) {
                                console.log('Cannot add role.');
                          }

                          else {
                              let applyRole = async () => {
                                      let roleAdded = reaction.message.guild.roles.cache.find(role => role.name === 'Aerospace');
                                      let member = reaction.message.guild.members.cache.find(member => member.id === user.id);

                                  try {
                                        if (roleAdded && member && reaction.emoji.name === '🛩️') {
                                            console.log('Role and member found');
                                            await member.roles.add(roleAdded);
                                            console.log('Done');
                                        }
                                     }
                                        catch(err) {
                                            console.log(err);
                                        }
                                  }

                                  if (reaction.message.partial) {

                                      try {
                                          let message = await reaction.message.fetch();
                                          if (message.id === '753675738712113332') {
                                                console.log('cached');
                                                applyRole();
                                          }
                                      }
                                        catch(err) {
                                            console.log(err);
                                        }
                                  }

                                  else {
                                    console.log('Not a partial');

                                        if (reaction.message.id === '753675738712113332') {
                                          console.log(true);
                                          applyRole();
                                        }
                                  }
                            }
                        });



                  // REACTION TO MECHANICAL ROLE ============================================================================================================================

                        client.on('messageReactionAdd', async (reaction, user) => {

                          const msg = reaction.message;
                          const guild = msg.guild;
                          const guildMembers = guild.members;
                          const guildMember = guildMembers.guild.members.cache.get(user.id);

                          if (guildMember.roles.cache.find(role => ['Aircraft', 'Avionics', 'Spacecraft', 'Aerospace'].includes(role.name)) ) {
                                console.log('Cannot add role.');
                          }

                          else {
                              let applyRole = async () => {
                                      let roleAdded = reaction.message.guild.roles.cache.find(role => role.name === 'Mechanical');
                                      let member = reaction.message.guild.members.cache.find(member => member.id === user.id);

                                  try {
                                        if (roleAdded && member && reaction.emoji.name === '⚙️') {
                                            console.log('Role and member found');
                                            await member.roles.add(roleAdded);
                                            console.log('Done');
                                        }
                                     }
                                        catch(err) {
                                            console.log(err);
                                        }
                                  }

                                  if (reaction.message.partial) {

                                      try {
                                          let message = await reaction.message.fetch();
                                          if (message.id === '753675738712113332') {
                                                console.log('cached');
                                                applyRole();
                                          }
                                      }
                                        catch(err) {
                                            console.log(err);
                                        }
                                  }

                                  else {
                                    console.log('Not a partial');

                                        if (reaction.message.id === '753675738712113332') {
                                          console.log(true);
                                          applyRole();
                                        }
                                  }
                            }
                        });



// LOGIN ============================================================================================================================


client.login(token);










// =========================================================================================================================
// =========================================================================================================================
// =========================================================================================================================



// =========================================================== COURSE LISTS BEGIN FROM HERE =================================================================













//  First Year Courses ============================================================================================================================

client.on('message', message => {
    if (message.content === `${prefix}firstyearcourses`) {
        const Embed = new Discord.MessageEmbed()
            .setColor('#00008b')
            .setTitle('1st Semester')
            .addField('\u200b', '\u200b')
            .setThumbnail('https://i.imgur.com/yzBzCiV.jpg')
            .addFields(
                { name: 'Introduction to Engineering', value: 'CEN100', inline: true },
                { name: 'General Chemistry', value: 'CHY102', inline: true },
                { name: 'Calculus I', value: 'MTH140', inline: true },
                { name: 'MTH141', value: 'MTH141', inline: true },
                { name: 'Physics: Mechanics', value: 'PCS211', inline: true },
                { name: 'Lower Level Liberal Studies', value: 'Table A', inline: true },
            )
            .setFooter('Created by Edge', 'https://i.imgur.com/yzBzCiV.jpg');
            message.channel.send(Embed);

        const Embed1 = new Discord.MessageEmbed()
            .setColor('#00008b')
            .setTitle('2nd Semester')
            .addFields(
                { name: 'Engineering Design and Graphical Communication', value: 'AER222', inline: true },
                { name: 'Digital Computation and Programming', value: 'CPS125', inline: true },
                { name: 'Principles of Engineering Economics', value: 'ECN801', inline: true },
                { name: 'Calculus II', value: 'MTH240', inline: true },
                { name: 'Materials Science Fundamentals', value: 'MTL200', inline: true },
                { name: 'Physics: Waves and Fields', value: 'PCS125', inline: true },
            )
            .setFooter('Created by Edge', 'https://i.imgur.com/yzBzCiV.jpg');
        message.channel.send(Embed1);
    }
});


//  Second Year Courses ============================================================================================================================

client.on('message', message => {
    if (message.content === `${prefix}secondyearcourses`) {
        const Embed = new Discord.MessageEmbed()
            .setColor('#00008b')
            .setTitle('3rd Semester')
            .addField('\u200b', '\u200b')
            .setThumbnail('https://i.imgur.com/yzBzCiV.jpg')
            .addFields(
                { name: 'Basic Thermodynamics', value: 'AER309', inline: true },
                { name: 'Fluid Mechanics', value: 'AER316', inline: true },
                { name: 'Dynamics', value: 'AER318', inline: true },
                { name: 'Statics and Intro to Strength of Materials', value: 'AER320', inline: true },
                { name: 'Communication in the Engineering Professions', value: 'CMN432', inline: true },
                { name: 'Differential Equations and Vector Calculus', value: 'MTH425', inline: true },
            )
            .setFooter('Created by Edge', 'https://i.imgur.com/yzBzCiV.jpg');
        message.channel.send(Embed);

        const Embed1 = new Discord.MessageEmbed()
            .setColor('#00008b')
            .setTitle('4th Semester')
            .addFields(
                { name: 'Mechanisms and Vibrations', value: 'AER403', inline: true },
                { name: 'Intro to Aerospace Engineering Design', value: 'AER404', inline: true },
                { name: 'Flight Mechanics', value: 'AER416', inline: true },
                { name: 'Thermodynamics and Heat Transfer', value: 'AER423', inline: true },
                { name: 'Electric Circuits', value: 'EES512', inline: true },
                { name: 'Statistics', value: 'MTH410', inline: true },
            )
            .setFooter('Created by Edge', 'https://i.imgur.com/yzBzCiV.jpg');
        message.channel.send(Embed1);
    }
});


//  Third Year Courses ============================================================================================================================

client.on('message', message => {
    if (message.content === `${prefix}thirdyearcourses`) {
        const Embed = new Discord.MessageEmbed()
            .setColor('#00008b')
            .setTitle('5th Semester')
            .addField('\u200b', '\u200b')
            .setThumbnail('https://i.imgur.com/yzBzCiV.jpg')
            .addFields(
                { name: 'Aerodynamics', value: 'AER504', inline: true },
                { name: 'Materials and Manufacturing', value: 'AER507', inline: true },
                { name: 'Stress Analysis', value: 'AER520', inline: true },
                { name: 'Electric Machines and Actuators', value: 'EES612', inline: true },
                { name: 'Numerical Analysis', value: 'MTH510', inline: true },
                { name: 'Lower Level Liberal Studies', value: 'Table A', inline: true },
            )
            .setFooter('Created by Edge', 'https://i.imgur.com/yzBzCiV.jpg');
        message.channel.send(Embed);

        const Embed1 = new Discord.MessageEmbed()
            .setColor('#00008b')
            .setTitle('6th Semester')
            .addFields(
                { name: 'Control Systems', value: 'AER509', inline: true },
                { name: 'Component Design and Material Selection', value: 'AER606', inline: true },
                { name: 'Aircraft Performance', value: 'AER615', inline: true },
                { name: 'Aerospace Structural Design', value: 'AER621', inline: true },
                { name: 'Gas Dynamics', value: 'AER622', inline: true },
                { name: '\u200b', value: '\u200b', inline: true },
            )
            .addField('\u200b', '\u200b')
            .addFields(
                { name: 'Aircraft', value: '---------------', inline: true },
                { name: 'Avionics', value: '---------------', inline: true },
                { name: 'Spacecraft', value: '---------------', inline: true },
                { name: 'Applied Finite Elements', value: 'AER626', inline: true },
                { name: 'Electronics and Sensors', value: 'EES604', inline: true },
                { name: 'Introduction to Space Robotics', value: 'AER627', inline: true },
            )
            .setFooter('Created by Edge', 'https://i.imgur.com/yzBzCiV.jpg');
        message.channel.send(Embed1);
    }
});


//  Fourth Year Courses ============================================================================================================================

client.on('message', message => {
    if (message.content === `${prefix}fourthyearcourses`) {
        const Embed = new Discord.MessageEmbed()
            .setColor('#00008b')
            .setTitle('7th Semester')
            .addField('\u200b', '\u200b')
            .setThumbnail('https://i.imgur.com/yzBzCiV.jpg')
            .addFields(
                { name: 'Avionics and Systems', value: 'AER715', inline: true },
                { name: 'Systems Engineering', value: 'AER817', inline: true },
                { name: '\u200b', value: '\u200b', inline: true },
            )
            .addField('\u200b', '\u200b')
            .addFields(
                { name: 'Liberal Studies (Choose One)', value: '---------------', inline: true },
                { name: '\u200b', value: '\u200b', inline: true },
                { name: '\u200b', value: '\u200b', inline: true },
                { name: 'Science Fiction', value: 'ENG503', inline: true },
                { name: 'Technology and the Contemporary Environmen', value: 'GEO702', inline: true },
                { name: 'Scientific Technology and Modern Society', value: 'HST701', inline: true },
                { name: 'Religion, Science and Philosophy', value: 'PHL709', inline: true },
                { name: 'Power, Change and Technology', value: 'POL507', inline: true },
                { name: '\u200b', value: '\u200b', inline: true },
            )
            .setFooter('Created by Edge', 'https://i.imgur.com/yzBzCiV.jpg');
        message.channel.send(Embed);

        const Embed1 = new Discord.MessageEmbed()
            .setColor('#00008b')
            .addFields(
                { name: 'Aircraft', value: '---------------', inline: true },
                { name: '\u200b', value: '\u200b', inline: true },
                { name: '\u200b', value: '\u200b', inline: true },
                { name: 'Aircraft Stability and Control', value: 'AER716', inline: true },
                { name: 'Aeroelasticity', value: 'AER722', inline: true },
                { name: '\u200b', value: '\u200b', inline: true },
            )
            .addField('\u200b', '\u200b')
            .addFields(
                { name: 'Avionics', value: '---------------', inline: true },
                { name: '\u200b', value: '\u200b', inline: true },
                { name: '\u200b', value: '\u200b', inline: true },
                { name: 'Digital Systems', value: 'EES508', inline: true },
                { name: 'Aircraft Stability and Control', value: 'AER716', inline: true },
                { name: '\u200b', value: '\u200b', inline: true },
            )
            .addField('\u200b', '\u200b')
            .addFields(
                { name: 'Spacecraft', value: '---------------', inline: true },
                { name: '\u200b', value: '\u200b', inline: true },
                { name: '\u200b', value: '\u200b', inline: true },
                { name: 'Orbital Dynamics', value: 'AER721', inline: true },
                { name: 'Introduction to Space Systems Design', value: 'AER723', inline: true },
                { name: '\u200b', value: '\u200b', inline: true },
            )
            .setFooter('Created by Edge', 'https://i.imgur.com/yzBzCiV.jpg');
        message.channel.send(Embed1);

        const Embed2 = new Discord.MessageEmbed()
            .setColor('#00008b')
            .setTitle('8th Semester')
            .addFields(
                { name: 'Propulsion', value: 'AER710', inline: true },
                { name: 'Law and Ethics in Engineering Practice', value: 'CEN800', inline: true },
                { name: 'Upper Liberal', value: 'Table B', inline: true },
            )
            .addField('\u200b', '\u200b')
            .addFields(
                { name: 'Professional (Choose One)', value: '---------------', inline: true },
                { name: '\u200b', value: '\u200b', inline: true },
                { name: '\u200b', value: '\u200b', inline: true },
                { name: 'Manufacturing Management', value: 'AER818', inline: true },
                { name: 'Spacecraft Attitude Dynamics and Control', value: 'AER821', inline: true },
                { name: 'Composite Materials', value: 'AER827', inline: true },
                { name: 'Aerospace Engineering Thesis', value: 'AER870', inline: true },
            )
            .addField('\u200b', '\u200b')
            .addFields(
                { name: 'Aircraft', value: '---------------', inline: true },
                { name: 'Avionics', value: '---------------', inline: true },
                { name: 'Spacecraft', value: '---------------', inline: true },
                { name: 'Aircraft Design Project', value: 'AER814', inline: true },
                { name: 'Avionics Design Project', value: 'AER822', inline: true },
                { name: 'Space Systems Design Project', value: 'AER813', inline: true },
            )
            .setFooter('Created by Edge', 'https://i.imgur.com/yzBzCiV.jpg');
        message.channel.send(Embed2);
    }
});
