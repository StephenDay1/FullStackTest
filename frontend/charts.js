google.charts.load('current',{packages:['corechart']});
google.charts.setOnLoadCallback(drawChart);
// Chart.defaults.line.spanGaps = true;

var chartData;
async function updateChartData() {
    chartData = new google.visualization.DataTable();
    chartData.addColumn('date', 'Day');
    chartData.addColumn('number', 'Total Expense');
    chartData.addColumn('number', 'Total Income');

    chartData.addColumn('number', 'Net');

    await fetch('http://localhost:8080/api/activities')
    .then(response => response.json())
    .then(data => {
        // Add a starting 0
        const [year, month, day] = data[0].date.split("-").map(Number);
        const localDate = new Date(year, month - 1, day);
        cummulative_income = 0;
        cummulative_expense = 0;
        net = 0;
        chartData.addRow([localDate, 0, 0, 0]);
        data.forEach(activity => {
            const [year, month, day] = activity.date.split("-").map(Number);
            const localDate = new Date(year, month - 1, day); // month is 0-indexed
            // Show tithing as subtraction from income, not expense
            if (activity.type == "Tithing") {
                cummulative_income -= Number(activity.amount);
                net -= Number(activity.amount);
                chartData.addRow([localDate, cummulative_income, NaN, net]);
            } else
            // If it is an expense:
            if (ACTIVITY_TYPES[activity.type]) {
                // Delete this line to make graph not a staircase
                chartData.addRow([localDate, NaN, cummulative_expense, net]);
                cummulative_expense += Number(activity.amount);
                net -= Number(activity.amount);
                chartData.addRow([localDate, NaN, cummulative_expense, net]);
            } else {
                chartData.addRow([localDate, NaN, NaN, net]);
                cummulative_income += Number(activity.amount);
                net += Number(activity.amount);
                chartData.addRow([localDate, cummulative_income, NaN, net]);
            }
        });
    });
}

async function drawChart() {
    drawChartData = () => {
        summaryChart = document.getElementById('summaryChart')
        // Set Options
        const options = {
            // title: 'House Prices vs Size',
            width: summaryChart.offsetWidth,
            // width: 500,
            height: summaryChart.offsetWidth * .6,
            // height: 400,
            // hAxis: {title: 'Square Meters'},
            // vAxis: {title: '$'},
            // spanGaps: false,
            interpolateNulls: true,
            legend: 'none'
        };

        // Draw Chart
        const chart = new google.visualization.LineChart(summaryChart);
        chart.draw(chartData, options);
    }

    if (!chartData) {
        updateChartData().then(() => {
            drawChartData();
        });
    } else {
        drawChartData();
    }
}

new ResizeObserver(drawChart).observe(document.getElementById('summaryChart'));
