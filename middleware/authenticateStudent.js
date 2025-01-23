const jwt = require("jsonwebtoken");

module.exports = authenticateStudent = async (req, res) => {
  const token = req.header("Authorization");
  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(
      token.replace("Bearer ", ""),
      process.env.ACCES_TOKEN
    );

    if (decoded.role === "Student") {
      req.student = decoded;
    } else {
      return res
        .status(401)
        .json({ message: "Access denied. No token provided." });
    }
  } catch (error) {
    res.status(400).json({ message: "Invalid token." });
  }
};
