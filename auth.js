const loginUser = (req, res, user) => {
  req.session.auth = {
    username: user.id,
  };
};

module.exports = {
  loginUser,
};
