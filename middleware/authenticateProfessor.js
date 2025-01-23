const jwt = require("jsonwebtoken");

module.exports = authenticateProfessor = async (req, res, next) => {
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
    if (decoded.role === "Professor") {
      req.professor = decoded;
    } else {
      return res
        .status(401)
        .json({ message: "Access denied. No token provided." });
    }
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid token." });
  }
};
