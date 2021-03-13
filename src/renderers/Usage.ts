export const usageDataRenderer = (jsonData: { [k: string]: number }): any => {
  const [cmdLabels, cmdCount] = Object.entries(jsonData)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .reduce(
      (acc, elem) => {
        acc[0].push(elem[0]);
        acc[1].push(elem[1]);
        return acc;
      },
      [[], []],
    );

  return {
    type: 'outlabeledPie',
    data: {
      labels: cmdLabels,
      datasets: [
        {
          backgroundColor: [
            '#e27d60',
            '#085dcb',
            '#e8a87c',
            '#c38d9e',
            '#41b3a3',
            '#8d8741',
            '#659dbd',
            '#daad86',
            '#bc986a',
            '#fbeec1',
          ],
          data: cmdCount,
          borderColor: '#00000000',
        },
      ],
    },
    options: {
      title: {
        display: true,
        text: 'Command Usage',
      },
      legend: {
        position: 'right',
      },
      plugins: {
        outlabels: {
          text: '%l %p',
          color: 'black',
          stretch: 35,
          font: {
            minSize: 16,
          },
        },
      },
    },
  };
};
