const ContactMessage = require("../models/ContactMessage");

exports.createContactMessage = async (req, res) => {
    try {
        const { name, email, message } = req.body;

        if (!name?.trim() || !email?.trim() || !message?.trim()) {
            return res.status(400).json({ message: "Name, email, and message are required." });
        }

        const savedMessage = await ContactMessage.create({ name, email, message });
        return res.status(201).json({
            message: "Your message has been sent successfully.",
            id: savedMessage._id
        });
    } catch (error) {
        return res.status(500).json({ message: "Unable to save your message. Please try again." });
    }
};
