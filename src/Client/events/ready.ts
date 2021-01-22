import Event from './Event';
export const onReady: Event = {
  packetName: 'ready',
  handler() {
    console.log('ready');
    this.editStatus(null, {
      name: 'pp help',
      type: 1,
      url: 'https://www.twitch.tv/twitch'
    });
  }
};
