const User = require('../modles/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
function isstringinvalid(string) {
    if (string == undefined || string.length === 0) {
        return true;
    }
    else {
        return false;
    }
}
const signup = async (req, res) => {
    try {
        const { name, email, phonenumber, password } = req.body;
        // console.log(name)
        if (isstringinvalid(name) || isstringinvalid(email) || isstringinvalid(phonenumber) || isstringinvalid(password)) {
            return res.status(400).json({ err: "Bad parameters. Something is missing" });
        }
        const result = await User.findAll({ where: { email } })
        if (result.length > 0) {
            return res.json({ message: "User already exists, Please Login" });
        }
        const saltrounds = 10;
        bcrypt.hash(password, saltrounds, async (err, hash) => {
            await User.create({ name, email, phonenumber, password: hash });
            // console.log(name)
            return res.status(201).json({ message: 'Successfully created new user', succes: true });
        })
    }
    catch (error) {
        res.status(500).json(error);
    }
}
function generateAccessToken(id, name) {
    return jwt.sign({ userId: id, name: name }, process.env.TOKEN_SECRET)
}
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (isstringinvalid(email) || isstringinvalid(password)) {
            return res.status(400).json({ message: 'Email id or password is missing', success: false });
        }
        const user = await User.findAll({ where: { email } })
        // console.log(user[0])
        if (user.length > 0) {
            bcrypt.compare(password, user[0].password, (err, result) => {
                if (err) {
                    throw new Error('Something went wrong')
                }
                if (result) {
                    // console.log('123')
                    return res.status(200).json({ message: "User logged in successfully", token: generateAccessToken(user[0].id, user[0].name), success: true })
                    const name = user[0].name;
                    const email = user[0].email;
                    return res.status(200).json({
                        message: "User logged in successfully", token: generateAccessToken(user[0].id, user[0].name),
                        name: name, email: email, success: true
                    })
                }
                else {
                    return res.status(401).json({ message: 'Password is incorrect', success: false });
                }
            })
        }
        else {
            return res.status(404).json({ message: 'User does not exist', success: false });
        }
    }
    catch (err) {
        res.status(500).json({ message: err, success: false });
    }
}
module.exports = {
    signup,
    login
}