const bcrypt = require("bcryptjs");

const hashearPassword = async (passUser) => {
    const passHash = await bcrypt.hash(passUser, 10);
    return passHash;
};

module.exports = {
    hashearPassword,
}