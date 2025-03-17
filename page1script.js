let rpmChart, voltageChart;

async function updateCharts() {
    try {
        const response = await fetch('http://localhost:5000/data');
        const data = await response.json();

        if (data.error) {
            console.error("Error:", data.error);
            return;
        }

        const rpmData = data.map(item => item.rpm);
        const voltageData = data.map(item => item.voltage);

        // Destroy previous charts if they exist
        if (rpmChart) rpmChart.destroy();
        if (voltageChart) voltageChart.destroy();

        rpmChart = new ApexCharts(document.querySelector("#chart1"), {
            chart: { type: 'line' },
            series: [{ name: "RPM", data: rpmData }],
            xaxis: { categories: rpmData.map((_, i) => i + 1) }
        });
        rpmChart.render();

        voltageChart = new ApexCharts(document.querySelector("#chart4"), {
            chart: { type: 'line' },
            series: [{ name: "Voltage", data: voltageData }],
            xaxis: { categories: voltageData.map((_, i) => i + 1) }
        });
        voltageChart.render();
    } catch (error) {
        console.error('Error updating charts:', error);
    }
}

// Update charts every 1 second
setInterval(updateCharts, 1000);
