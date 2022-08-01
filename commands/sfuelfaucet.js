const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const data = require('../data.js')
const axios = require('axios');
const fs = require('fs')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("sfuelfaucet")
        .setDescription("Faucet for SFUEL")
        .addStringOption(option => option.setName('address').setDescription('Your address where SFUEL will be sent').setRequired(true)),
    async execute(interaction){
        allow = data.allowed(interaction.member._roles,data.roles());
        allow2 = data.allowed2(interaction);
        const playeraddress = interaction.options.getString('address');

        
        if (allow.length != 0 || allow2 != 0)
        {
            if (client.cooldowns.has(interaction.user.id)) {
                interaction.reply({ content: "Bot maintenance! Please Wait", ephemeral: true });
            }
            else{
                await interaction.deferReply();
                const headers = {'Authorization': 'bearer ' + String(process.env.SKALEFAUCETKEY),'Content-Type': 'application/json'}
                await axios.post('https://api.cryptoblades.io/faucet', {'address': String(playeraddress), "type": "skale"}, {headers: headers})
                .then(async(response) => { 
                    res = JSON.stringify(response.data)
                    console.log(res)
                    if (res == '{"sent":true}'){
                        await interaction.editReply(`Hi <@${interaction.user.id}>! SFUEL have been sent to your SKALE address`)
                    }
                    else if (res.includes('{"error":"Please try again in')){
                        await interaction.editReply(`Hi <@${interaction.user.id}>! You have already requested SFUEL. Please try again later.`)
                    }
                    else if (res.includes(`is invalid, the capitalization checksum test failed, or it's an indirect IBAN address which can't be converted."}`)){
                        await interaction.editReply(`Hi <@${interaction.user.id}>! You have entered an incorrect wallet address.`)
                    }
                    else if (res.includes(`The faucet has dried up`)){
                        await interaction.editReply(`Hi <@${interaction.user.id}>! Please Call Developer - Skale Faucet bot is out of sfuel`)
                    }
                    else{
                        await interaction.editReply(`Hi <@${interaction.user.id}>! Bot maintenance! Please Wait`)
                    }
                })
                .catch(async (error) => {
                    res = JSON.stringify(error.response.data)
                    console.log(res)
                    if (res == '{"sent":true}'){
                        await interaction.editReply(`Hi <@${interaction.user.id}>! SFUEL have been sent to your SKALE address`)
                    }
                    else if (res.includes('{"error":"Please try again in')){
                        await interaction.editReply(`Hi <@${interaction.user.id}>! You have already requested SFUEL. Please try again later.`)
                    }
                    else if (res.includes(`is invalid, the capitalization checksum test failed, or it's an indirect IBAN address which can't be converted."}`)){
                        await interaction.editReply(`Hi <@${interaction.user.id}>! You have entered an incorrect wallet address.`)
                    }
                    else if (res.includes(`The faucet has dried up`)){
                        await interaction.editReply(`Hi <@${interaction.user.id}>! Please Call Developer - Skale Faucet bot is out of sfuel`)
                    }
                    else{
                        await interaction.editReply(`Hi <@${interaction.user.id}>! Bot maintenance! Please Wait`)
                    }
                });
                client.cooldowns.set(interaction.user.id, true);
                setTimeout(() => {
                    client.cooldowns.delete(interaction.user.id);
                  }, client.COOLDOWN_SECONDS * 1000);
              
            }
    
        }
        else
        {
            interaction.reply({
                content: "Bot Commands only work in <#833235142046384129>",
			    ephemeral: true
            })
        }
    }
}




    

