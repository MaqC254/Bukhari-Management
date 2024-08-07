document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Fetch the most wanted item
        const mostWantedResponse = await fetch('http://localhost:3000/api/most-wanted-item');
        const mostWantedItem = await mostWantedResponse.json();
        document.getElementById('most-wanted-item').textContent = `${mostWantedItem._id} (ordered ${mostWantedItem.totalOrdered} times)`;

        // Fetch sales figures for the current month (example for a specific month, e.g., July)
        const salesResponse = await fetch('http://localhost:3000/api/items/8');
        const salesData = await salesResponse.json();

        const labels = salesData.map(item => item._id);
        const data = salesData.map(item => item.totalOrdered);

        // Create sales chart
        const ctx = document.getElementById('salesChart').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Total Orders',
                    data: data,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    } catch (err) {
        console.error('Error fetching data:', err);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const generateMonthlyReportBtn = document.getElementById('generateMonthlyReportBtn');
    if (generateMonthlyReportBtn) {
        generateMonthlyReportBtn.addEventListener('click', async () => {
            const now = new Date();
            const year = now.getFullYear();
            const month = now.getMonth() + 1; // getMonth() returns 0-indexed month

            try {
                const response = await fetch(`http://localhost:3000/api/reports/monthly/${year}/${month}`);
                if (!response.ok) {
                    throw new Error('Failed to download file');
                }
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                a.download = `monthly-report-${year}-${month}.xlsx`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
            } catch (err) {
                console.error('Error generating or downloading monthly report:', err);
                // Handle error and provide feedback to the user
            }
        });
    }
});


