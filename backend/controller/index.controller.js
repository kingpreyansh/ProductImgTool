const { exec } = require("child_process");
const removeBg = async (req, res) => {
  try {
    const fileName = req.file.filename.replace(/\.[^/.]+$/, "");
    const cmd = `python removebg.py ${req.file.path} ${fileName}`;
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.log("error occurs at cmd_img : " + error);
        res.status(400).json({ message: "Something happened wrong" });
      }
      res.status(200).json({ image: `http://localhost:3000/results/${fileName}.png` , mask : `http://localhost:3000/masks/${fileName}.png` });
      
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Something happened wrong" });
  }
};

module.exports = {
  removeBg,
};
