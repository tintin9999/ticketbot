import Handler from './Handler';

export const lotteryAnnouncer: Handler = async function (msg) {
  if (msg.channel.id !== '816669934218117160') { // #lottery in LoN
    return null;
  }

  try { 
    msg.crosspost(); 
  } catch (e) { 
    console.error(e.stack);
  }
  return console.log('Successfully auto-published lottery message');
};
