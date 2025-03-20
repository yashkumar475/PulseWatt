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
// setInterval(updateCharts, 1000);





document.addEventListener("DOMContentLoaded", function () {
    let charts = {}; // Store chart instances

    const chartConfig = [
        { id: "chart1", title: "RPM", key: "RPM" },
        { id: "chart3", title: "Temperature", key: "Temperature" },
        { id: "chart5", title: "Current (A)", key: "Current" },
        { id: "chart4", title: "Voltage (V)", key: "Voltage" },
        { id: "chart6", title: "Total Energy", key: "TotalEnergy" }
    ];

    // Initialize charts
    chartConfig.forEach(({ id, title }) => {
        let chartElement = document.getElementById(id);

        if (!chartElement) {
            console.warn(`⚠️ Chart container '${id}' not found!`);
            return;
        }

        let options = {
            series: [0], // Initially set to zero
            chart: { type: "radialBar", height: 250 },
            plotOptions: {
                radialBar: {
                    startAngle: -90,
                    endAngle: 270,
                    track: { background: "#e7e7e7", strokeWidth: "97%" },
                    dataLabels: {
                        name: { offsetY: 20, show: true, fontSize: "16px" },
                        value: { offsetY: 20, fontSize: "18px", formatter: val => val }
                    }
                }
            },
            labels: [title],
            colors: ["#008FFB"]
        };

        charts[id] = new ApexCharts(chartElement, options);
        charts[id].render();
    });

    // Fetch and update data
    async function fetchData() {
        try {
            console.log("📡 Fetching data...");
            const response = await fetch("https://pulsewatt-backend.onrender.com/data");
            const data = await response.json();

            if (!data || !Array.isArray(data) || data.length === 0) {
                console.warn("⚠️ No valid data received from API!");
                return;
            }

            const latestData = data[data.length - 1]; // Take the most recent row

            console.log("🔍 Latest Data:", latestData);

            chartConfig.forEach(({ id, key }) => {
                if (charts[id] && latestData.hasOwnProperty(key)) {
                    let value = parseFloat(latestData[key]);
                    if (!isNaN(value)) {
                        console.log(`🔄 Updating ${id} with value:`, value);
                        charts[id].updateSeries([value]);
                    } else {
                        console.warn(`⚠️ Invalid data for ${key}:`, latestData[key]);
                    }
                } else {
                    console.warn(`⚠️ Missing key '${key}' in API response!`);
                }
            });

        } catch (error) {
            console.error("❌ Error fetching data:", error);
        }
    }

    // Update data every 3 seconds
    setInterval(fetchData, 3000);
    fetchData(); // Initial call
});
