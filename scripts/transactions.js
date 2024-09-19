document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.querySelector('tbody');

    async function fetchTransactions() {
        try {
            const response = await fetch('/api/transactions');
            if (!response.ok) {
                throw new Error('Network response was not ok: ' + response.statusText);
            }
            const transactions = await response.json();
            populateTable(transactions);
        } catch (error) {
            console.error('Error fetching transactions:', error);
        }
    }

    function populateTable(transactions) {
        tableBody.innerHTML = ''; // Clear existing rows
        transactions.forEach(transaction => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${transaction.employeeId.name}</td>
                <td>${transaction.employeeId.workID}</td>
                <td>${transaction.role}</td>
                <td>${transaction.action}</td>
                <td>${transaction.orderId}</td>
                <td>${new Date(transaction.timestamp).toLocaleString()}</td>
            `;
            tableBody.appendChild(row);
        });
    }

    fetchTransactions();
});
