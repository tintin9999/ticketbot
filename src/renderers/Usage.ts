const colors = [
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
];

const randomColor = () => colors[Math.floor(Math.random() * colors.length)];

export const usageDataRenderer = (
  jsonData: { [k: string]: number },
  count = 10,
): any => {
  const [cmdLabels, cmdCount] = Object.entries(jsonData)
    .sort((a, b) => b[1] - a[1])
    .slice(0, count)
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
          backgroundColor:
            count === 10
              ? colors
              : new Array(count).fill(null).map(randomColor),
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
          stretch: 30,
          font: {
            minSize: 14,
          },
        },
      },
    },
  };
};
