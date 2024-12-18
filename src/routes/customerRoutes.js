const express = require('express');
const bcrypt = require('bcryptjs');
const Customer = require('../models/Customer');
const router = express.Router();

// Registration page
router.get('/register', (req, res) => {
  res.render('customer-register');
});

// Register customer
router.post('/register', async (req, res) => {
  const { name, email, password, mobile_number, start_date, end_date } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await Customer.create({
      name,
      email,
      password: hashedPassword,
      mobile_number,                                              
      start_date,
      end_date,
      invoices: [],
    });
    res.redirect('/login');                                                        
  } catch (error) {
    console.error(error);
    res.status(500).send("Error registering customer");
  }
});



module.exports = router;
