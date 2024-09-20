async function fetchOrderHistory() {
    // Get the waiter ID from local storage
    const waiterId = localStorage.getItem('workId');
    if (!waiterId) {
        alert('Waiter ID not found in local storage.');
        return;
    }

    try {
        // Fetch all served orders
        const response = await fetch('/order-history');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const orders = await response.json();
        // Filter orders by waiter ID
        const waiterOrders = orders.filter(order => order.waiterId === waiterId);
        displayOrderHistory(waiterOrders);
    } catch (error) {
        console.error('Error fetching order history:', error);
    }
}

function displayOrderHistory(orders) {
    const orderHistoryDiv = document.getElementById('order-history');
    orderHistoryDiv.innerHTML = ''; // Clear previous results

    if (orders.length === 0) {
        orderHistoryDiv.innerHTML = '<p>No orders found for this waiter.</p>';
        return;
    }

    orders.forEach(order => {
        const orderElement = document.createElement('div');
        orderElement.className = 'order-item';
        orderElement.innerHTML = `
            <p>Name: ${order.name}</p>
            <p>Description: ${order.description}</p>
            <p>Quantity: ${order.quantity}</p>
            <p>Price: ${order.price}</p>
            <p>Table Number: ${order.tableNumber}</p>
            <p>Served At: ${new Date(order.createdAt).toLocaleString()}</p>
        `;
        orderHistoryDiv.appendChild(orderElement);
    });
}

// Load order history on page load
window.onload = fetchOrderHistory;
