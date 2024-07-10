document.addEventListener('DOMContentLoaded', () => {
    // Dummy data for the most wanted item
    document.getElementById('most-wanted-item').innerText = 'Spaghetti Carbonara';

    // Dummy data for sales figures
    const salesData = {
        labels: ['May', 'June', 'July'],
        datasets: [{
            label: 'Sales Figures',
            data: [5000, 7000, 8000],
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
        }]
    };
    const ctx = document.getElementById('salesChart').getContext('2d');
    const salesChart = new Chart(ctx, {
        type: 'line',
        data: salesData,
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // Event listener for the add employee form
    document.getElementById('addEmployeeForm').addEventListener('submit', function(event) {
        event.preventDefault();
        // Dummy response for adding an employee
        document.getElementById('employee-status').innerText = 'Employee added successfully!';
    });
});

function generateMonthlyReport() {
    // Dummy function to simulate report generation
    document.getElementById('report-status').innerText = 'Monthly report generated successfully!';
}

function downloadWeeklyReport() {
    // Dummy function to simulate downloading a weekly report
    document.getElementById('report-status').innerText = 'Weekly report downloaded successfully!';
}
