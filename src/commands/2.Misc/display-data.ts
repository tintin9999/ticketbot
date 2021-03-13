import { ICommand, CommandParams, CommandOutput } from '../Command';
import fetch from 'node-fetch';
import QuickChart from 'quickchart-js';

export default class DisplayDataCommand implements ICommand {
  name = 'display-data';
  aliases = ['dd'];
  linkReg = /https:\/\/hastepaste.com\/view\/(?<linkID>.*)/;
  myChart = null;

  public async onLoad(): Promise<void> {
    this.myChart = new QuickChart();
  }

  public async execute({ args }: CommandParams): Promise<CommandOutput> {
    this.linkReg.lastIndex = 0;
    const res = this.linkReg.exec(args[0]);
    if (!res) {
      return 'You need to provide a valid hastepaste link.';
    }

    const { linkID } = res.groups;
    const rawLink = `https://hastepaste.com/raw/${linkID}`;
    const data = await fetch(rawLink);
    const jsonData: {
      [k: string]: number;
    } = await data.json();

    const [cmdLabels, cmdCount] = Object.entries(jsonData)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .reduce((acc, elem) => {
        acc[0].push(elem[0]);
        acc[1].push(elem[1]);
        return acc;
      }, [[], []]);

    this.myChart.setConfig({
      type: 'pie',
      data: {
        labels: cmdLabels,
        datasets: [{
          data: cmdCount
        }]
      }
    }).setWidth(640).setHeight(480);
    return {
      image: {
        url: this.myChart.getUrl()
      }
    };
  }
}
