google.charts.load('current',{packages:['corechart']});
google.charts.setOnLoadCallback(drawChart);
// Chart.defaults.line.spanGaps = true;

function drawChart() {
    summaryChart = document.getElementById('summaryChart')
    // Set Data
    var data_table = new google.visualization.DataTable();
    data_table.addColumn('date', 'Day');
    data_table.addColumn('number', 'Total Expense');
    data_table.addColumn('number', 'Total Income');

    fetch('http://localhost:8080/api/activities')
        .then(response => response.json())
        .then(data => {
            // Add a starting 0
            const [year, month, day] = data[0].date.split("-").map(Number);
            const localDate = new Date(year, month - 1, day);
            cummulative_income = 0;
            cummulative_expense = 0;
            data_table.addRow([localDate, 0, 0]);
            data.forEach(activity => {
                const [year, month, day] = activity.date.split("-").map(Number);
                const localDate = new Date(year, month - 1, day); // month is 0-indexed
                if (ACTIVITY_TYPES[activity.type]) {
                    cummulative_expense += Number(activity.amount)
                    data_table.addRow([localDate, NaN, cummulative_expense])
                } else {
                    cummulative_income += Number(activity.amount)
                    data_table.addRow([localDate, cummulative_income, NaN])
                }
            })
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
            chart.draw(data_table, options);
        });

    // data_table.addRows([
    //     [new Date('2003-01-01'), 100, 80],
    //     [new Date('2024-02-01'), NaN, 90],
    //     [new Date('2024-05-04'), NaN, 110],
    //     [new Date('2024-08-05'), 130, NaN],
    //     [new Date('2024-10-01'), 100, NaN],
    //     [new Date('2024-11-01'), NaN, 90],
    //     [new Date('2025-00-04'), NaN, 110],
    //     [new Date('2025-01-05'), 130, NaN],
    //     [new Date('2025-07-06'), 160, 120]
    // ]);
    
    // // Set Options
    // const options = {
    //     // title: 'House Prices vs Size',
    //     width: summaryChart.offsetWidth,
    //     // width: 500,
    //     height: summaryChart.offsetWidth*.6,
    //     // height: 400,
    //     // hAxis: {title: 'Square Meters'},
    //     vAxis: {title: 'Price in Millions'},
    //     // spanGaps: false,
    //     interpolateNulls: true,
    //     legend: 'none'
    // };
    // // Draw Chart
    // const chart = new google.visualization.LineChart(summaryChart);
    // chart.draw(data_table, options);
}

new ResizeObserver(drawChart).observe(document.getElementById('summaryChart'))

// function sleep(ms) {
//   return new Promise(resolve => setTimeout(resolve, ms));
// }

// async function a() {
// for (let i = 0; i < 100000; i++) {
//     await sleep(2000);
//         drawChart();
//         console.log(document.getElementById('summaryChart').clientWidth);
// }}

// a();