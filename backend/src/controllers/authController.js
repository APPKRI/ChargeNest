const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {

    try {

        const { name, email, password, role } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {

            return res.status(400).json({

                message: "User already exists"

            });

        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({

            name,
            email,
            password: hashedPassword,
            role

        });


        const token = jwt.sign(

            {

                id: user._id

            },

            process.env.JWT_SECRET,

            {

                expiresIn: "1d"

            }

        );


        res.status(201).json({

    token,

    user:{

        id:user._id,

        name:user.name,

        email:user.email,

        role:user.role

    }

});


    }

    catch (err) {

        res.status(500).json({

            message: err.message

        });

    }

}

exports.login = async (req, res) => {

    try {

        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {

            return res.status(400).json({

                message: "Invalid Credentials"

            });

        }


        const isMatch = await bcrypt.compare(

            password,

            user.password

        );


        if (!isMatch) {

            return res.status(400).json({

                message: "Invalid Credentials"

            });

        }


        const token = jwt.sign(

            {

                id: user._id

            },

            process.env.JWT_SECRET,

            {

                expiresIn: "1d"

            }

        );


        res.status(200).json({

    token,

    user:{

        id:user._id,

        name:user.name,

        email:user.email,

        role:user.role

    }

});


    }

    catch (err) {

        res.status(500).json({

            message: err.message

        });

    }

};

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            balance: user.balance || 0
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.rechargeWallet = async (req, res) => {
    try {
        const { userId, amount } = req.body;
        if (!userId || !amount || amount <= 0) {
            return res.status(400).json({ message: "Invalid parameters" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.balance = (user.balance || 0) + Number(amount);
        await user.save();

        res.json({
            message: "Recharge successful",
            balance: user.balance
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};