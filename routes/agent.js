const express = require("express");
const router = express.Router();
const middleware = require("../middleware/index.js");
const User = require("../models/user.js");
const Donation = require("../models/donation.js");

router.get("/agent/dashboard", middleware.ensureAgentLoggedIn, async (req,res) => {
	console.log("check 4")
	const agentId = req.user._id;
	console.log("check 5")
	const numAssignedDonations = await Donation.countDocuments({ agent: agentId, status: "assigned" });
	const numCollectedDonations = await Donation.countDocuments({ agent: agentId, status: "collected" });
	res.render("agent/dashboard", {title: "Dashboard",numAssignedDonations, numCollectedDonations});
});

router.get("/agent/collections/pending", middleware.ensureAgentLoggedIn, async (req,res) => {
	try
	{
		console.log("check 1")
		const pendingCollections = await Donation.find({ agent: req.user._id, status: "assigned" }).populate("donor");
		console.log("check 2")
		res.render("agent/pendingCollections", { title: "Pending Collections", pendingCollections });
		console.log("check 3")
	}
	catch(err)
	{
		console.log(err);
		req.flash("error", "Some error occurred on the server.")
		res.redirect("back");
	}
});

router.get("/agent/profile", middleware.ensureAgentLoggedIn, (req,res) => {
	res.render("agent/profile", { title: "My Profile" });
});

router.put("/agent/profile", middleware.ensureAgentLoggedIn, async (req,res) => {
	try
	{
		const id = req.user._id;
		const updateObj = req.body.agent;	// updateObj: {firstName, lastName, gender, address, phone}
		await User.findByIdAndUpdate(id, updateObj);
		
		req.flash("success", "Profile updated successfully");
		res.redirect("/agent/profile");
	}
	catch(err)
	{
		console.log(err);
		req.flash("error", "Some error occurred on the server.")
		res.redirect("back");
	}
	
});


module.exports = router;