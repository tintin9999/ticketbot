import { ICommand, CommandParams, CommandOutput } from '../Command';
import { Restricted } from '../decorators';
import { config } from '../../';
import axios from 'axios';
import QuickChart from 'quickchart-js';
import { usageDataRenderer } from '../../renderers';

@Restricted({ userIDs: [...config.botMods, ...config.owners] })
export default class DisplayDataCommand implements ICommand {
  name = 'usage';
  aliases = ['u', 'dd', 'display-data'];
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
    const usage = await axios.get(rawLink);
    const jsonData: {
      [k: string]: number;
    } = JSON.parse(
      (usage.data as string).replace(/'/g, '"').replace(/\w+:/g, (s) => {
        const [pre] = s.split(':');
        return `"${pre}":`;
      }),
    );

    this.myChart.setConfig(usageDataRenderer(jsonData, Number.isNaN(+args[1]) ? 10 : +args[1]));
    return {
      title: 'Command Usage Data',
      image: {
        url: this.myChart.getUrl(),
      },
    };
  }
}
