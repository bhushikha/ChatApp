const Message = require('../modles/messages')

const addMeassage = async (req, res) => {
    try {
        const msg = req.body.msg;
        const userId = req.user.id;
        const groupid = req.params.id;

        await Message.create({ username: req.user.name, msg: msg, userId: userId, groupId: groupid });

        res.status(200).json({ message: "Message sent successfully", success: true });
    } catch (error) {
        res.status(500).json({ message: error, success: false });
    }
};


const getMeassage = async (req, res) => {
    try {
        const lastId = req.query.lastmsg || 0;
        if (lastId === undefined) {
            lastId = 0;
        }
        const lastIdN = +lastId;
        // const response = await Message.findAll({ offset: lastIdN });
        const groupid = req.params.id;
        // console.log(req.params.id)
        // if(lastId===undefined){
        //     lastId = 0;
        // }
        const response = await Message.findAll({ where: { groupId: groupid } });
        // console.log(response);
        res.status(200).json({ data: response, success: true })
    }
    catch (error) {
        res.status(500).json({ message: error, success: false });
    }
}
module.exports = {
    addMeassage,
    getMeassage
}