



const { json } = require("express");
const screen = require("../models/newScreen.model");
const dotenv = require("dotenv");
const { Log } = require('../models/log.model'); // Adjust the path if needed                                            
const axios = require('axios');
const express = require('express');
const app = express();
const checkPermission = require('../middlewares/permissionMiddleware');
dotenv.config();

// Helper function to get external IP
const getClientIP = (req) => {
    const forwarded = req.headers['x-forwarded-for'];
    return forwarded ? forwarded.split(',')[0] : req.ip;
  };

// Helper function to log actions
const logAction = async (req, action, message, user = null) => {
    try {
        const ip = getClientIP(req);
        const userName = user ? user.name : 'Anonymous'; // Default to 'Anonymous' if no user info
        await Log.create({ action, message: `${message} by ${userName}`, ip });
    } catch (error) {
        console.error('Failed to log action:', error);
    }
};

// Controller to handle logs
exports.getLogs = async (req, res) => {
    try {
        const logs = await Log.findAll({
            order: [['createdAt', 'DESC']]
        });
        res.json(logs);
    } catch (error) {
        console.error('Error fetching logs:', error);
        res.status(500).json({ message: 'Error fetching logs. Please try again.' });
    }
};

// Controller to create a new log
exports.createLog = async (req, res) => {
    const { action, message } = req.body;
    try {
        const log = await Log.create({ action, message, ip: req.ip });
        res.status(201).json(log);
    } catch (error) {
        console.error('Error creating log:', error);
        res.status(500).json({ message: 'Error creating log. Please try again.' });
    }
};



// Add a new screen
// Add a new screen
const CustomerAddScreen = async (req, res) => {
    const {
        pairingCode,
        screenName,
        tags,
        location,
        city,
        state,
        country,
        pincode,
    } = req.body;
    
    try {
        const customerId = req.session.customer_id; 

        // Validate pairing code length
        if (pairingCode.length > 6) {
            await logAction('addScreen', 'Failed to add screen: pairing code too long');
            return res.render("customerscreen", {
                message: {
                    type: "error",
                    text: "Your pairing code is incorrect. It must be 6 characters or less.",
                },
                screens: [],
                screenCount: 0,
                onlineScreen: 0,
                offlineScreen: 0,
                groupscreen: 0,
                deletedScreens: 0,
                screenStatus: 0
            });
        }

        // Check if a screen with the same pairing code already exists
        const existingScreen = await screen.screenByPairingCode(pairingCode);
        if (existingScreen.length > 0) {
            const allScreens = await screen.getScreensWithCustomerData(customerId);
            const screenCount = await screen.getTotalScreenCount(customerId);
            const onlineScreen = await screen.getNotDeletedScreenCount(customerId);
            const offlineScreen = await screen.getDeletedScreenCount(customerId);
            const deletedScreens = await screen.getDeletedScreen(customerId);
            const groupscreen = await screen.getGroupScreen(customerId);
            const screenStatus = await screen.getStatus();
            const screenDeviceConfig = await screen.screenDeviceConfig();

            await logAction('addScreen', 'Failed to add screen: pairing code already exists');
            return res.render("customerscreen", {
                message: {
                    type: "error",
                    text: "Screen with this Pairing Code already exists",
                },
                screens: allScreens,
                screenCount,
                onlineScreen,
                offlineScreen,
                deletedScreens,
                groupscreen,
                screenStatus,
                screenDeviceConfig
            });
        }

        // Proceed with adding the screen
        const user = req.session.user;
        await screen.customerScreen(
            pairingCode,
            screenName,
            tags,
            location,
            city,
            state,
            country,
            pincode,
            customerId,
            user.id
        );

        await logAction(req, 'addScreen', 'Successfully added screen', user);

        // Fetch data for rendering updated screen list
        const allScreens = await screen.getScreensWithCustomerData(customerId);
        const screenCount = await screen.getTotalScreenCount(customerId);
        const onlineScreen = await screen.getNotDeletedScreenCount(customerId);
        const offlineScreen = await screen.getDeletedScreenCount(customerId);
        const deletedScreens = await screen.getDeletedScreen(customerId);
        const groupscreen = await screen.getGroupScreen(customerId);
        const screenStatus = await screen.getStatus();
        const screenDeviceConfig = await screen.screenDeviceConfig();

        res.render("customerscreen", {
            message: {
                type: "success",
                text: "Successfully registered Screen",
            },
            screens: allScreens,
            screenCount,
            onlineScreen,
            offlineScreen,
            deletedScreens,
            groupscreen,
            screenStatus,
            screenDeviceConfig
        });
    } catch (error) {
        console.error(error);
        await logAction('addScreen', 'Error adding screen'); 
        // res.status(500).send("Add Screen error");
    }
};


