import 'dotenv/config';

const skillCategoryEmotes = {
  speed: '<:SkillSpeed:1409363964596322314>',
  speednegative: '<:SkillSpeedNegative:1410385256317714573>',
  stamina: '<:SkillStamina:1409353481248182423>',
  staminanegative: '<:SkillStaminaNegative:1410385267193417749>',
  power: '<:SkillPower:1409353468455686225>',
  powernegative: '<:SkillPowerNegative:1410385277821780068>',
  guts: '<:SkillGuts:1409365192806236170>',
  gutsnegative: '<:SkillGutsNegative:1410385700578398218>',
  gate: '<:SkillGate:1409374560243028081>',
  gatenegative: '<:SkillGateNegative:1410385710598324274>',
  super7: '<:SkillSuper7:1409374543637905530>',
  goldensuper7: '<:SkillGoldenSuper7:1410387575868362763>',
  recovery: '<:SkillRecovery:1409363977900654736>',
  goldenrecovery: '<:SkillRecoveryGolden:1409364361633464483>',
  rainbowrecovery: '<:SkillRainbowRecovery:1410386721090175177>',
  recoverynegative: '<:SkillRecoveryNegative:1410386734176272460>',
  recoveryspecial: '<:SkillRecovery:1409363977900654736>', // new one needed
  goldenrecoveryspecial: '<:SkillRecoveryGolden:1409364361633464483>', // new one needed
  velocity: '<:SkillVelocity:1409375756429037608>',
  goldenvelocity: '<:SkillGoldenVelocity:1410390264593387530>',
  rainbowvelocity: '<:SkillRainbowVelocity:1410390277419700373>',
  velocitynegative: '<:SkillVelocityNegative:1410390388249858169>',
  velocityspecial: '<:SkillVelocity:1409375756429037608>', // new one needed
  goldenvelocityspecial: '<:SkillGoldenVelocity:1410390264593387530>', // new one needed
  accel: '<:SkillAccel:1410383762990039040>',
  goldenaccel: '<:SkillGoldenAccel:1411128241619468299>',
  rainbowaccel: '<:SkillRainbowAccel:1411128260313747557>',
  accelnegative: '<:SkillAccelNegative:1410390629085769731>',
  accelspecial: '<:SkillAccel:1410383762990039040>', // new one needed
  goldenaccelspecial: '<:SkillGoldenAccel:14103906061462246500>', // new one neede
  flow: '<:SkillFlow:1409365210937082122>',
  wisdom: '<:SkillWisdom:1409317127567052925>',
  velocity: '<:SkillVelocity:1409375756429037608>',
  unique: '🌟', // unique skills if needed
  default: '✨' // fallback
};

export async function DiscordRequest(endpoint, options) {
  // append endpoint to root API URL
  const url = 'https://discord.com/api/v10/' + endpoint;
  // Stringify payloads
  if (options.body) options.body = JSON.stringify(options.body);
  // Use fetch to make requests
  const res = await fetch(url, {
    headers: {
      Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
      'Content-Type': 'application/json; charset=UTF-8',
      'User-Agent': 'DiscordBot (https://github.com/discord/discord-example-app, 1.0.0)',
    },
    ...options
  });
  // throw API errors
  if (!res.ok) {
    const data = await res.json();
    console.log(res.status);
    throw new Error(JSON.stringify(data));
  }
  // return original response
  return res;
}

export async function InstallGlobalCommands(appId, commands) {
  // API endpoint to overwrite global commands
  const endpoint = `applications/${appId}/commands`;

  try {
    // This is calling the bulk overwrite endpoint: https://discord.com/developers/docs/interactions/application-commands#bulk-overwrite-global-application-commands
    await DiscordRequest(endpoint, { method: 'PUT', body: commands });
  } catch (err) {
    console.error(err);
  }
}

// Simple method that returns a random emoji from list
export function getRandomEmoji() {
  const emojiList = ['😭','😄','😌','🤓','😎','😤','🤖','😶‍🌫️','🌏','📸','💿','👋','🌊','✨'];
  return emojiList[Math.floor(Math.random() * emojiList.length)];
}

export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function getRarityImageLink(str) {
  if (str === 'SSR' || str === 'ssr')
  {
    return 'https://gametora.com/images/umamusume/icons/utx_txt_rarity_03.png';
  }
  else if (str === 'SR' || str === 'sr')
  {
    return 'https://gametora.com/images/umamusume/icons/utx_txt_rarity_02.png';
  }
  if (str === 'R' || str === 'r')
  {
    return 'https://gametora.com/images/umamusume/icons/utx_txt_rarity_01.png';
  }
}

