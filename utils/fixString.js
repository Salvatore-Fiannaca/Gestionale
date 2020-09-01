const fixString = (str) => {
  let firstPass = str.replace(" ", "-");
  let secondPass = firstPass.replace(" ", "-");
  let thirdPass = secondPass.replace(" ", "-");
  let fourthPass = thirdPass.replace(" ", "-");
  return fourthPass;
};

module.exports = fixString;