// Get all screens                                                                                                                                                        
const getScreensWithCustomerData = async (req, res) => {
    try {
      console.log("Session data in getAllScreens:", req.session);  // Verify customer_id here
  
      const customerId = req.session.customer_id;
  
      if (!customerId) {
        console.log("Customer ID not found in session for getAllScreens");
        return res.status(401).send("Unauthorized");
      }
  
      // Fetch screens filtered by customer_id
      const allScreens = await screen.getScreensWithCustomerData(customerId);
  
      // Fetch other required data counts, if they need filtering by customer_id, adjust accordingly
      const onlineScreen = await screen.getNotDeletedScreenCount(customerId);
      const screenCount = await screen.getTotalScreenCount(customerId);
      const offlineScreen = await screen.getDeletedScreenCount(customerId);
    //   const deletedScreens = await screen.getDeletedScreen(customerId);
    const deletedScreens = await screen.getDeletedScreenCustomer(customerId);
      const groupscreen = await screen.getGroupScreen(customerId);
      const screenStatus = await screen.getStatus();                                                                        
      const screenSlotData = await screen.getScreenSlotData();
      const screenDeviceConfig = await screen.screenDeviceConfig();
  
      // Render the filtered data
      res.render("customerscreen", {
        message: null,
        screens: allScreens,          // Only screens for the current customer
        screenSlotData: screenSlotData,
        screenCount,
        onlineScreen,
        offlineScreen,
        deletedScreens,
        groupscreen,
        screenStatus,
        screenDeviceConfig
      });
    } catch (error) {
      console.error("Error fetching all screens:", error);
      res.status(500).send("Error fetching screens");
    }
  };






const getAllScreens1 = async (req, res) => {
    try {
        const allScreens = await screen.getNotdeletedScreen();
        // const onlineScreen = await screen.getNotDeletedScreenCount();
        const screenCount = await screen.getTotalScreenCount();
        // const offlineScreen = await screen.getDeletedScreenCount();
        const deletedScreens = await screen.getDeletedScreen();
        const groupscreen = await screen.getGroupScreen();
        const  screenStatus=await screen.getStatus();
        // const totalScreenCount= await screen.getTotalScreenCount();
        const onlineScreenCount=await screen.getOnlineCountByClientTable();
        const offlineScreenCount=await screen.getOfflineCountByClientTable();
        const screenSlotData=await screen.getScreenSlotData();

        res.render("sales", {
            message: null,
            screens: screenSlotData,
            screenCount,
            onlineScreen:onlineScreenCount,
            offlineScreen:offlineScreenCount,
            deletedScreens,
            groupscreen,screenStatus
        });
    } catch (error) {
        console.error("Error fetching all screens:", error);
        res.status(500).send("Error fetching screens");
    }
};





// Get all screens data
const getAllScreensAllData = async (req, res) => {
    try {
        const allScreens = await screen.getAllScreens();
        const screenSlotData=await screen.getScreenSlotData();
        res.json(screenSlotData);
    } catch (error) {
        console.error("Error fetching all screens:", error);
        res.status(500).send("Error fetching screens");
    }
};

// Get not deleted screens
const getNotdeletedScreen = async (req, res) => {
    // const user = req.session.user;

    // // Check if the user has the 'Library delete' permission
    // if (!user.permissions.includes('sd')) {
    //     // Sending an alert message directly to the client side instead of using flash
    //     return res.status(403).json({ 
    //         success: false, 
    //         alert: 'You do not have permission to delete media.' 
    //     }); // Respond with a permission error
    // }

    try {
        const notDeletedScreen = await screen.getNotdeletedScreen();
        res.render("customerscreen", {
            message: null,
            screens: notDeletedScreen,
        });
    } catch (error) {
        console.error("Error fetching screens:", error);
        res.status(500).send("Error fetching screens");
    }
};
// Controller
// Controller
const updateDeleteScreen = async (req, res) => {
    const { screenid } = req.body;

    try {
        await screen.updateDeleteScreen(screenid);
        const user = req.session.user; // Retrieve user from session

        // Log the soft delete action
        await logAction(req, 'DeleteScreen', `Screen soft deleted: ${screenid}`, user);

        // Send a success response to the client
        res.sendStatus(200);
    } catch (error) {
        console.error(error);
        await logAction('updateDeleteScreen', `Error updating screen: ${screenid}`);
        res.status(500).send("Error deleting screen");
    }
};