function getCardTypeImageLink(str) {
  if (str === 'speed')
  {
    return 'https://gametora.com/images/umamusume/icons/utx_ico_obtain_00.png';
  }
}

// Emoji for the Card Type Dropdown
export function getCustomEmoji(str) {
  if (str === 'speed')
  {
    return { "id": "1409344810426564750", "name": "Speed" };
  }
  else if (str === 'stamina')
  {
    return { "id": "1409340937137684551", "name": "Stamina" };
  }
  else if (str === 'power')
  {
    return { "id": "1409344836322070578", "name": "Power" };
  }
  else if (str === 'wit')
  {
    return { "id": "1409344858698551367", "name": "Wit" };
  }
  else if (str === 'guts')
  {
    return { "id": "1409344879930249216", "name": "Guts" };
  }
  else if (str === 'friend')
  {
    return { "id": "1409344903833452604", "name": "Friend" };
  }
  else if (str === 'group')
  {
    return { "id": "1409344925103030315", "name": "Group" };
  }
}

function getColor(str) {
  if (str === 'red')
  {
    return 16734029;
  }
  else if (str === 'blue')
  {
    return 3915519;
  }
  else if (str === 'green' || str === 'skillspeed')
  {
    return 5939528;
  }
  else if (str === 'yellow')
  {
    return 16769113;
  }
  else if (str === 'pink')
  {
    return 16738283;
  }
  else if (str === 'orange')
  {
    return 15699013;
  }
  else if (str === 'greener')
  {
    return 1733686;
  }
}

// Returns Color for the Cards Embed
export function getCardColor(str)
{
  if (str === 'speed')
  {
    return getColor('blue');
  }
  else if (str === 'stamina')
  {
    return getColor('red');
  }
  else if (str === 'power')
  {
    return getColor('yellow');
  }
  else if (str === 'guts')
  {
    return getColor('pink');
  }
  else if (str === 'wit')
  {
    return getColor('green');
  }
  else if (str === 'friend')
  {
    return getColor('orange');
  }
  else if (str === 'group')
  {
    return getColor('greener');
  }
}

// Returns Color for the Skills Embed
export function getSkillColor(str)
{
  if (str === 'speed')
  {
    return getColor('green');
  }
}

