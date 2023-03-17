export const Colors = {
  error: 0xeb3734,
  success: 0x1af053,
  twitch: 0x6441a5,
  youtube: 0xff0000,
  gray: 0x474d49,
  random: () => +`0x${Math.floor(Math.random() * 16777215).toString(16)}`,
};
