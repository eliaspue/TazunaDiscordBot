import 'dotenv/config';
import express from 'express';
import {
  ButtonStyleTypes,
  InteractionResponseFlags,
  InteractionResponseType,
  InteractionType,
  MessageComponentTypes,
  verifyKeyMiddleware,
} from 'discord-interactions';
import { buildSupporterEmbed, buildSkillEmbed, buildSkillComponents, getSkillEmoji, getCustomEmoji, parseEmojiForDropdown, buildEventEmbed, buildUmaEmbed, buildUmaComponents } from './utils.js';
import { logPending } from "./sheets.js";
import supporters from './assets/supporter.json' with { type: "json" };
import skills from './assets/skill.json' with { type: "json" };
import events from './assets/event.json' with { type: "json" };
import characters from './assets/character.json' with { type: "json" };

// Create an express app
const app = express();
// Get port, or default to 3000
const PORT = process.env.PORT || 3000;

/**
 * Interactions endpoint URL where Discord will send HTTP requests
 * Parse request body and verifies incoming requests using discord-interactions package
 */
app.post('/interactions', verifyKeyMiddleware(process.env.PUBLIC_KEY), async function (req, res) {
  // Interaction id, type and data
  const { id, type, data, message } = req.body;

  /**
   * Handle verification requests
   */
  if (type === InteractionType.PING) {
    return res.send({ type: InteractionResponseType.PONG });
  }

  /**
   * Handle slash command requests
   * See https://discord.com/developers/docs/interactions/application-commands#slash-commands
   */
  if (type === InteractionType.APPLICATION_COMMAND) {
    const { name, options } = data;

    // "supporter" command
    if (name === 'supporter') {
      const supporterQuery = data.options?.find(opt => opt.name === 'name')?.value?.toLowerCase();
      const query = supporterQuery.toLowerCase().split(/\s+/); 


      const matches = supporters.filter(s => {
        return query.every(q =>
          s.card_name.toLowerCase().includes(q) ||
          s.character_name.toLowerCase().includes(q) ||
          s.aliases?.some(a => a.toLowerCase().includes(q))
        );
      });

      if (matches.length === 0) {
        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: { content: `❌ Supporter: ${supporterQuery} not found` }
        });
      }
      // If only 1 result
      else if (matches.length === 1)
      {
        return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: { 
          embeds: [buildSupporterEmbed(matches[0], skills)]
          }
        });
      }

      // If multiple matches → return a dropdown menu
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: `🔎 Found ${matches.length} matches. Pick one:`,
          components: [
            {
              type: 1, // Action row
              components: [
                {
                  type: 3, // String Select
                  custom_id: "supporter_select",
                  placeholder: "Choose a supporter",
                  options: matches.map(s => ({
                    label:  s.card_name + ' (' + s.rarity.toUpperCase() +')' , // must be <=100 chars
                    value: s.card_name, // send the supporter title back on select
                    description: s.character_name,
                    emoji: getCustomEmoji(s.category)
                  }))
                }
              ]
            }
          ]
        }
      });
    }

    // "skill" command
    if (name === 'skill') {
      const skillQuery = data.options?.find(opt => opt.name === 'name')?.value?.toLowerCase();
      const query = skillQuery.toLowerCase().split(/\s+/); 

      // Find the skills that match
      const matches = skills.filter(s => {
        return query.every(q =>
          s.skill_name.toLowerCase().includes(q) ||
          s.aliases?.some(a => a.toLowerCase().includes(q))
        );
      });

      if (matches.length === 0) {
        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: { content: `❌ Skill ${skillQuery} not found` }
        });
      }

      // If only 1 result
      if (matches.length === 1)
      {

        // Lookup supporters with this skill
        const supporterMatches = supporters.filter(s =>
          s.support_skills?.some(sk => sk.toLowerCase() === matches[0].skill_name.toLowerCase()) ||
          s.event_skills?.some(sk => sk.toLowerCase() === matches[0].skill_name.toLowerCase())
        );

        // Format supporter names into a list
        let supporterList = supporterMatches.length
          ? supporterMatches.map(s => `• ${s.character_name} - ${s.card_name} (${s.rarity.toUpperCase()})`).join('\n')
          : 'None';

        // Creating components if the skill has cards or upgraded version
        let components = [];

        return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: { 
          embeds: [buildSkillEmbed(matches[0], supporterList)],
          components: buildSkillComponents(matches[0], supporterMatches.length, supporterMatches)
        }
        });
      }
      

      // If multiple matches → return a dropdown menu
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: `🔎 Found ${matches.length} matches. Pick one:`,
          components: [
            {
              type: 1, // Action row
              components: [
                {
                  type: 3, // String Select
                  custom_id: "skill_select",
                  placeholder: "Choose a Skill",
                  options: matches.slice(0, 25).map(s => ({
                    label:  s.skill_name , // must be <=100 chars
                    value: s.skill_name, // send the skill title back on select
                    description: s.description.length > 80 
                      ? s.description.slice(0, 77) + "..." 
                      : s.description,
                  }))
                }
              ]
            }
          ]
        }
      });
    }

    // "event" command
    if (name === 'event') {
      const eventQuery = data.options?.find(opt => opt.name === 'name')?.value?.toLowerCase();
      const query = eventQuery.toLowerCase().split(/\s+/); 

      // Find the skills that match
      const matches = events.filter(s => {
        return query.every(q =>
          s.event_name.toLowerCase().includes(q) ||
          s.source_name?.toLowerCase().includes(q) ||
          s.aliases?.some(a => a.toLowerCase().includes(q))
        );
      });

      if (matches.length === 0) {
        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: { content: `❌ Event ${eventQuery} not found` }
        });
      }

      // If only 1 result
      if (matches.length === 1)
      {
        return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: { 
          embeds: [buildEventEmbed(matches[0], events)],
        }
        });
      }

      // If multiple matches → return a dropdown menu
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: `🔎 Found ${matches.length} matches. Pick one:`,
          components: [
            {
              type: 1, // Action row
              components: [
                {
                  type: 3, // String Select
                  custom_id: "event_select",
                  placeholder: "Choose an Event",
                  options: matches.map(s => ({
                    label:  s.event_name.length > 100 
                      ? s.event_name.slice(0, 97) + "..." 
                      : s.event_name,// must be <=100 chars
                    value: s.id, // send the source back
                     description: s.source_name?.length 
                      ? (s.source_name.length > 100 
                        ? s.source_name.slice(0, 97) + "..." 
                        : s.source_name)
                      : "No source"
                  }))
                }
              ]
            }
          ]
        }
      });
    }

    if (name === 'uma') {
      const umaQuery = data.options?.find(opt => opt.name === 'name')?.value?.toLowerCase();
      const query = umaQuery.toLowerCase().split(/\s+/); 

      // Find matches
      const matches = characters.filter(c => {
        return query.every(q =>
          c.character_name.toLowerCase().includes(q) ||
          c.aliases?.some(a => a.toLowerCase().includes(q))
        );
      });

      // No matches
      if (matches.length === 0) {
        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: { content: `❌ Uma "${umaQuery}" not found.` }
        });
      }

      // One match → embed
      if (matches.length === 1) {
        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: { 
            embeds: [buildUmaEmbed(matches[0], skills)],
            components: buildUmaComponents(matches[0], true, characters)
          }
        });
      }

      // Multiple matches → dropdown
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: `🔎 Found ${matches.length} matches. Pick one:`,
          components: [
            {
              type: 1, // Action row
              components: [
                {
                  type: 3, // String Select
                  custom_id: "uma_select",
                  placeholder: "Choose a Character",
                  options: matches.map(c => ({
                    label: c.character_name.length > 100 
                      ? c.character_name.slice(0, 97) + "..." 
                      : c.character_name,
                    value: c.id,
                    description: c.type + " " + c.rarity
                  }))
                }
              ]
            }
          ]
        }
      });
    }

    // "log" command
    if (name === 'log') {
      // Interaction context
      const context = req.body.context;
      const value = options[0].value;

      // User ID is in user field for (G)DMs, and member for servers
      const userId = context === 0 ? req.body.member.user.id : req.body.user.id;

      // Call the Google Sheets updater
      const result = await logPending(userId, value);

      return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            flags: InteractionResponseFlags.IS_COMPONENTS_V2,
            components: [
              {
                type: MessageComponentTypes.TEXT_DISPLAY,
                content: result
              }
            ]
          },
        });
    }

        // "skill" command
    if (name === 'leaderboard') {
      return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            flags: InteractionResponseFlags.IS_COMPONENTS_V2,
            components: [
              {
                type: MessageComponentTypes.TEXT_DISPLAY,
                content: "Not Ready Yet."
              }
            ]
          },
        });
    }

    console.error(`unknown command: ${name}`);
    return res.status(400).json({ error: 'unknown command' });
  }

  if (type === InteractionType.MESSAGE_COMPONENT) {
    const { custom_id, values } = data;

    if (custom_id === "supporter_select") {
      const selectedTitle = values[0].toLowerCase();
      const supporter = supporters.find(s =>
        s.card_name.toLowerCase() === selectedTitle
      );

      return res.send({
        type: InteractionResponseType.UPDATE_MESSAGE,
        data: {
          content: `✅ You selected **${supporter.card_name}**`,
          embeds: [buildSupporterEmbed(supporter, skills)],
          components: [] // remove the dropdown after selection
        }
      });
    }

    // Handling selecting a skill from a dropdown
    if (custom_id === "skill_select") {
      const selectedTitle = values[0].toLowerCase();
      const skill = skills.find(s =>
        s.skill_name.toLowerCase() === selectedTitle
      );

      // Lookup supporters with this skill
      const supporterMatches = supporters.filter(s =>
        s.support_skills?.some(sk => sk.toLowerCase() === skill.skill_name.toLowerCase()) ||
        s.event_skills?.some(sk => sk.toLowerCase() === skill.skill_name.toLowerCase())
      );

      // Format supporter names into a list
      let supporterList = supporterMatches.length
        ? supporterMatches.map(s => `• ${s.character_name} - ${s.card_name} (${s.rarity.toUpperCase()})`).join('\n')
        : 'None';

      return res.send({
        type: InteractionResponseType.UPDATE_MESSAGE,
        data: {
          content: `✅ You selected **${skill.skill_name}**`,
          embeds: [buildSkillEmbed(skill, supporterList)],
          components: buildSkillComponents(skill, supporterMatches.length, supporterMatches)
        }
      });
    }

    // Handling selecting a supporter card from skills
    if (custom_id === "supporter_lookup_select") {
      const cardName = values[0];
      const supporter = supporters.find(s => s.card_name === cardName);
      
      return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: { 
            embeds: [buildSupporterEmbed(supporter, skills)]
            }
          });
    }

    // Handling looking up the upgraded skill
    if (custom_id.startsWith("upgrade_")) {
      const upgradedName = custom_id.replace("upgrade_", "").toLowerCase();
      const upgradedSkill = skills.find(s =>
        s.skill_name.toLowerCase() === upgradedName
      );

      if (!upgradedSkill) {
        return res.send({
          type: InteractionResponseType.UPDATE_MESSAGE,
          data: { content: "⚠️ Upgraded skill not found!" }
        });
      }

      // Lookup supporters with this skill
      const supporterMatches = supporters.filter(s =>
        s.support_skills?.some(sk => sk.toLowerCase() === upgradedSkill.skill_name.toLowerCase()) ||
        s.event_skills?.some(sk => sk.toLowerCase() === upgradedSkill.skill_name.toLowerCase())
      );

      // Format supporter names into a list
      let supporterList = supporterMatches.length
        ? supporterMatches.map(s => `• ${s.character_name} - ${s.card_name} (${s.rarity.toUpperCase()})`).join('\n')
        : 'None';

      return res.send({
        type: InteractionResponseType.UPDATE_MESSAGE,
        data: {
          embeds: [buildSkillEmbed(upgradedSkill, supporterList)],
          components: buildSkillComponents(upgradedSkill, supporterMatches.length, supporterMatches)
        }
      });
    }

    // Handling looking up the downgraded skill
    if (custom_id.startsWith("downgrade_")) {
      const downgradedName = custom_id.replace("downgrade_", "").toLowerCase();
      const downgradedSkill = skills.find(s =>
        s.skill_name.toLowerCase() === downgradedName
      );

      if (!downgradedSkill) {
        return res.send({
          type: InteractionResponseType.UPDATE_MESSAGE,
          data: { content: "⚠️ Downgraded skill not found!" }
        });
      }

      // Lookup supporters with this skill
      const supporterMatches = supporters.filter(s =>
        s.support_skills?.some(sk => sk.toLowerCase() === downgradedSkill.skill_name.toLowerCase()) ||
        s.event_skills?.some(sk => sk.toLowerCase() === downgradedSkill.skill_name.toLowerCase())
      );

      // Format supporter names into a list
      let supporterList = supporterMatches.length
        ? supporterMatches.map(s => `• ${s.character_name} - ${s.card_name} (${s.rarity.toUpperCase()})`).join('\n')
        : 'None';

      return res.send({
        type: InteractionResponseType.UPDATE_MESSAGE,
        data: {
          embeds: [buildSkillEmbed(downgradedSkill, supporterList)],
          components: buildSkillComponents(downgradedSkill, supporterMatches.length, supporterMatches)
        }
      });
    }

    if (custom_id === "uma_select") {
      const selectedTitle = values[0];
      const uma = characters.find(c =>
        c.id === selectedTitle
      );

      return res.send({
        type: InteractionResponseType.UPDATE_MESSAGE,
        data: {
          content: `✅ You selected **${uma.character_name} (${uma.type})**`,
          embeds: [buildUmaEmbed(uma, skills)],
          components: buildUmaComponents(uma, true, characters)
        }
      });
    }

    if (custom_id === "uma_variant_select") {
      const selectedVariantId = values[0];
      const variant = characters.find(c => c.id === selectedVariantId);

      if (!variant) {
        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: { content: `❌ Variant not found.` }
        });
      }

      return res.send({
        type: InteractionResponseType.UPDATE_MESSAGE, // update the same message
        data: {
          embeds: [buildUmaEmbed(variant, skills)],
          components: buildUmaComponents(variant, true, characters)
        }
      });
    }

    // Handling selecting a skill from Uma's skill dropdown
    if (custom_id === "uma_skill_select") {
      const [umaId, selectedTitle] = values[0].split("::");

      const uma = characters.find(c => c.id === umaId);

      const skill = skills.find(s =>
        s.skill_name.toLowerCase() === selectedTitle.toLowerCase()
      );

      if (!skill) {
        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: { content: `❌ Skill "${values[0]}" not found.` }
        });
      }

      // Lookup supporters with this skill
      const supporterMatches = supporters.filter(s =>
        s.support_skills?.some(sk => sk.toLowerCase() === skill.skill_name.toLowerCase()) ||
        s.event_skills?.some(sk => sk.toLowerCase() === skill.skill_name.toLowerCase())
      );

      let supporterList = supporterMatches.length
        ? supporterMatches.map(s =>
            `• ${s.character_name} - ${s.card_name} (${s.rarity.toUpperCase()})`
          ).join('\n')
        : 'None';

      return res.send({
        type: InteractionResponseType.UPDATE_MESSAGE,
        data: {
          content: `✅ You selected **${skill.skill_name}**`,
          embeds: [buildUmaEmbed(uma, skills), buildSkillEmbed(skill, supporterList)],
          components: [
            ...buildUmaComponents(uma, true, characters),
            ...buildSkillComponents(skill, supporterMatches.length, supporterMatches)
          ]
        }
      });
    }
  }

  console.error('unknown interaction type', type);
  return res.status(400).json({ error: 'unknown interaction type' });
});

app.listen(PORT, () => {
  console.log('Listening on port', PORT);
});