// Get Gametora's thumbnail for the skill
export function getSkillThumbnail(str)
{
  if (str === 'speed')
  {
    return 'https://gametora.com/images/umamusume/skill_icons/utx_ico_skill_10011.png';
  }
  if (str === 'speednegative')
  {
    return 'https://gametora.com/images/umamusume/skill_icons/utx_ico_skill_10014.png';
  }

  if (str === 'stamina')
  {
    return 'https://gametora.com/images/umamusume/skill_icons/utx_ico_skill_10021.png';
  }
  if (str === 'staminanegative')
  {
    return 'https://gametora.com/images/umamusume/skill_icons/utx_ico_skill_10024.png';
  }

  if (str === 'power')
  {
    return 'https://gametora.com/images/umamusume/skill_icons/utx_ico_skill_10031.png';
  }
  if (str === 'powernegative')
  {
    return 'https://gametora.com/images/umamusume/skill_icons/utx_ico_skill_10034.png';
  }

  if (str === 'guts')
  {
    return 'https://gametora.com/images/umamusume/skill_icons/utx_ico_skill_10041.png';
  }
  if (str === 'gutsnegative')
  {
    return 'https://gametora.com/images/umamusume/skill_icons/utx_ico_skill_10044.png';
  }

  if (str === 'gate')
  {
    return 'https://gametora.com/images/umamusume/skill_icons/utx_ico_skill_10051.png';
  }
  if (str === 'gatenegative')
  {
    return 'https://gametora.com/images/umamusume/skill_icons/utx_ico_skill_10054.png';
  }

  if (str === 'super7')
  {
    return 'https://gametora.com/images/umamusume/skill_icons/utx_ico_skill_10061.png';
  }
  if (str === 'goldensuper7')
  {
    return 'https://gametora.com/images/umamusume/skill_icons/utx_ico_skill_10062.png';
  }

  if (str === 'recovery')
  {
    return 'https://gametora.com/images/umamusume/skill_icons/utx_ico_skill_20021.png';
  }
  if (str === 'goldenrecovery')
  {
    return 'https://gametora.com/images/umamusume/skill_icons/utx_ico_skill_20022.png';
  }
  if (str === 'rainbowrecovery')
  {
    return 'https://gametora.com/images/umamusume/skill_icons/utx_ico_skill_20023.png';
  }
  if (str === 'recoverynegative')
  {
    return 'https://gametora.com/images/umamusume/skill_icons/utx_ico_skill_20024.png';
  }
  if (str === 'recoveryspecial')
  {
    return 'https://gametora.com/images/umamusume/skill_icons/utx_ico_skill_20111.png';
  }
  if (str === 'goldenrecoveryspecial')
  {
    return 'https://gametora.com/images/umamusume/skill_icons/utx_ico_skill_20112.png';
  }

  if (str === 'velocity')
  {
    return 'https://gametora.com/images/umamusume/skill_icons/utx_ico_skill_20011.png';
  }
  if (str === 'goldenvelocity')
  {
    return 'https://gametora.com/images/umamusume/skill_icons/utx_ico_skill_20012.png';
  }
  if (str === 'rainbowvelocity')
  {
    return 'https://gametora.com/images/umamusume/skill_icons/utx_ico_skill_20013.png';
  }
  if (str === 'velocitynegative')
  {
    return 'https://gametora.com/images/umamusume/skill_icons/utx_ico_skill_20014.png';
  }
  if (str === 'velocityspecial')
  {
    return 'https://gametora.com/images/umamusume/skill_icons/utx_ico_skill_20101.png';
  }
  if (str === 'goldenvelocityspecial')
  {
    return 'https://gametora.com/images/umamusume/skill_icons/utx_ico_skill_20102.png';
  }

  if (str === 'accel')
  {
    return 'https://gametora.com/images/umamusume/skill_icons/utx_ico_skill_20041.png';
  }
  if (str === 'goldenaccel')
  {
    return 'https://gametora.com/images/umamusume/skill_icons/utx_ico_skill_20042.png';
  }
  if (str === 'rainbowaccel')
  {
    return 'https://gametora.com/images/umamusume/skill_icons/utx_ico_skill_20043.png';
  }
  if (str === 'accelnegative')
  {
    return 'https://gametora.com/images/umamusume/skill_icons/utx_ico_skill_20044.png';
  }
  if (str === 'accelspecial')
  {
    return 'https://gametora.com/images/umamusume/skill_icons/utx_ico_skill_20121.png';
  }
  if (str === 'goldenaccelspecial')
  {
    return 'https://gametora.com/images/umamusume/skill_icons/utx_ico_skill_20122.png';
  }

  if (str === 'flow')
  {
    return 'https://gametora.com/images/umamusume/skill_icons/utx_ico_skill_20051.png';
  }
  if (str === 'goldenflow')
  {
    return 'https://gametora.com/images/umamusume/skill_icons/utx_ico_skill_20052.png';
  }
  if (str === 'flowspecial')
  {
    return 'https://gametora.com/images/umamusume/skill_icons/utx_ico_skill_20131.png';
  }
  if (str === 'goldenflowspecial')
  {
    return 'https://gametora.com/images/umamusume/skill_icons/utx_ico_skill_20132.png';
  }

  if (str === 'focus')
  {
    return 'https://gametora.com/images/umamusume/skill_icons/utx_ico_skill_20061.png';
  }
  if (str === 'goldenfocus')
  {
    return 'https://gametora.com/images/umamusume/skill_icons/utx_ico_skill_20062.png';
  }
  if (str === 'focusnegative')
  {
    return 'https://gametora.com/images/umamusume/skill_icons/utx_ico_skill_20064.png';
  }

  if (str === 'vision')
  {
    return 'https://gametora.com/images/umamusume/skill_icons/utx_ico_skill_20091.png';
  }
   if (str === 'goldenvision')
  {
    return 'https://gametora.com/images/umamusume/skill_icons/utx_ico_skill_20092.png';
  }

  if (str === 'velocitydebuff')
  {
    return 'https://gametora.com/images/umamusume/skill_icons/utx_ico_skill_30011.png';
  }
  if (str === 'goldenvelocitydebuff')
  {
    return 'https://gametora.com/images/umamusume/skill_icons/utx_ico_skill_30012.png';
  }

  if (str === 'acceldebuff')
  {
    return 'https://gametora.com/images/umamusume/skill_icons/utx_ico_skill_30021.png';
  }
  if (str === 'goldenacceldebuff')
  {
    return 'https://gametora.com/images/umamusume/skill_icons/utx_ico_skill_30022.png';
  }

  if (str === 'frenzy')
  {
    return 'https://gametora.com/images/umamusume/skill_icons/utx_ico_skill_30041.png';
  }

  if (str === 'recoverydebuff')
  {
    return 'https://gametora.com/images/umamusume/skill_icons/utx_ico_skill_30051.png';
  }
    if (str === 'goldenrecoverydebuff')
  {
    return 'https://gametora.com/images/umamusume/skill_icons/utx_ico_skill_30052.png';
  }

  if (str === 'visiondebuff')
  {
    return 'https://gametora.com/images/umamusume/skill_icons/utx_ico_skill_30071.png';
  }
  if (str === 'goldenvisiondebuff')
  {
    return 'https://gametora.com/images/umamusume/skill_icons/utx_ico_skill_30072.png';
  }
}

