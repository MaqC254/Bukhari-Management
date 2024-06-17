const express = require('express');
const app = express();
const path = require('path');
const port = 3000;


// Middleware to serve static files from 'pages' directory
app.use(express.static(path.join(__dirname, 'pages')));
app.use('/styles', express.static(path.join(__dirname, 'styles')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/scripts', express.static(path.join(__dirname, 'scripts')));

// Route to serve the homepage
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages', 'index.html'));
});
// Route to serve the menu page
app.get('/pages/menu.html/', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'menu.html'));
});
app.get('/pages/cart.html/', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'cart.html'));
});
app.get('/pages/cash.html/', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'cash.html'));
});
app.get('/pages/customer_signin.html/', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'customer_signin.html'));
});
app.get('/pages/customer_signup.html/', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'customer_signup.html'));
});
app.get('/pages/Delivery.html/', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'Delivery.html'));
});
app.get('/pages/deliveryCart.html/', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'deliveryCart.html'));
});
app.get('/pages/deliveryMenu.html/', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'deliveryMenu.html'));
});
app.get('/pages/drinks.html/', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'drinks.html'));
});
app.get('/pages/employee_signin.html/', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'employee_signin.html'));
});
app.get('/pages/employee_signup.html/', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'employee_signup.html'));
});
app.get('/pages/mobile.html/', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'mobile.html'));
});
app.get('/pages/online_checkout.html/', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'online_checkout.html'));
});
app.get('/pages/order_details.html/', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'order_details.html'));
});
app.get('/pages/orderstate.html/', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'orderstate.html'));
});
app.get('/pages/payment_details.html/', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'payment_details.html'));
});
app.get('/pages/server.html/', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'server.html'));
});
app.get('/pages/snack.html/', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'snack.html'));
});
app.get('/pages/venueMenu.html/', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'venueMenu.html'));
});
app.get('/pages/waiter_orders.html/', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'waiter_orders.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:3000`);
});
