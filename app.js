const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const session = require('express-session');
const ejs = require('ejs');
const multer = require('multer');
const mongoDBSession = require('connect-mongodb-session')(session);
const cookieParser = require("cookie-parser");
const { Parser } = require('json2csv');
const fs = require('fs');
const xlsx = require('xlsx');
//const store = new session.MemoryStore();
const cors = require('cors');

const app = express();
const port = 3000;

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
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');// Set EJS as the view engine
app.set('views', __dirname + '/views'); // Set EJS as the view engine

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'images');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

app.use(session({ secret: 'secret', resave: false, saveUninitialized: false, store: store, cookie: { secure: false } }));



// Serve static files from main directories
app.use('/styles', express.static(path.join(__dirname, 'styles')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/scripts', express.static(path.join(__dirname, 'scripts')));
app.use('/pages', express.static(path.join(__dirname, 'pages')));
//app.use('/views', express.static(path.join(__dirname, 'views')));

// Import Employee model
const Employee = require('./models/employee.js');
const Customer = require('./models/customer.js');
const MenuItem = require('./models/MenuItem.js');
const Meal = require('./models/meal'); 
const Item = require('./models/server_items'); 

const { functions } = require('lodash');

// Route to serve the homepage
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'index.html'));
});

// Routes to serve various HTML pages
app.get('/pages/cash.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'cash.html'));
});

app.get('/pages/customer_signin.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'customer_signin.html'));
});

app.get('/pages/customer_signup.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'customer_signup.html'));
});

app.get('/pages/Delivery.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'Delivery.html'));
});

app.get('/pages/deliveryCart.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'deliveryCart.html'));
});

app.get('/pages/employee_signin.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'employee_signin.html'));
});

app.get('/pages/employee_signup.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'employee_signup.html'));
});

app.get('/pages/mobile.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'mobile.html'));
});

app.get('/pages/online_checkout.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'online_checkout.html'));
});

app.get('/pages/order_details.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'order_details.html'));
});

app.get('/pages/orderstate.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'orderstate.html'));
});

app.get('/pages/payment_details.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'payment_details.html'));
});

app.get('/pages/server.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'server.html'));
});

app.get('/pages/waiter_orders.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'waiter_orders.html'));
});

// Route to serve add-meal.html
app.get('/add-meal', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'add-meal.html'));
});

app.get('/views/available.ejs', async (req, res) => {
    const meals = await MenuItem.find();
    console.log(meals);
    res.render('available',{
        meals: meals
    })  
});

app.get('/views/deliveryMenu.ejs', async (req, res) => {
    const meals = await MenuItem.find();
    //console.log(meals);
    console.log(req.session);
    res.render('deliveryMenu',{
        meals: meals
    })  
});

app.get('/views/venueMenu.ejs', async (req, res) => {
    const meals = await MenuItem.find();
    console.log(meals);
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
            console.log('Employee saved successfully');
            res.redirect('/pages/employee_signin.html'); // Redirect to sign-in page upon successful signup
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
        console.log(req.session);
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
        //const customerPhone = req.session.user;
        console.log(req.session);

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
        }));

        // Insert all items into MongoDB using create() method
        const createdItems = await Item.create(itemsToInsert);

        res.status(201).json(createdItems); // Respond with created items in JSON format
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
        //const customerPhone = req.session.user;
        console.log(req.session);

        // Create an array of items to insert into MongoDB
        const itemsToInsert = cartItems.map(item => ({
            name: item.name,
            description: item.description,
            image: item.image || '', // Optional image property
            quantity: item.quantity,
            price: item.price,
            category: item.category, // Assuming each item has a category property
            state: 'venue', // Default state for new items
            customerPhone: workID,
            tableNumber: tableNumber
        }));

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

// Route for changing payment state to true
app.put('/api/items/mark-as-paid/:tableNumber', async (req, res) => {
    const { tableNumber } = req.params; // Get tableNumber from URL parameters

    if (!tableNumber) {
        console.error('Table number is missing in the request');
        return res.status(400).json({ error: 'Table number is required' });
    }

    try {
        // Update items where tableNumber matches and set paid to true
        const result = await Item.updateMany(
            { tableNumber: tableNumber, paid: false }, // Filter to find unpaid items for the table
            { $set: { paid: true } }, // Update operation
            { new: true } // Return updated documents
        );

        console.log('Items updated successfully:', result);
        res.status(200).json({ message: 'Items updated successfully', result });
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
    const customerPhone = req.query.phone; // Retrieve phone number from query parameter
  
    try {
      // Check if all items for this phone number are 'done'
      const items = await Item.find({ customerPhone });
      const allDone = items.every(item => item.state === 'done');
  
      if (allDone) {
        res.send('Being Delivered');
      } else {
        res.send('Being Prepared');
      }
    } catch (err) {
      console.error(err);
      res.status(500).send('Error fetching order status');
    }
  });