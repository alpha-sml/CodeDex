import jwt from "jsonwebtoken";

const generateAccessToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

const generateRefreshToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

export { generateAccessToken, generateRefreshToken };
export default generateAccessToken;