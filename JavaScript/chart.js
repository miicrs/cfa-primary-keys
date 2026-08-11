const chartContext = document.getElementById("budgetChart").getContext("2d"); // chart.js stuff 

// This creates the chart one time when the page loads starting empty 
// updateChart() below is what fills it in with real numbers later
const budgetChart = new Chart(chartContext, {
  type: "doughnut", // the kind of chart i picked out 
  data: {
    labels: [], // starts empty but later its filled in by updateChart()
    datasets: [{
      data: [],
      backgroundColor: [],
      borderColor: "#FFFFFF",
      borderWidth: 3
    }]
  },
  options: {
    responsive: true, // chart resizes itself to fit its container
    maintainAspectRatio: true,
    cutout: "50%", // how big the hole in the middle of the donut is
    plugins: {
      legend: { // styles the labele below the chart
        position: "bottom",
        labels: {
          color: "#6E6E6E",
          font: { family: "Helvetica", size: 11 },
          padding: 12,
          boxWidth: 10
        }
      },
      //this is the popup box that appears when you hover a slice
      tooltip: {
        backgroundColor: "#1A1A1A",
        titleFont: { family: "Helvetica" },
        bodyFont: { family: "Helvetica" },
        padding: 10,
        callbacks: {
          label: function (context) {
            return " " + context.label + ": $" + context.raw.toFixed(2);
          }
        }
      }
    },
    animation: false 
  }
});

// Colors handed out to each chart slice, in order. Loops back around once there are
// more slices than colors
const SLICE_COLORS = ["#2F9E8F", "#C97F2A", "#3E6FBF", "#8E4FBF", "#C24F6B", "#3F9E63", "#B79328"];

function updateChart(names, totals, remainingSlice) {
  const labels = names.slice();
  const data = totals.slice();

  if (remainingSlice > 0) {
    labels.push("Remaining");
    data.push(remainingSlice);
  }

  // Checks whether every number is still 0 so it 
  // shows a plain gray placeholder instead of an actual chart
  let isEmpty = true;
  for (let i = 0; i < data.length; i++) {
    if (data[i] > 0) {
      isEmpty = false;
    }
  }

  if (isEmpty) {
    budgetChart.data.labels = ["No data yet"];
    budgetChart.data.datasets[0].data = [1];
    budgetChart.data.datasets[0].backgroundColor = ["#EDEDED"];
  } else {
    budgetChart.data.labels = labels;
    budgetChart.data.datasets[0].data = data;

    // Picks each slice's color cycling through a color list,gray for the leftover Remaining slice
    const sliceColors = [];
    for (let i = 0; i < data.length; i++) {
      const isRemainingSlice = remainingSlice > 0 && i === data.length - 1;
      sliceColors.push(isRemainingSlice ? REMAINING_COLOR : SLICE_COLORS[i % SLICE_COLORS.length]);
    }
    budgetChart.data.datasets[0].backgroundColor = sliceColors;
  }
  budgetChart.update(); // redraws using the data set above
}