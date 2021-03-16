import { ICommand, CommandParams, CommandOutput } from '../Command';
import axios from 'axios';
import QuickChart from 'quickchart-js';
import { usageDataRenderer } from '../../renderers';

export default class DisplayDataCommand implements ICommand {
  name = 'usage';
  aliases = ['u', 'dd', 'display-data'];
  linkReg = /https:\/\/hastepaste.com\/view\/(?<linkID>.*)/;
  myChart = null;

  public async onLoad(): Promise<void> {
    this.myChart = new QuickChart();
    this.myChart.setWidth(640).setHeight(480).setBackgroundColor('#0D0C1D');
  }

  public async execute({ args }: CommandParams): Promise<CommandOutput> {
    this.linkReg.lastIndex = 0;
    const res = this.linkReg.exec(args[0]);
    if (!res) {
      return 'You need to provide a valid hastepaste link.';
    }

    let amount = 10;
    const { linkID } = res.groups;
    const rawLink = `https://hastepaste.com/raw/${linkID}`;
    const usage = await axios.get(rawLink);
    const jsonData: {
      [k: string]: number;
    } = JSON.parse(
      (usage.data as string).replace(/'/g, '"').replace(/\w+:/g, (s) => {
        const [pre] = s.split(':');
        return `"${pre}":`;
      }),
    );

    if (+args[1]) {
      +args[1] > 20 ? null : amount = +args[1];
    }

    this.myChart.setConfig(usageDataRenderer(jsonData, amount));
    return {
      author: {
        name: 'Hastepaste Link',
        url: args[0],
      },
      image: {
        url: this.myChart.getUrl(),
      },
      timestamp: new Date(),
    };
  }
}
