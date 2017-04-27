var ctx = document.getElementById("myChart").getContext("2d");
ctx.canvas.width = 1000;
ctx.canvas.height = 300;
new Chart(ctx, {
  type: 'financial',
  data: {
    datasets: [{
      label: "My First dataset",
      data: [
        { t: 'April 01 2017', o: 70.87, h: 80.13, l: 40.94, c: 50.24 },
        { t: 1491091200000, o: 60.23, h: 200.23, l: 50.29, c: 90.20 },
        { t: 1491177600000, o: 40.00, h: 50.42, l: 20.31, c: 30.20 },
        { t: 1491264000000, o: 60.90, h: 80.34, l: 40.14, c: 60.29 },
        { t: 1491350400000, o: 60.94, h: 100.09, l: 50.78, c: 90.04 },
        { t: 1491436800000, o: 30.49, h: 50.20, l: 20.09, c: 40.20 },
        { t: 1491436800000, o: 50.04, h: 80.93, l: 40.94, c: 70.24 },
        { t: 1491609600000, o: 60.29, h: 100.49, l: 50.49, c: 90.24 },
        { t: 1491696000000, o: 40.04, h: 50.23, l: 20.23, c: 30.49 },
        { t: 1491782400000, o: 30.23, h: 50.09, l: 20.87, c: 40.49 }
      ]
    }]
  },
  options: {
      legend: {
          display: true,
          labels: {
              fontColor: 'rgb(255, 99, 132)',
              fontSize: 15,
              boxWidth: 190
          }
      }
  }
});
