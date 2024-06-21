document.addEventListener('DOMContentLoaded', () => {
    const orderList = document.getElementById('order-list');
    const confirmOrderButton = document.getElementById('confirm-order');
    const clearOrderButton = document.getElementById('clear-order');

    // Fetch the aggregated orders from the backend
    fetch('http://localhost:3000/api/orders')
        .then(response => response.json())
        .then(data => {
            data.forEach(order => {
                const orderDiv = document.createElement('div');
                orderDiv.classList.add('order');

                orderDiv.innerHTML = `
                    <img src="${order.image}" alt="${order.name}">
                    <h2>${order.name} x${order.quantity}</h2>
                    <p>${order.description}</p>
                `;

                orderList.appendChild(orderDiv);
            });
        })
        .catch((error) => {
            console.error('Error:', error);
        });

    // Handle confirming the order
    confirmOrderButton.addEventListener('click', () => {
        fetch('http://localhost:3000/api/orders/confirm', {
            method: 'POST'
        })
        .then(response => response.json())
        .then(data => {
            alert('Order confirmed!');
            // Clear the displayed orders
            orderList.innerHTML = '';
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    });

    // Handle clearing the order
    clearOrderButton.addEventListener('click', () => {
        fetch('http://localhost:3000/api/orders/clear', {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            alert('Order cleared!');
            // Clear the displayed orders
            orderList.innerHTML = '';
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    });
});
