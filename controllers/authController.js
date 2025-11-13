const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../modules/User");

const regester = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      picturePath,
      phoneNumber,
      cart,
      orders,
      favorite,
      roles,
    } = req.body;
    if (!firstName || !lastName || !email || !password || !phoneNumber)
      return res.status(400).json({ message: "All fields are required" });
    const duplicate = await User.findOne({ email }).exec();
    if (duplicate)
      return res
        .status(400)
        .json({ message: "this user is already regesterd please login" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const userObject = {
      firstName,
      lastName,
      email,
      password: hashedPassword,
      orders,
      phoneNumber,
      favorite,
      roles,
      picturePath,
      cart,
    };
    const user = await User.create(userObject);

    if (user) {
      //created
      return res.status(201).json({ message: `New user ${firstName} created` });
    } else {
      return res.status(400).json({ message: "Invalid user data received" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const foundUser = await User.findOne({ email }).exec();
    if (!foundUser) {
      return res
        .status(401)
        .json({ message: "this user is not in the data base" });
    }
    const match = await bcrypt.compare(password, foundUser.password);
    if (!match)
      return res
        .status(401)
        .json({ message: "The password or the email is wrong" });
    const accessToken = jwt.sign(
      {
        UserInfo: {
          ...foundUser,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { ...foundUser },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );
    // const accessToken = jwt.sign(
    //   {
    //     UserInfo: {
    //       email: foundUser.email,
    //       roles: foundUser.roles,
    //     },
    //   },
    //   process.env.ACCESS_TOKEN_SECRET,
    //   { expiresIn: "15m" }
    // );

    // const refreshToken = jwt.sign(
    //   { email: foundUser.email },
    //   process.env.REFRESH_TOKEN_SECRET,
    //   { expiresIn: "7d" }
    // );

    // Create secure cookie with refresh token
    res.cookie("jwt", refreshToken, {
      httpOnly: true, //accessible only by web server
      secure: true, //https
      sameSite: "None", //cross-site cookie
      maxAge: 7 * 24 * 60 * 60 * 1000, //cookie expiry: set to match rT
    });

    // Send accessToken containing username and roles
    return res.json({ accessToken });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const refresh = async (req, res) => {
  try {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.status(401).json({ message: "Unauthorized" });
    const refreshToken = cookies.jwt;
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      async (err, decoded) => {
        if (err) return res.status(403).json({ message: "Forbidden" });
        const foundUser = await User.findById(decoded._doc._id).exec();
        console.log(foundUser);

        if (!foundUser)
          return res.status(401).json({ message: "Unauthorized" });

        const accessToken = jwt.sign(
          {
            UserInfo: {
              ...foundUser,
            },
          },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "15m" }
        );
        // const foundUser = await User.findOne({
        //   email: decoded.email,
        // }).exec();

        // if (!foundUser)
        //   return res.status(401).json({ message: "Unauthorized" });

        // const accessToken = jwt.sign(
        //   {
        //     UserInfo: {
        //       email: foundUser.email,
        //       roles: foundUser.roles,
        //     },
        //   },
        //   process.env.ACCESS_TOKEN_SECRET,
        //   { expiresIn: "15m" }
        // );

        res.json({ accessToken });
      }
    );
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const logout = async (req, res) => {
  try {
    const cookies = req.cookies;
    if (!cookies?.jwt) res.sendStatus(204);
    res.clearCookie("jwt", {
      httpOnly: true,
      sameSite: "None",
      secure: true,
    });
    res.json({ message: "Cookie cleared" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const mod = async (req, res) => {
  try {
    const { firstName, lastName, password, picturePath, phoneNumber } =
      req.body;
    const { id } = req.params;
    const user = await User.findById(id).exec();
    if (!user) return res.status(404).json({ message: "user not found" });
    const hashedPassword = await bcrypt.hash(password, 10);
    user.firstName = firstName ? firstName : user.firstName;
    user.phoneNumber = phoneNumber ? phoneNumber : user.phoneNumber;
    user.email = user.email;
    user.lastName = lastName ? lastName : user.lastName;
    user.password = password ? hashedPassword : user.password;
    user.picturePath = picturePath ? picturePath : user.picturePath;
    user.favorite = user.favorite;
    user.orders = user.orders;
    user.roles = user.roles;
    user.cart = user.cart;
    const updatedUser = await user.save();

    return res.json({ message: "Your information are updated " });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { login, refresh, logout, regester, mod };
