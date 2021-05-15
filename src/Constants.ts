export const REPO_URL = 'https://github.com/tintin9999/ticketbot';

export enum Defaults {
  RESULTS_PER_PAGE = 5,
}

export enum Permissions {
  CREATE_INSTANT_INVITE = 1 << 0,
  KICK_MEMBERS          = 1 << 1,
  BAN_MEMBERS           = 1 << 2,
  ADMINISTRATOR         = 1 << 3,
  MANAGE_CHANNELS       = 1 << 4,
  MANAGE_GUILD          = 1 << 5,
  ADD_REACTIONS         = 1 << 6,
  VIEW_AUDIT_LOG        = 1 << 7,
  PRIORITY_SPEAKER      = 1 << 8,
  STREAM                = 1 << 9,
  VIEW_CHANNEL          = 1 << 10,
  SEND_MESSAGES         = 1 << 11,
  SEND_TTS_MESSAGES     = 1 << 12,
  MANAGE_MESSAGES       = 1 << 13,
  EMBED_LINKS           = 1 << 14,
  ATTACH_FILES          = 1 << 15,
  READ_MESSAGE_HISTORY  = 1 << 16,
  MENTION_EVERYONE      = 1 << 17,
  USE_EXTERNAL_EMOJIS   = 1 << 18,
  CONNECT               = 1 << 20,
  SPEAK                 = 1 << 21,
  MUTE_MEMBERS          = 1 << 22,
  DEAFEN_MEMBERS        = 1 << 23,
  MOVE_MEMBERS          = 1 << 24,
  USE_VAD               = 1 << 25,
  CHANGE_NICKNAME       = 1 << 26,
  MANAGE_NICKNAMES      = 1 << 27,
  MANAGE_ROLES          = 1 << 28,
  MANAGE_WEBHOOKS       = 1 << 29,
  MANAGE_EMOJIS         = 1 << 30,
}

export enum EmbedLimits {
  MAX_FIELD_VALUE = 1024,
}

export const basicHelp = ['- pp request: request for the bot to be usable in your server', 
'- pp whitelist <role | channel | user> <role id or channel id>: whitelist a role or channel ID\nExample: ```\npp wl user 266432078222983169```', 
'- pp unwhitelist <role, user or channel id>: remove a role, channel or user ID from the whitelist\nExample: ```\npp unwl 829240309749514281```', 
'- pp show-whitelist: show what users/roles/channels can access the bot, only users with certain roles that are also in the whitelisted channels will get a response to commands',
'\n- example ticket:\n```\npp create Rule 6, ID: 266432078222983169\nproof: https://i.imgur.com/o3u5aD2.png```'
];
