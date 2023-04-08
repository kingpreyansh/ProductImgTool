const { exec } = require("child_process");
const request = require('request');
const axios = require("axios");
const FormData = require("form-data");
const { writeFileSync, createReadStream } = require("fs");

const removeBg = async (req, res) => {
  try {
    const fileName = req.file.filename.replace(/\.[^/.]+$/, "");
    // const cmd = `python removebg.py ${req.file.path} ${fileName}`;
    const data = new FormData();
    data.append("file", createReadStream(req.file.path));
    const options = {
      method: 'POST',
      url: 'https://remove-background-image2.p.rapidapi.com/remove-background',
      headers: {
        'X-RapidAPI-Key': '67f7f33bc6msh5b334ec6fe61bccp12eb5ajsn974a8beb12d7',
        'X-RapidAPI-Host': 'remove-background-image2.p.rapidapi.com',
        ...data.getHeaders()
      },
      data: data
    };

    axios.request(options).then(function (response) {
      const base64 = response.data.image;
      console.log(response.data);
      const resultImage = Buffer.from(base64, "base64");
      writeFileSync(`${__dirname}/../public/results/${fileName}.png`, resultImage);
      const original = sharp(`${__dirname}/../public/inputs/${fileName}.png`);
      const originMeta = await original.metadata();
      let resultImage = sharp(`${__dirname}/../public/results/${fileName}.png`);
      const resultMeta = await resultImage.metadata();
      if(originMeta.width != resultMeta.height || originMeta.height != resultMeta.height) {
        resultImage = resultImage.rotate(90);
      }
      await resultImage.extractChannel("alpha").toFile(`${__dirname}/../public/masks/${fileName}.png`);
      // writeFileSync(`${__dirname}/../public/masks/${fileName}.png`, resultImage);
      res.status(200).json({ image: `http://localhost:3000/results/${fileName}.png` , mask : `http://localhost:3000/masks/${fileName}.png` });
      // res.status(200).json({ image: `http://localhost:3000/results/${fileName}.png`});
    }).catch(function (error) {
      console.error(error);
      res.status(400).json({ message: "Something happened wrong" });
    });
    // exec(cmd, (error, stdout, stderr) => {
    //   if (error) {
    //     console.log("error occurs at cmd_img : " + error);
    //     res.status(400).json({ message: "Something happened wrong" });
    //   }
    //   res.status(200).json({ image: `http://localhost:3000/results/${fileName}.png` , mask : `http://localhost:3000/masks/${fileName}.png` });
    // });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Something happened wrong" });
  }
};

module.exports = {
  removeBg,
};