// Edit a screen
const CustomerEditScreen = async (req, res) => {
    const {
        screenid,
        pairingCode,
        screenName,
        tags,
        location,
        city,
        state,
        country,
        pincode,
    } = req.body;

    try {
        // Retrieve customer_id from the session
        const customer_id = req.session.customer_id;

        // Call the model's edit screen function and pass customer_id
        const result = await screen.CustomerEditScreen(
            screenid,
            pairingCode,
            screenName,
            tags,
            location,
            city,
            state,
            country,
            pincode,
            customer_id // Pass customer_id to the edit function if needed
        );

        const user = req.session.user;
        await logAction(req, 'editScreen', `Screen edited: ${screenid}`, user);

        // Redirect to the customer screen page if the edit is successful
        if (result && result.success) {
            return res.redirect("/customer-screen");
        }

        // If the edit failed or no changes were made, redirect with a message
        return res.redirect(`/customer-screen`);
    } catch (error) {
        console.error("An error occurred in editScreen:", error);
        const user = req.session.user;
        await logAction(req, 'editScreen', `Error editing screen: ${screenid}`, user);

        // Handle the error by redirecting to an error page or displaying a user-friendly message
        return res.status(500).redirect(`/errorPage?message=An error occurred while editing the screen. Please try again later.`);
    }
};


// Get screen by pairing code
const CustomerscreenByPairingCode = async (req, res) => {
    const { pairingCode } = req.params;
    try {
        console.log("CustomerscreenByPairingCode");
        
        const screenData = await screen.CustomerscreenByPairingCode(pairingCode);
        console.log("screenData");
        if (screenData.length === 0) {
            return res.status(404).json({ message: "Screen not found" });
        }
        res.json(screenData[0]);
    } catch (error) {
        console.error("Error fetching screen:", error);
        res.status(500).send("Error fetching screen");
    }
};

// Restore a screen
const restoreScreenInDB = async (req, res) => {
    const { screenid } = req.body;

    try {
        await screen.restoreScreenInDB(screenid);
        const user = req.session.user; // Retrieve user from session
        await logAction(req, 'restoreScreen', 'Screen restored', user);
        
          //await logAction('restoreScreen', `Screen restored: ${pairingCode}`);
        res.sendStatus(204);
    } catch (error) {
        console.error(error);

        res.status(500).send("Error restoring screen");
    }
};



// Delete a playlist
const deletePlaylist = async (req, res) => {
    const { screenid } = req.params;
    const user = req.session.user;
                                                                                                
    // // Check if the user has the 'Library delete' permission
    // if (!user.permissions.includes('pd')) {
    //     // Sending an alert message directly to the client side instead of using flash
    //     return res.status(403).json({ 
    //         success: false, 
    //         alert: 'You do not have permission to delete media.' 
    //     }); // Respond with a permission error
    // }

    try {
        const response = await screen.deletePlaylist(screenid);
        await logAction('deletePlaylist', `Playlist deleted: ${screenid}`, req.ip);
        res.json(response);
    } catch (error) {
        console.error("Error deleting playlist:", error);
        await logAction('deletePlaylist', Error `deleting playlist: ${screenid}`, req.ip);
        res.status(500).json({ error: "Failed to delete playlist" });
    }
};

// app.delete('/customer-screen/delete-screen/:screenid', deleteScreenn);
// Delete a screen
// controllers/screenController.js
const deleteScreen = async (req, res) => {
    const { screenid } = req.params;

    try {
        const success = await deleteScreenById(screenid);
        if (success) {
            await logAction('deleteScreen', `Screen deleted: ${screenid}`, req.ip);
            res.json({ success: true });
        } else {
            res.json({ success: false, message: 'Screen not found' });
        }
    } catch (error) {
        console.error('Error deleting screen:', error);
        res.status(500).json({ success: false, message: 'An error occurred while deleting the screen' });
    }
};



module.exports = {
    getScreensWithCustomerData
  , 
        getAllScreens1,
    getNotdeletedScreen,
    updateDeleteScreen,
    CustomerscreenByPairingCode,
    restoreScreenInDB, 
    getAllScreensAllData,
    deletePlaylist,
    deleteScreen,
    checkPermission,
    CustomerAddScreen,CustomerEditScreen
};


                                                                                                    
