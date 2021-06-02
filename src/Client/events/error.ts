import Event from './Event';
export const onError: Event = {
  packetName: 'error',
  handler(error: Error) {
    console.log('Error:', error.stack);
    return null;
  }
};
