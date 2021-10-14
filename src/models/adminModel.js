const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");


const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        lowerCase: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    }
})

adminSchema.pre("save", async function (next) {
    const admin = this;

    if (this.isModified("password")) {
        admin.password = await bcrypt.hash(admin.password, 8);
    }
    next();
});

// Compare between given Password to hashed Password
adminSchema.statics.findByCredentials = async (email, password) => {
    const admin = await Admin.findOne({ email });

    if (!admin) {
        throw new Error({ error: "Unable to login!" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
        throw new Error({ error: "Unable to login!" });
    }
    return admin;
};

adminSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();
    delete userObject.password;
    delete userObject.__v;  
    delete userObject._id;  
    return userObject;
};

const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;