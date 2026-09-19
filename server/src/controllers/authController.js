import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

// Mock memory user store fallback when DB is connecting
const inMemoryUsers = [];

export const loginUser = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      // Create user automatically for quick hackathon demo login
      const hashedPassword = await bcrypt.hash(password || "password123", 10);
      user = new User({
        name: email ? email.split("@")[0] : "Command Officer",
        email: email || "commander@resq.gov",
        password: hashedPassword,
        role: role || "Commander",
      });
      await user.save().catch(() => {
        inMemoryUsers.push(user);
      });
    }

    const token = jwt.sign(
      { id: user._id || user.id, role: user.role, name: user.name },
      process.env.JWT_SECRET || "resq_secret_key_2026_ps2",
      { expiresIn: "7d" }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user._id || user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    const mockToken = jwt.sign(
      { id: "usr-01", role: role || "Commander", name: "Command Officer" },
      process.env.JWT_SECRET || "resq_secret_key_2026_ps2"
    );
    res.json({
      success: true,
      token: mockToken,
      user: {
        id: "usr-01",
        name: "Command Officer",
        email: email || "commander@resq.gov",
        role: role || "Commander",
      },
    });
  }
};
