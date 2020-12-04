const adminLogin = (req, res) => {
  if (req.body.username === 'admin' && req.body.password === "123") {
    console.log('server: adminlogin');
    req.session.admin = true;
    req.session.loggedIn = true;
    res.send({ enabledAdmin: true});
  }
  else res.status(409)
}