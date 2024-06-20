const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const session = require('express-session');
const ejs = require('ejs');
const multer = require('multer');


const app = express();
const port = 3000;

// MongoDB URI string
const dbURI = 'mongodb+srv://max:h9H9mi5Gbp1IsH2t@nodejsdb.oxlzabu.mongodb.net/?retryWrites=true&w=majority&appName=NodejsDB';

// Connect to MongoDB
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(port, () => {
            console.log(`Server is running at http://localhost:${port}`);
        });
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB:', err);
    });

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs'); // Set EJS as the view engine

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'images');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });


// Serve static files from main directories
app.use('/styles', express.static(path.join(__dirname, 'styles')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/scripts', express.static(path.join(__dirname, 'scripts')));
app.use('/pages', express.static(path.join(__dirname, 'pages')));
app.use(session({ secret: 'your_secret_key', resave: false, saveUninitialized: true }));

// Import Employee model
const Employee = require('./models/employee.js');
const Customer = require('./models/customer.js');
const MenuItem = require('./models/MenuItem.js');

const { functions } = require('lodash');

// Route to serve the homepage
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'index.html'));
});

// Routes to serve various HTML pages
app.get('/pages/menu.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'menu.html'));
});

app.get('/pages/cart.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'cart.html'));
});

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

app.get('/pages/deliveryMenu.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'deliveryMenu.html'));
});

app.get('/pages/drinks.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'drinks.html'));
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

app.get('/pages/snack.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'snack.html'));
});

app.get('/pages/venueMenu.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages', 'venueMenu.html'));
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
    // MenuItem.find({},function(err,foodList){
    //     res.render('available',{
    //         meals: foodList
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
    const { name, description, quantity, category } = req.body;
    const image = req.file ? `/images/${req.file.filename}` : '';

    const newMenuItem = new MenuItem({
        name,
        description,
        image,
        quantity,
        category // Include category in the new meal object
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

