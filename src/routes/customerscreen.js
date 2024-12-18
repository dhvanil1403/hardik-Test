// const express = require("express");
// const router = express.Router();
// const screen = require("../controllers/newScreen.controller");
// const groupRouter = require("./groupsRoutes");

// router.route("/alldata").get(screen.getAllScreensAllData);
// // GET all not deleted screens
// router.route("/").get(screen.getAllScreens).post(screen.addScreen);

// // Group screen route
// // router.get("/GroupScreen", screen.showGroupScreen);

// // Use groupRouter for '/Groups' path
// router.use("/Groups", groupRouter);


// // PUT request to mark a screen's playlist as deleted (set playlistname to null)
// router.put("/:screenid/deletePlaylist", screen.deletePlaylist);

// // POST request to mark a screen as deleted
// router
//   .route("/mark-as-deleted")
//   .post(screen.updateDeleteScreen)  
 
// router
//   .route("/restore")  
//   .post(screen.restoreScreen)
//   .get(screen.getAllScreens)

// // GET all deleted screens
// // router.get('/Deleted-Screen', screen.getDeletedScreens);

// // GET screen details by pairing code
// router.get("/:pairingCode", screen.screenByPairingCode);

// // Routes for editing screen
// router
//   .route("/edit-screen")
//   .post(screen.editScreen)
  

// module.exports = router;


const express = require("express");
  const router = express.Router();
  const screen = require("../controllers/customerscreen.controller");
  const groupRouter = require("./groupsRoutes");

 

  router.route("/alldata").get(screen.getAllScreensAllData);
  // GET all not deleted screens
  router.route("/").get(screen.getScreensWithCustomerData).post(screen.CustomerAddScreen);



  // Group screen route
  // router.get("/GroupScreen", screen.showGroupScreen);

  // Use groupRouter for '/Groups' path
  router.use("/Groups", groupRouter);


  // PUT request to mark a screen's playlist as deleted (set playlistname to null)
  router.put("/:screenid/deletePlaylist", screen.deletePlaylist);

  // POST request to mark a screen as deleted
  router
    .route("/mark-as-deleted")
    .post(screen.updateDeleteScreen)  
  
  router
    .route("/restore")  
    .post(screen.restoreScreenInDB)
    .get(screen.getScreensWithCustomerData)

  // GET all deleted screens
  // router.get('/Deleted-Screen', screen.getDeletedScreens);

  // GET screen details by pairing code
  router.get("/:pairingCode", screen.CustomerscreenByPairingCode);

  // Routes for editing screen
  router
    .route("/edit-screen")
    .post(screen.CustomerEditScreen)
    
    router.delete('/delete-screen/:screenid', screen.updateDeleteScreen);
    // router.delete('/customer-screen/delete-screen/:screenid', screen.deleteScreen);

    router.delete('/delete-screen/:screenid', screen.deleteScreen);
    
  module.exports=router;
