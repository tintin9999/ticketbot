import Event from './Event';
export const onReady: Event = {
  packetName: 'ready',
  handler() {
    console.log('ready');
    this.editStatus(null, {
<<<<<<< HEAD
      name: 'pp help',
=======
      name: 'pp create',
>>>>>>> 3c1bb4e92d1f3940820b078b6d1dae3a4d451ec0
      type: 1,
      url: 'https://www.twitch.tv/twitch'
    });
  }
};
