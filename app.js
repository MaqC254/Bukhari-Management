const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const session = require('express-session');
const ejs = require('ejs');
const multer = require('multer');
const mongoDBSession = require('connect-mongodb-session')(session);
const { v4: uuidv4 } = require('uuid'); // Import UUID v4
const Delivery = require("./models/deliveries.js");
const axios = require('axios');
const SMS = require("./models/sms.js");

const app = express();
const port = 3000;

const PAYPAL_CLIENT_ID = 'AUXbJ1MpXAA28xCuZbw_n-BkB6aAksDIXAES6RN_SYjE5Pp1GNwdcbpRVy9EJP6tgd2KFV80ir7_B58z';
const PAYPAL_CLIENT_SECRET = 'EPA7dro8F7FD04Er5aZGZ9y5JpnWHL_luzYmOToZtY9VNT0OMqGv_CIwRcU2skag7PDqDwQyHjI0KNOH';

// MongoDB URI string
const dbURI = 'mongodb+srv://max:h9H9mi5Gbp1IsH2t@nodejsdb.oxlzabu.mongodb.net/?retryWrites=true&w=majority&appName=NodejsDB';

// Connect to MongoDB
mongoose.connect(dbURI, {})
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(port, () => {
            console.log(`Server is running at http://localhost:${port}`);
        });
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB:', err);
    });

    const store = new mongoDBSession({
        uri:dbURI,
        collection:'mySessions'
    });

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');// Set EJS as the view engine
app.set('views', __dirname + '/views'); // Specify the vies directory

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'images');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

app.use(session({ secret: 'secret',
     resave: false, 
     saveUninitialized: false, 
     store: store, 
     cookie: { 
        secure: false 
    } }));

// Serve static files from main directories
app.use('/styles', express.static(path.join(__dirname, 'styles')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/scripts', express.static(path.join(__dirname, 'scripts')));
app.use('/pages', express.static(path.join(__dirname, 'pages')));

// Import models
const Employee = require('./models/employee.js');
const Customer = require('./models/customer.js');
const MenuItem = require('./models/MenuItem.js');
const Meal = require('./models/meal'); 
const Item = require('./models/server_items'); 

// Route to serve the homepage
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'index.html'));
});

// Routes to serve various HTML pages
const staticPages = [
    'cash.html',
    'customer_signin.html',
    'customer_signup.html',
    'Delivery.html',
    'deliveryCart.html',
    'employee_signin.html',
    'employee_signup.html',
    'mobile.html',
    'online_checkout.html',
    'order_details.html',
    'orderstate.html',
    'payment_details.html',
    'server.html',
    'waiter_orders.html'
];

staticPages.forEach(page => {
    app.get(`/pages/${page}`, (req, res) => {
        res.sendFile(path.join(__dirname, 'pages', page));
    });
});

// Route to serve add-meal.html
app.get('/add-meal', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'add-meal.html'));
});

app.get('/views/available.ejs', async (req, res) => {
    const meals = await MenuItem.find();
    res.render('available',{
        meals: meals
    })  
});

app.get('/views/deliveryMenu.ejs', async (req, res) => {
    const meals = await MenuItem.find();
    res.render('deliveryMenu',{
        meals: meals
    })  
});

app.get('/views/venueMenu.ejs', async (req, res) => {
    const meals = await MenuItem.find();
    res.render('venueMenu',{
        meals: meals
    })  
});

// Endpoint to save form data to MongoDB
app.post('/saveData', function(req, res) {
    const employeeData = req.body;

    // Check if passwords match
    if (employeeData.password !== employeeData['confirm-password']) {
        return res.status(400).send('Passwords do not match');
    }

    // Create a new Employee instance
    const newEmployee = new Employee({
        name: employeeData.name,
        phone: employeeData.phone,
        workID: employeeData['work-id'],
        role: employeeData.role,
        password: employeeData.password,
    });

    // Save employee to the database
    newEmployee.save()
        .then(() => {
            res.redirect('/pages/admin.html'); 
        })
        .catch(err => {
            console.error('Error saving employee:', err);
            res.status(500).send('Error saving employee to the database');
        });
});

