const noBTC = (req, res, next) => {
  const { text } = req.body;
  if (text.toLowerCase().includes("bitcoin")) {
    req.body.text =
      "Upon further consideration, this hobbit has decided against investing in btc.";
  }
  next();
};

module.exports = noBTC;