export function formatCardSkill(skillName, skillsJSON)
{
  const skill = skillsJSON.find(s => 
    s.skill_name.toLowerCase() === skillName.toLowerCase()
  );

  if (!skill) {
    return `${skillCategoryEmotes.default} ${skillName}`; // fallback
  }

  const emote = skillCategoryEmotes[skill.category] || skillCategoryEmotes.default;
  return `${emote} ${skillName}`;
}

export function buildSupporterEmbed(supporter, skills) {
  return {
    title: supporter.card_name + ' (' + supporter.rarity.toUpperCase() +')',
    description:
      '__Unique__ \n' +
      supporter.unique +
      '\n\n' +
      supporter.effects.map(e => `✨ ${e}`).join('\n') +
      '\n \u200B',
    color: getCardColor(supporter.category),
    thumbnail: { url: supporter.thumbnail },
    fields: [
      {
        name: 'Support Skills',
        value: supporter.support_skills
          .map(e => formatCardSkill(e, skills))
          .join('\n'),
        inline: true
      },
      {
        name: 'Event Skills',
        value: supporter.event_skills
          .map(e => formatCardSkill(e, skills))
          .join('\n'),
        inline: true
      }
    ],
    author: {
      name: supporter.character_name,
      icon_url: getCardTypeImageLink(supporter.category)
    },
    url: supporter.url
  };
}

export function buildSkillEmbed(skill, supporterList) {
  const fields = [
    {
      name: 'Skill Cost',
      value: skill.skill_cost + '\n \u200B',
      inline: true
    },
    {
      name: 'Points Value',
      value: skill.points_value + '\n \u200B',
      inline: true
    },
    {
      name: 'Points Ratio',
      value: skill.points_ratio + '\n \u200B',
      inline: true
    },
    {
      name: 'Team Trial',
      value: skill.team_trials + '\n \u200B',
      inline: true
    },
    {
      name: "Champion's Meeting",
      value: skill.champs_meet + '\n \u200B',
      inline: true
    },
    {
      name: 'Review',
      value: skill.review + '\n \u200B',
      inline: false
    },
    { 
      name: 'Available On', 
      value: supporterList + '\n \u200B', 
      inline: false 
    }
  ]

  if (skill.horse) {
    fields.push({
      name: 'Inherited from',
      value: skill.horse,
      inline: false
    })
  }

  return {
    title: skill.skill_name,
    description: skill.description +'\n \u200B' + (skill.inherited ? `\n**Inherited:**\n ${skill.inherited} \n \u200B` : ''),
    color: getSkillColor(skill.category),
    thumbnail: { url: getSkillThumbnail(skill.category)},
    fields: fields
  }
}

export function buildSkillComponents(skill, includeDropdown = false, supporters) {
  const rows = [];

  // Dropdown (if needed)
  if (includeDropdown) {
    rows.push({
      type: 1,
      components: [
        {
          type: 3, // SELECT_MENU
          custom_id: "supporter_lookup_select",
          placeholder: "Lookup an available card",
          options: supporters.map(s => ({
            label: `${s.character_name} - ${s.card_name} (${s.rarity.toUpperCase()})`,
            value: s.card_name
          }))
        }
      ]
    });
  }

  // Upgrade button (if skill has one)
  if (skill.upgrade) {
    rows.push({
      type: 1,
      components: [
        {
          type: 2,
          style: 1,
          label: `Upgrade → ${skill.upgrade}`,
          custom_id: `upgrade_${skill.upgrade}`
        }
      ]
    });
  }

  // Downgrade button (if skill has one)
  if (skill.downgrade) {
    rows.push({
      type: 1,
      components: [
        {
          type: 2,
          style: 1,
          label: `Downgrade → ${skill.downgrade}`,
          custom_id: `downgrade_${skill.downgrade}`
        }
      ]
    });
  }

  return rows;
}