app.post('/employee_signin', async (req, res) => {
    const { workId, password } = req.body;

    try {
        const employee = await Employee.findOne({ workID: workId, password: password });
        if (!employee) {
            return res.status(401).json({ success: false, message: 'Incorrect work ID or password' });
        }
        res.status(200).json({ success: true, message: 'Sign in successful' });
        // Set session for logged-in waiter
        req.session.employeeId = employee._id;
        req.session.role = employee.role;

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Error checking credentials' });
    }
});

app.post('/saveCustomerData', async (req, res) => {
    const { name, phone, password } = req.body;

    const newCustomer = new Customer({
        name,
        phone,
        password
    });

    try {
        await newCustomer.save();
        res.status(200).json({ success: true, message: 'Customer registered successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Error saving customer to the database' });
    }
});

app.post('/customer_signin', async (req, res) => {
    const { phone, password } = req.body;

    try {
        const customer = await Customer.findOne({ phone: phone, password: password });
        if (!customer) {
            return res.status(401).json({ success: false, message: 'Incorrect work ID or password' });
        }
        res.status(200).json({ success: true, message: 'Sign in successful' });
        req.session.authenticated = true;
        req.session.user = customer.phone;
        req.session.save();

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Error checking credentials' });
    }
});

app.post('/saveData', (req, res) => {
    const { name, phone, workId, role, password } = req.body;

    const newEmployee = new Employee({
        name,
        phone,
        workID: workId,
        role,
        password
    });

    newEmployee.save((err) => {
        if (err) {
            return res.status(500).send('Error saving employee to the database');
        } else {
            res.redirect('/pages/employee_signin.html');
        }
    });
});

