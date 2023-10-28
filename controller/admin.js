const Group = require('../models/group');
const UserGroup = require('../models/userGroup');
const User = require('../models/user');

function isStringInvalid(string) {
    return string === undefined || string.length === 0;
}

const addMember = async (req, res) => {
    try {
        const groupId = req.params.id;
        const name = req.body.name;
        const email = req.body.email;

        if (isStringInvalid(name) && isStringInvalid(email)) {
            return res.status(400).json({ err: "Bad parameters." });
        }

        let user;

        if (!isStringInvalid(name)) {
            user = await User.findOne({ where: { name: name } });
        } else if (!isStringInvalid(email)) {
            user = await User.findOne({ where: { email: email } });
        }

        if (!user) {
            return res.status(404).json({ message: "User not found", success: false });
        }

        const existingUserGroup = await UserGroup.findOne({ where: { userId: user.id, groupId: groupId } });

        if (existingUserGroup) {
            return res.status(200).json({ message: "User already in the group", success: true });
        }

        await UserGroup.create({ isadmin: false, userId: user.id, groupId: groupId });
        res.status(201).json({ message: "User added to the group", success: true });
    } catch (error) {
        res.status(500).json({ message: error.message, success: false });
    }
};

const removeMember = async (req, res) => {
    try {
        const groupId = req.params.id;
        const userId = req.body.userid;

        await UserGroup.destroy({ where: { userId: userId, groupId: groupId } });
        res.status(200).json({ message: "User Removed", success: true });
    } catch (error) {
        res.status(500).json({ message: error.message, success: false });
    }
};

const makeAdmin = async (req, res) => {
    try {
        const groupId = req.params.id;
        const userId = req.body.userid;

        await UserGroup.update({ isadmin: true }, { where: { userId: userId, groupId: groupId } });
        res.status(200).json({ message: "Successfully made as an Admin", success: true });
    } catch (error) {
        res.status(500).json({ message: error.message, success: false });
    }
};

const removeAdmin = async (req, res) => {
    try {
        const groupId = req.params.id;
        const userId = req.body.userid;

        await UserGroup.update({ isadmin: false }, { where: { userId: userId, groupId: groupId } });
        res.status(200).json({ message: "Successfully removed as Admin", success: true });
    } catch (error) {
        res.status(500).json({ message: error.message, success: false });
    }
};

module.exports = {
    addMember,
    removeMember,
    makeAdmin,
    removeAdmin
};
