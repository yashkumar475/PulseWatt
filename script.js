document.addEventListener("DOMContentLoaded", () => {
    const sidebar = document.getElementById('sidebar');
    const allDropdown = document.querySelectorAll('#sidebar .side-dropdown');
    const allSideDivider = document.querySelectorAll('#sidebar .divider');
    const toggleSidebar = document.querySelector('nav .toggle-sidebar');
    const profile = document.querySelector('nav .profile');
    const imgProfile = profile.querySelector('img');
    const dropdownProfile = profile.querySelector('.profile-link');
    const allMenu = document.querySelectorAll('main .content-data .head .menu');
    const tbody = document.getElementById('data-body');
    const energyValues = [101.54, 131.36, 170.06, 174.10, 373.24, 260.38, 52.68, 65.88, 245.12, 307.92, 244.58, 
        201.86, 35.00, 0.00, 133.00, 99.20, 278.86, 184.76, 278.94, 240.72, 339.92, 422.66, 147.44, 269.34, 50.32, 
        29.62, 6.36, 0.00, 117.22, 91.80, 113.70, 27.46, 36.00, 106.38, 180.90, 153.20, 66.58, 353.16, 361.10, 
        383.60, 328.32, 27.22, 80.76, 36.96, 181.30, 198.48, 399.10, 264.06, 97.94, 83.92, 49.18, 19.94, 389.22, 
        284.12, 169.68, 267.32, 188.82, 116.60, 154.32, 116.36, 76.44, 47.46, 225.30, 105.14, 178.88, 358.28, 
        85.10, 99.68, 61.12, 67.64, 126.94, 185.96, 96.70, 150.12, 80.72, 199.50, 163.68, 221.82, 79.64, 148.78, 
        196.42, 203.36, 383.74, 342.62, 0.00, 151.20, 61.12, 179.30];
    const seenTimestamps = new Set();

    allDropdown.forEach(item => {
        const link = item.parentElement.querySelector('a:first-child');
        link.addEventListener('click', e => {
            e.preventDefault();
            allDropdown.forEach(i => {
                i.parentElement.querySelector('a:first-child').classList.remove('active');
                i.classList.remove('show');
            });
            link.classList.toggle('active');
            item.classList.toggle('show');
        });
    });

    const updateSidebar = () => {
        const hide = sidebar.classList.contains('hide');
        allSideDivider.forEach(item => item.textContent = hide ? '-' : item.dataset.text);
        allDropdown.forEach(item => {
            const link = item.parentElement.querySelector('a:first-child');
            link.classList.remove('active');
            item.classList.remove('show');
        });
    };

    toggleSidebar.addEventListener('click', () => {
        sidebar.classList.toggle('hide');
        updateSidebar();
    });

    sidebar.addEventListener('mouseenter', updateSidebar);
    sidebar.addEventListener('mouseleave', updateSidebar);

    imgProfile.addEventListener('click', () => {
        dropdownProfile.classList.toggle('show');
    });

    allMenu.forEach(item => {
        const icon = item.querySelector('.icon');
        const menuLink = item.querySelector('.menu-link');
        icon.addEventListener('click', () => menuLink.classList.toggle('show'));
    });

    window.addEventListener('click', e => {
        if (!profile.contains(e.target)) dropdownProfile.classList.remove('show');
        allMenu.forEach(item => {
            if (!item.contains(e.target)) item.querySelector('.menu-link').classList.remove('show');
        });
    });

    async function fetchData() {  
        try {
            const response = await fetch('https://pulsewatt-backend.onrender.com/data');
            const data = await response.json();
            if (data) appendRows(Array.isArray(data) ? data : [data]);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    function appendRows(dataArray) {
        dataArray.forEach(item => {
            const uniqueKey = `${item.Equipment_ID}-${item.Timestamp}`;
            if (!seenTimestamps.has(uniqueKey)) {
                seenTimestamps.add(uniqueKey);
    
                const rowCount = tbody.rows.length; // Get row count before appending
    
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${rowCount + 1}</td>
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
    

    setInterval(fetchData, 3000);

    var chart = new ApexCharts(document.querySelector("#chart"), {
        series: [{ name: 'Total Energy (Wh)', data: [] }],
        chart: { height: 350, type: 'area', animations: { enabled: true, easing: 'linear', dynamicAnimation: { speed: 1000 } } },
        colors: ['#ff9800'],
        dataLabels: { enabled: false },
        stroke: { curve: 'smooth', width: 3 },
        xaxis: { type: 'datetime', labels: { format: 'HH:mm:ss' } },
        tooltip: { x: { format: 'HH:mm:ss' } }
    });
    chart.render();

    function updateChart() {
        const now = new Date().getTime();
        const randomEnergy = energyValues[Math.floor(Math.random() * energyValues.length)];
        let newData = chart.w.config.series[0].data;
        newData.push([now, randomEnergy]);
        if (newData.length > 20) newData = newData.slice(-20);
        chart.updateSeries([{ name: 'Total Energy (Wh)', data: newData }]);
        setTimeout(updateChart, Math.floor(Math.random() * 4000) + 1000);
    }

    updateChart();
});