// Route to handle form submission for add-meal.html
app.post('/add-meal', upload.single('image'), async (req, res) => {
    const { name, description, quantity, category, price } = req.body;
    const image = req.file ? `/images/${req.file.filename}` : '';

    const newMenuItem = new MenuItem({
        name,
        description,
        image,
        quantity,
        category,
        price // Include category in the new meal object
    });

    try {
        await newMenuItem.save();
        res.redirect('/pages/server.html');
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

// Route to delete a meal
app.delete('/delete-meal/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await MenuItem.findByIdAndDelete(id);
        res.sendStatus(200); // Send success response
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

// Confirm orders by moving them to the 'server' collection
app.post('/api/orders/confirm', async (req, res) => {
    try {
        const orders = await Meal.find();
        const ServerOrder = mongoose.model('ServerOrder', Meal.schema, 'server');

        await ServerOrder.insertMany(orders);
        await Meal.deleteMany();

        res.status(200).send({ message: 'Orders confirmed and moved to server collection' });
    } catch (err) {
        res.status(500).send(err);
    }
});

// Clear orders
app.delete('/api/orders/clear', async (req, res) => {
    try {
        await Meal.deleteMany();
        res.status(200).send({ message: 'Orders cleared' });
    } catch (err) {
        res.status(500).send(err);
    }
});

// Route to display menu items (for no login)
app.get('/menu', async (req, res) => {
    try {
      const menuItems = await MenuItem.find();
      res.render('menu', { menuItems });
    } catch (err) {
      res.status(500).send('Error retrieving menu items');
    }
  });

// Route to handle adding multiple items from cart to MongoDB
app.post('/api/add-items', async (req, res) => {
    try {
        const cartItems = req.body.cartItems; // Assuming cart items are sent in an array in req.body.cartItems
        const phone = req.body.phone;
        const location = req.body.location;

        const orderId = uuidv4();

        // Create an array of items to insert into MongoDB
        const itemsToInsert = cartItems.map(item => ({
            name: item.name,
            description: item.description,
            image: item.image || '', // Optional image property
            quantity: item.quantity,
            price: item.price,
            category: item.category, // Assuming each item has a category property
            state: 'online', // Default state for new items
            customerPhone: phone,
            orderId: orderId,
            location: location
        }));

        // Insert all items into MongoDB using create() method
        const createdItems = await Item.create(itemsToInsert);

        res.status(201).json({"orderId": createdItems[0].orderId}); // Respond with created items in JSON format
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' }); // Handle server errors
    }
});

app.post('/api/add-order', async (req, res) => {
    try {
        const cartItems = req.body.cartItems; // Assuming cart items are sent in an array in req.body.cartItems
        const workID = req.body.workID;
        const tableNumber = req.body.tableNumber;

        // Generate a UUID for this cart
        const orderId = uuidv4();

        // Create an array of items to insert into MongoDB with the same UUID
        const itemsToInsert = cartItems.map(item => ({
            name: item.name,
            description: item.description,
            image: item.image || '', // Optional image property
            quantity: item.quantity,
            price: item.price,
            category: item.category, // Assuming each item has a category property
            state: 'venue', // Default state for new items
            customerPhone: workID,
            tableNumber: tableNumber,
            orderId: orderId // Assign the same UUID to each item
        }));

        console.log(itemsToInsert);

        // Insert all items into MongoDB using create() method
        const createdItems = await Item.create(itemsToInsert);

        res.status(201).json(createdItems); // Respond with created items in JSON format
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' }); // Handle server errors
    }
});

// Route to get all items to server screen that are not "done"
app.get('/get-items', (req, res) => {
    Item.find({ state: { $ne: 'done' } })
        .then(items => res.status(200).json(items))
        .catch(err => res.status(400).send(err));
});

// Route to update item state on server screen
app.put('/update-item/:id', (req, res) => {
    const { id } = req.params;
    Item.findByIdAndUpdate(id, { state: 'done' }, { new: true })
        .then(item => res.status(200).json(item))
        .catch(err => res.status(400).send(err));
});

app.put('/update-paid/:id', (req, res) => {
    const { id } = req.params;
    Item.findByIdAndUpdate(id, { paid: true }, { new: true })
        .then(item => res.status(200).json(item))
        .catch(err => res.status(400).send(err));
});

// Route to get items by workId on waiter order screen
app.get('/api/items', async (req, res) => {
    const customerPhone = req.query.customerPhone; // Get customerPhone from query parameters

    try {
        const items = await Item.find({ customerPhone , paid : false });
        res.status(200).json(items);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Route for changing payment state to true and reducing the quantity available in menu items
app.put('/api/items/mark-as-paid/:tableNumber', async (req, res) => {
    const { tableNumber } = req.params; // Get tableNumber from URL parameters

    if (!tableNumber) {
        console.error('Table number is missing in the request');
        return res.status(400).json({ error: 'Table number is required' });
    }

    try {
        // Find items where tableNumber matches and paid is false
        const items = await Item.find({ tableNumber: tableNumber, paid: false });

        if (items.length === 0) {
            return res.status(404).json({ error: 'No unpaid items found for this table' });
        }

        // Update each item as paid and reduce the quantity available in the menu
        const updatePromises = items.map(async item => {
            await Item.findByIdAndUpdate(item._id, { $set: { paid: true } });
            await MenuItem.findOneAndUpdate(
                { name: item.name }, // Find MenuItem by name
                { $inc: { quantity: -item.quantity } } // Decrement the quantity
            );
        });

        await Promise.all(updatePromises);

        res.status(200).json({ message: 'Items updated successfully' });
    } catch (err) {
        console.error('Server error while updating items:', err);
        res.status(500).json({ error: 'Server error' });
    }
});


// Route to get items by month
app.get('/api/items/:month', async (req, res) => {
    const month = parseInt(req.params.month, 10);
    try {
        const items = await Item.aggregate([
            { $match: { month: month } },
            { $group: { _id: "$name", totalOrdered: { $sum: "$quantity" } } },
            { $sort: { totalOrdered: -1 } } // Sort by total ordered in descending order
        ]);
        res.json(items);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Route to get the most wanted item
app.get('/api/most-wanted-item', async (req, res) => {
    try {
        const mostWantedItem = await Item.aggregate([
            { $group: { _id: "$name", totalOrdered: { $sum: "$quantity" } } },
            { $sort: { totalOrdered: -1 } },
            { $limit: 1 }
        ]);
        res.json(mostWantedItem[0]);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Route to generate Sales reports
app.get('/api/reports/:year/:month/:week?/:day?', async (req, res) => {
    const { year, month, week, day } = req.params;

    let startDate, endDate;

    if (week) {
        // Calculate start and end dates for the week
        const firstDayOfMonth = new Date(year, month - 1, 1);
        const startOfWeek = firstDayOfMonth.getDate() + (week - 1) * 7;
        startDate = new Date(year, month - 1, startOfWeek);
        endDate = new Date(year, month - 1, startOfWeek + 6, 23, 59, 59);
    } else if (day) {
        // Specific day
        startDate = new Date(year, month - 1, day);
        endDate = new Date(year, month - 1, day, 23, 59, 59);
    } else {
        // Entire month
        startDate = new Date(year, month - 1, 1);
        endDate = new Date(year, month, 0, 23, 59, 59); // Last day of the month
    }

    try {
        const reportData = await Item.find({
            createdAt: {
                $gte: startDate,
                $lte: endDate
            }
        }).select('name quantity price month');

        res.json(reportData);
    } catch (err) {
        console.error('Error generating report:', err);
        res.status(500).send(err.message);
    }
});


// Route to fetch order status
app.get('/orderstatus', async (req, res) => {
    // const customerPhone = req.query.phone; // Retrieve phone number from query parameter
    const orderId = req.query.id;
  
    try {
      // Check if all items for this phone number are 'done'
      const items = await Item.find({ orderId });
      const allDone = items.every(item => item.state === 'done');
      const order = await Delivery.findOne({orderId});

      const deliveryStatus = order !== null? order.status : false;

      const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        res.status(200).json({
            totalPrice: totalPrice,
            order: items,
            status: deliveryStatus === true? "delivered":  allDone === true? "ready": "online",
            ETA: order !== null? order.ETA:  "60",
            code: order !== null? order.code: "####",
            delivery: order
        });
    } catch (err) {
      console.error(err);
      res.status(500).send('Error fetching order status');
    }
  });

// Endpoint to handle payment confirmation
app.post('/api/confirm-payment', async (req, res) => {
    const { orderID, payerID, cartItems, phone } = req.body;

    try {
        // Get an access token from PayPal
        const tokenResponse = await axios.post('https://api-m.sandbox.paypal.com/v1/oauth2/token', 'grant_type=client_credentials', {
            headers: {
                'Authorization': `Basic ${Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64')}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        const accessToken = tokenResponse.data.access_token;

        // Capture the payment
        const captureResponse = await axios.post(`https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderID}/capture`, {}, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });

        // Save order details to the database (for demo, we will just log it)
        console.log('Payment Details:', captureResponse.data);

        // Replace with actual database operation
        // Example: saveOrderToDatabase(captureResponse.data, cartItems, phone);

        res.json({ success: true });
    } catch (error) {
        console.error('Error processing payment:', error);
        res.status(500).json({ success: false, message: 'Payment processing failed' });
    }
});

// Route to get drivers whose workId starts with 'd'
app.get('/get-drivers', async (req, res) => {
    try {
        const drivers = await Employee.find({ workID: /^d/ }).exec();
        res.json(drivers);
    } catch (error) {
        console.error('Error fetching drivers:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route to update a delivery
app.put('/update-delivery/:orderId', async (req, res) => {
    const { orderId } = req.params;
    const { driver, code } = req.body; // Extract driver and code from request body

    try {
        // Find the delivery record by orderId
        const delivery = await Delivery.findOne({ orderId });
        if (!delivery) {
            return res.status(404).json({ error: 'Delivery not found' });
        }

        delivery.status = code == delivery.code; // Mark as delivered

        // Save updated delivery record
        await delivery.save();

        res.json({ success: true, message: delivery.status === true? 'Delivery completed.' : "Invalid code."});
    } catch (error) {
        console.error('Error updating delivery:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route to create a new delivery
app.post('/create-delivery', async (req, res) => {
    const { id, orderId, driver } = req.body; // Extract orderId and driver from request body

    if (!orderId || !driver) {
        return res.status(400).json({ error: 'orderId and driver are required' });
    }

    const item = await Item.findOne({orderId: orderId});

    try {
        // Create a new delivery instance
        const newDelivery = new Delivery({
            orderId,
            driver,
            status: false, // Default status to false (not delivered yet)
            location: item.location,
            phone: item.customerPhone
        });

        // Save the new delivery record
        await newDelivery.save();

        await Item.updateMany({orderId: orderId}, { state: 'done' }, { new: true });

        res.status(201).json({ success: true, message: 'Delivery created successfully', delivery: newDelivery });
    } catch (error) {
        console.error('Error creating delivery:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route to get deliveries for a specific driver
app.get('/deliveries/:driverId', async (req, res) => {
    try {
        const driverId = req.params.driverId;

        // Query the deliveries collection for the specified driver
        const deliveries = await Delivery.find({ driver: driverId, status: false });

        if (deliveries.length === 0) {
            return res.status(404).json({ message: 'No deliveries found for this driver.' });
        }

        res.json(deliveries);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while retrieving deliveries.' });
    }
});

//Route to update meal details in server page
app.put('/update-meal/:id', upload.single('image'), async (req, res) => {
    const mealId = req.params.id;
    const { name, description, quantity, price } = req.body;
    const image = req.file ? `/images/${req.file.filename}` : '';

    try {
        const updateFields = { name, description, quantity, price };
        if (image) updateFields.image = image;

        const updatedMeal = await MenuItem.findByIdAndUpdate(mealId, updateFields, { new: true });
        if (updatedMeal) {
            res.status(200).json(updatedMeal);
        } else {
            res.status(404).send('Meal not found');
        }
    } catch (error) {
        console.error('Error updating meal:', error);
        res.status(500).send('Error updating meal');
    }
});

// Route to get all employees
app.get('/employees', async (req, res) => {
    try {
        const employees = await Employee.find().sort({ workID: 1 }); // Sort by workID
        res.json(employees);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route to get a specific employee by ID
app.get('/employee/:id', async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (employee) {
            res.json(employee);
        } else {
            res.status(404).json({ message: 'Employee not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route to update a specific employee by ID
app.put('/update-employee/:id', async (req, res) => {
    try {
        const { name, phone, workID, role } = req.body;
        const employee = await Employee.findById(req.params.id);

        if (employee) {
            employee.name = name || employee.name;
            employee.phone = phone || employee.phone;
            employee.workID = workID || employee.workID;
            employee.role = role || employee.role;

            await employee.save();
            res.status(200).json({ message: 'Employee updated successfully' });
        } else {
            res.status(404).json({ message: 'Employee not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route to delete an employee
app.delete('/employees/:id', async (req, res) => {
    const employeeId = req.params.id;
    
    try {
        const result = await Employee.findByIdAndDelete(employeeId);
        if (result) {
            res.status(200).json({ message: 'Employee deleted successfully' });
        } else {
            res.status(404).json({ message: 'Employee not found' });
        }
    } catch (error) {a
        console.error('Error deleting employee:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
