import 'dotenv/config';
import { getRPSChoices } from './game.js';
import { capitalize, InstallGlobalCommands } from './utils.js';

// Get the game choices from game.js
function createCommandChoices() {
  const choices = getRPSChoices();
  const commandChoices = [];

  for (let choice of choices) {
    commandChoices.push({
      name: capitalize(choice),
      value: choice.toLowerCase(),
    });
  }

  return commandChoices;
}

// Simple test command
const TEST_COMMAND = {
  name: 'test',
  description: 'Basic command',
  type: 1,
  integration_types: [0, 1],
  contexts: [0, 1, 2],
};

const SUPPORTER_COMMAND = {
  name: 'supporter',
  description: 'Lookup a supporter card',
  options: [
    {
      type: 3,
      name: 'name',
      description: 'Name of the card or character',
      required: true
    },
  ],
  type: 1,
  integration_types: [0, 1],
  contexts: [0, 1, 2],
};

const SKILL_COMMAND = {
  name: 'skill',
  description: 'Lookup a skill',
  options: [
    {
      type: 3,
      name: 'name',
      description: 'Name of the skill',
      required: true
    },
  ],
  type: 1,
  integration_types: [0, 1],
  contexts: [0, 1, 2],
};

const UMA_COMMAND = {
  name: 'uma',
  description: 'Lookup a horse',
  options: [
    {
      type: 3,
      name: 'name',
      description: 'Name of the horse',
      required: true
    },
  ],
  type: 1,
  integration_types: [0, 1],
  contexts: [0, 1, 2],
};

const EVENT_COMMAND = {
  name: 'event',
  description: 'Lookup an event',
  options: [
    {
      type: 3,
      name: 'name',
      description: 'Name of the event',
      required: true
    },
  ],
  type: 1,
  integration_types: [0, 1],
  contexts: [0, 1, 2],
};

const LOG_COMMAND = {
  name: 'log',
  description: 'Log fan count into the sheets',
  options: [
    {
      type: 4,
      name: 'fancount',
      description: 'Amount of fans currently',
      required: true
    },
  ],
  type: 1,
  integration_types: [0, 1],
  contexts: [0, 1, 2],
};

const USER_COMMAND = {
  name: 'trainer',
  description: 'Look up a user in the club',
  options: [
    {
      type: 4,
      name: 'name',
      description: 'Name of the trainer in the club',
      required: true
    },
  ],
  type: 1,
  integration_types: [0, 1],
  contexts: [0, 1, 2],
};

const LEADERBOARD_COMMAND = {
  name: 'leaderboard',
  description: 'See the current rankings of the month',
  options: [
    {
      type: 4,
      name: 'sort',
      description: 'Check the monthly leaderboard',
      required: false
    },
  ],
  type: 1,
  integration_types: [0, 1],
  contexts: [0, 1, 2],
};

const PARSE_COMMAND = {
  name: 'parse',
  description: 'Scan an uma image and extract the values into a usable format for Umalator',
  options: [
    {
      type: 11,
      name: 'image',
      description: 'Upload a screenshot of your uma',
      required: true
    },
  ],
  type: 1,
  integration_types: [0, 1],
  contexts: [0, 1, 2],
};



const ALL_COMMANDS = [SUPPORTER_COMMAND, SKILL_COMMAND, UMA_COMMAND, EVENT_COMMAND, LOG_COMMAND, USER_COMMAND, LEADERBOARD_COMMAND, PARSE_COMMAND];

InstallGlobalCommands(process.env.APP_ID, ALL_COMMANDS);
