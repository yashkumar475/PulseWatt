const allDropdown = document.querySelectorAll('#sidebar .side-dropdown');
const sidebar = document.getElementById('sidebar');

allDropdown.forEach(item => {
	const a = item.parentElement.querySelector('a:first-child');
	a.addEventListener('click', function (e) {
		e.preventDefault();

		if (!this.classList.contains('active')) {
			allDropdown.forEach(i => {
				const aLink = i.parentElement.querySelector('a:first-child');

				aLink.classList.remove('active');
				i.classList.remove('show');
			})
		}

		this.classList.toggle('active');
		item.classList.toggle('show');
	})
})





// SIDEBAR COLLAPSE
const toggleSidebar = document.querySelector('nav .toggle-sidebar');
const allSideDivider = document.querySelectorAll('#sidebar .divider');

if (sidebar.classList.contains('hide')) {
	allSideDivider.forEach(item => {
		item.textContent = '-'
	})
	allDropdown.forEach(item => {
		const a = item.parentElement.querySelector('a:first-child');
		a.classList.remove('active');
		item.classList.remove('show');
	})
} else {
	allSideDivider.forEach(item => {
		item.textContent = item.dataset.text;
	})
}

toggleSidebar.addEventListener('click', function () {
	sidebar.classList.toggle('hide');

	if (sidebar.classList.contains('hide')) {
		allSideDivider.forEach(item => {
			item.textContent = '-'
		})

		allDropdown.forEach(item => {
			const a = item.parentElement.querySelector('a:first-child');
			a.classList.remove('active');
			item.classList.remove('show');
		})
	} else {
		allSideDivider.forEach(item => {
			item.textContent = item.dataset.text;
		})
	}
})




sidebar.addEventListener('mouseleave', function () {
	if (this.classList.contains('hide')) {
		allDropdown.forEach(item => {
			const a = item.parentElement.querySelector('a:first-child');
			a.classList.remove('active');
			item.classList.remove('show');
		})
		allSideDivider.forEach(item => {
			item.textContent = '-'
		})
	}
})



sidebar.addEventListener('mouseenter', function () {
	if (this.classList.contains('hide')) {
		allDropdown.forEach(item => {
			const a = item.parentElement.querySelector('a:first-child');
			a.classList.remove('active');
			item.classList.remove('show');
		})
		allSideDivider.forEach(item => {
			item.textContent = item.dataset.text;
		})
	}
})




// PROFILE DROPDOWN
const profile = document.querySelector('nav .profile');
const imgProfile = profile.querySelector('img');
const dropdownProfile = profile.querySelector('.profile-link');

imgProfile.addEventListener('click', function () {
	dropdownProfile.classList.toggle('show');
})




// MENU
const allMenu = document.querySelectorAll('main .content-data .head .menu');

allMenu.forEach(item => {
	const icon = item.querySelector('.icon');
	const menuLink = item.querySelector('.menu-link');

	icon.addEventListener('click', function () {
		menuLink.classList.toggle('show');
	})
})



window.addEventListener('click', function (e) {
	if (e.target !== imgProfile) {
		if (e.target !== dropdownProfile) {
			if (dropdownProfile.classList.contains('show')) {
				dropdownProfile.classList.remove('show');
			}
		}
	}

	allMenu.forEach(item => {
		const icon = item.querySelector('.icon');
		const menuLink = item.querySelector('.menu-link');

		if (e.target !== icon) {
			if (e.target !== menuLink) {
				if (menuLink.classList.contains('show')) {
					menuLink.classList.remove('show')
				}
			}
		}
	})
})



// APEXCHART
/*function updateChartFromTable() {
    const tbody = document.getElementById("data-body");
    if (!tbody) {
        console.error("Error: Table body not found!");
        return;
    }

    const rows = tbody.querySelectorAll("tr");
    let chartData = [];

    rows.forEach(row => {
        const cells = row.getElementsByTagName("td");
        if (cells.length >= 8) {
            const timestampText = cells[4].innerText.trim();  // Timestamp column
            const energyText = cells[7].innerText.trim(); // Energy_Wh column

            const energy = parseFloat(energyText);
            const timestamp = new Date(timestampText).getTime(); // Convert to milliseconds

            if (!isNaN(energy) && !isNaN(timestamp)) {
                chartData.push([timestamp, energy]); // Store in ApexCharts format
            }
        }
    });

    if (chartData.length > 0) {
        chartData.sort((a, b) => a[0] - b[0]); // Ensure data is sorted by time

        chart.updateSeries([{
            name: 'Total Energy (Wh)',
            data: chartData
        }]);
    }
}

// Initialize the ApexCharts instance
var options = {
    series: [{
        name: 'Total Energy (Wh)',
        data: []
    }],
    chart: {
        height: 350,
        type: 'area'
    },
    dataLabels: {
        enabled: false
    },
    stroke: {
        curve: 'smooth'
    },
    xaxis: {
        type: 'datetime'
    },
    tooltip: {
        x: {
            format: 'dd/MM/yy HH:mm'
        }
    }
};

var chart = new ApexCharts(document.querySelector("#chart"), options);
chart.render();

// Ensure the chart updates when new rows are added
function observeTableChanges() {
    const targetNode = document.getElementById("data-body");
    if (!targetNode) {
        console.error("Error: Table body not found for mutation observer!");
        return;
    }

    const observer = new MutationObserver(() => {
        updateChartFromTable(); // Update chart whenever new rows are added
    });

    observer.observe(targetNode, { childList: true });
}

// Start observing table updates
observeTableChanges();










// This is to fetch data in the table 

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
*/
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

        appendRows(dataArray); // Append new data to table
        updateChartFromTable(); // Update the chart immediately
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

// CHART CONFIGURATION
var options = {
    series: [{
        name: 'Total Energy (Wh)',
        data: []
    }],
    chart: {
        height: 350,
        type: 'area'
    },
    dataLabels: {
        enabled: false
    },
    stroke: {
        curve: 'smooth'
    },
    xaxis: {
        type: 'datetime'
    },
    tooltip: {
        x: {
            format: 'dd/MM/yy HH:mm'
        }
    }
};

var chart = new ApexCharts(document.querySelector("#chart"), options);
chart.render();

// FUNCTION TO UPDATE CHART FROM TABLE
function updateChartFromTable() {
    const tbody = document.getElementById("data-body");
    if (!tbody) {
        console.error("Error: Table body not found!");
        return;
    }

    const rows = tbody.querySelectorAll("tr");
    let chartData = [];

    rows.forEach(row => {
        const cells = row.getElementsByTagName("td");
        if (cells.length >= 8) {
            const timestampText = cells[4].innerText.trim();  // Timestamp column
            const energyText = cells[7].innerText.trim(); // Energy_Wh column

            const energy = parseFloat(energyText);
            const timestamp = new Date(timestampText).getTime(); // Convert to timestamp

            if (!isNaN(energy) && !isNaN(timestamp)) {
                chartData.push([timestamp, energy]); // ApexCharts expects [timestamp, value]
            }
        }
    });

    if (chartData.length > 0) {
        chartData.sort((a, b) => a[0] - b[0]); // Ensure data is sorted by time

        chart.updateSeries([{
            name: 'Total Energy (Wh)',
            data: chartData
        }]);
    }
}

// Fetch data every 3 seconds
setInterval(fetchData, 3000);
