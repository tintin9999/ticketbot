import { ICommand, CommandParams, CommandOutput } from '../Command';
import axios from 'axios';
import QuickChart from 'quickchart-js';
import { usageDataRenderer } from '../../renderers';

export default class DisplayDataCommand implements ICommand {
  name = 'display-data';
  aliases = ['dd'];
  linkReg = /https:\/\/hastepaste.com\/view\/(?<linkID>.*)/;
  myChart = null;

  public async onLoad(): Promise<void> {
    this.myChart = new QuickChart();
    this.myChart.setWidth(640).setHeight(480).setBackgroundColor('#0d0c1d');
  }

  public async execute({ args }: CommandParams): Promise<CommandOutput> {
    this.linkReg.lastIndex = 0;
    const res = this.linkReg.exec(args[0]);
    if (!res) {
      return 'You need to provide a valid hastepaste link.';
    }

    const { linkID } = res.groups;
    const rawLink = `https://hastepaste.com/raw/${linkID}`;
    const data = await axios.get(rawLink);
    const jsonData: {
      [k: string]: number;
    } = JSON.parse(
      (data.data as string).replace(/'/g, '"').replace(/\w+:/g, (s) => {
        const [pre] = s.split(':');
        return `"${pre}":`;
      }),
    );

    this.myChart.setConfig(usageDataRenderer(jsonData));
    return {
      image: {
        url: this.myChart.getUrl(),
      },
    };
  }
}
