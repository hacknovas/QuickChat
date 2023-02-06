const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserModel = mongoose.Schema({
    name: {
        type: String, required: true
    },
    email: {
        type: String, required: true, unique: true
    },
    password: {
        type: String, required: true
    },
    pic: {
        type: String,
        default: "https://cdn-icons-png.flaticon.com/512/3177/3177440.png"
    },
}, { timestamps: true })

UserModel.methods.matchPass = async function (enterPass) {
    return await bcrypt.compare(enterPass, this.password);
}

UserModel.pre("save", async function (next) {
    if (!this.isModified) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
})


const User = mongoose.model("User", UserModel);

module.exports = User;