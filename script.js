async function fetchData() {
    try {
        const response = await fetch('https://pulsewatt-backend.onrender.com/data');
        const data = await response.json();

        if (!data) {
            console.error("Error: Received null or undefined data");
            return;
        }

        // Ensure data is always an array
        const dataArray = Array.isArray(data) ? data : [data];

        appendRows(dataArray); // Append new data without clearing the table
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Store seen timestamps to prevent duplicate rows
const seenTimestamps = new Set();

function appendRows(dataArray) {
    const tbody = document.getElementById('data-body');

    dataArray.forEach(item => {
        const uniqueKey = `${item.Equipment_ID}-${item.Timestamp}`;

        if (!seenTimestamps.has(uniqueKey)) {
            seenTimestamps.add(uniqueKey);

            // Create a new row
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${tbody.rows.length + 1}</td>
                <td>${item.Equipment_ID}</td>
                <td>${item.RPM_rev_min}</td>
                <td>${item.Voltage_V}</td>
                <td>${item.Timestamp}</td>
                <td>${item.Temperature_C}</td>
                <td>${item.Current_A}</td>
                <td>${item.Energy_Wh}</td>
            `;
            tbody.appendChild(row);
        }
    });
}

// Fetch data every 3 seconds
setInterval(fetchData, 3000);
