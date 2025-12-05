const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User");

/* ----------------------------------------------------
   MASTER → REGISTER ADMIN
----------------------------------------------------- */
router.post("/register-admin", async (req, res) => {
  try {
    const { name, email, password, assignedForm } = req.body;

    const exist = await User.findOne({ email });
    if (exist) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const admin = await User.create({
      name,
      email,
      password: hashed,
      role: "admin",
      assignedForm,
      createdBy: null,
    });

    res.json({
      message: "Admin registered successfully",
      user: admin,
    });
  } catch (err) {
    console.error("Error in register-admin:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ----------------------------------------------------
   LOGIN (MASTER + ADMIN + USER)
----------------------------------------------------- */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      email: { $regex: `^${email}$`, $options: "i" },
    });

    if (!user) return res.status(401).json({ message: "User not found" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: "Invalid password" });

    // ------------------------------
    // 1️⃣ Check if user is inactive
    // ------------------------------
    if (user.isActive === false) {
      return res.status(403).json({
        message:
          "Your subscription has expired. For Re-new contact with us by Email: comanfake@gmail.com",
        inactive: true,
      });
    }

    // // ------------------------------
    // // 2️⃣ Check subscription expiration
    // // ------------------------------
    // const now = new Date();
    // if (user.subscriptionEnd && now > user.subscriptionEnd) {
    //   return res.status(403).json({
    //     message: "Your subscription has expired. Please renew to continue.",
    //     expired: true,
    //   });
    // }

    // ------------------------------
    // 3️⃣ Successful login
    // ------------------------------
    res.json({
      message: "Login successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdBy: user.createdBy,
        assignedForm: user.assignedForm,
        isActive: user.isActive,
        subscriptionEnd: user.subscriptionEnd,
      },
    });
  } catch (err) {
    console.error("Error in login:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ----------------------------------------------------
   CHECK ANY ADMIN EXISTS
----------------------------------------------------- */
router.get("/check-admin", async (req, res) => {
  try {
    const admin = await User.findOne({ role: "admin" });
    return res.json({ exists: !!admin });
  } catch (err) {
    console.error("Error in check-admin:", err);
    res.status(500).json({ exists: false });
  }
});

/* ----------------------------------------------------
   ADMIN → REGISTER USER
----------------------------------------------------- */
router.post("/register-user", async (req, res) => {
  try {
    const { name, email, password, adminId } = req.body;

    const admin = await User.findById(adminId);
    if (!admin || admin.role !== "admin") {
      return res.status(403).json({ message: "Only admin can create users" });
    }

    const exist = await User.findOne({ email });
    if (exist) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashed,
      role: "user",
      createdBy: admin._id,
      assignedForm: admin.assignedForm,
    });

    await user.save();

    res.json({
      message: "User created successfully",
      user,
    });
  } catch (err) {
    console.error("Error in register-user:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ----------------------------------------------------
   ADMIN → VIEW USERS HE CREATED
   GET /api/auth/my-users/:adminId
----------------------------------------------------- */
router.get("/my-users/:adminId", async (req, res) => {
  try {
    const users = await User.find({
      createdBy: req.params.adminId,
      role: "user",
    });
    res.json({ users });
  } catch (err) {
    console.error("Error in my-users:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ----------------------------------------------------
   ADMIN → DELETE A SPECIFIC USER
   DELETE /api/auth/delete-user/:id
----------------------------------------------------- */
router.delete("/delete-user/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Error in delete-user:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ----------------------------------------------------
   GET ALL ADMINS
----------------------------------------------------- */
router.get("/get-admins", async (req, res) => {
  try {
    const admins = await User.find({ role: "admin" });
    res.json(admins);
  } catch (err) {
    console.error("Error in get-admins:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ----------------------------------------------------
   GET ALL USERS
----------------------------------------------------- */
router.get("/get-users", async (req, res) => {
  try {
    const users = await User.find({ role: "user" }).populate(
      "createdBy",
      "name email role"
    );
    res.json(users);
  } catch (err) {
    console.error("Error in get-users:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ----------------------------------------------------
   DELETE ADMIN + ALL USERS CREATED BY THAT ADMIN
   DELETE /api/auth/delete-admin/:id
----------------------------------------------------- */
router.delete("/delete-admin/:id", async (req, res) => {
  try {
    const adminId = req.params.id;
    const admin = await User.findById(adminId);

    if (!admin) return res.status(404).json({ message: "Admin not found" });

    await User.deleteMany({ createdBy: adminId });
    await User.findByIdAndDelete(adminId);

    res.json({
      message: "Admin and all users created by this admin deleted successfully",
    });
  } catch (err) {
    console.error("Error in delete-admin:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ----------------------------------------------------
   TOGGLE ACTIVE / INACTIVE (Admin + User)
   PUT /api/auth/toggle-active/:id
   For Admins,
----------------------------------------------------- */
router.put("/toggle-admin-active/:id", async (req, res) => {
  const admin = await User.findById(req.params.id);
  if (!admin) return res.status(404).json({ message: "Admin not found" });

  admin.isActive = !admin.isActive;
  admin.updatedAt = new Date();
  await admin.save();

  res.json({ message: "Admin updated" });
});

//For Users,
router.put("/toggle-user-active/:id", async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  user.isActive = !user.isActive;
  user.updatedAt = new Date();
  await user.save();

  res.json({ message: "User updated" });
});

//TOGGLE ACTIVE / INACTIVE Time Stamp Update
router.patch("/toggle-active/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Flip status
    user.isActive = !user.isActive;

    // ⭐ Update status change time
    user.statusChangedAt = new Date();

    await user.save();

    res.json({
      message: `User ${user.isActive ? "Activated" : "Deactivated"}`,
      user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
