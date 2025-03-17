async function fetchData() {
    try {
        const response = await fetch('https://pulsewatt-backend.onrender.com/data');
        const data = await response.json();

        if (data.error) {
            console.error("Error:", data.error);
            return;
        }

        // Get table body and clear previous data
        const tableBody = document.getElementById('data-body');
        tableBody.innerHTML = ""; 

        // Update table data
        data.forEach((item, index) => {
            const row = `<tr>
                <td>${index + 1}</td>
                <td>${item.equipmentID}</td>
                <td>${item.rpm}</td>
                <td>${item.voltage}</td>
                <td>${item.timestamp}</td>
                <td>${item.temperature}</td>
                <td>${item.current}</td>
            </tr>`;
            tableBody.innerHTML += row;
        });
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}
// Fetch data every 3 second
setInterval(fetchData, 3000);