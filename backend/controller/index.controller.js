const { exec } = require("child_process");
const request = require("request");
const axios = require("axios");
const FormData = require("form-data");
const { writeFileSync, createReadStream } = require("fs");
const sharp = require("sharp");

const removeBg = async (req, res) => {
  try {
    const imageUrl = req.body.imageUrl;
    const fileName = imageUrl
      .split("/")
      .pop()
      .replace(/\.[^/.]+$/, "");

    const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
    const imageBuffer = Buffer.from(response.data, "binary");

    const original = sharp(imageBuffer);
    const originMeta = await original.metadata();

    const data = new FormData();
    data.append("file", imageBuffer, { filename: `${fileName}.png` });
    const options = {
      method: "POST",
      url: "https://remove-background-image2.p.rapidapi.com/remove-background",
      headers: {
        "X-RapidAPI-Key": "67f7f33bc6msh5b334ec6fe61bccp12eb5ajsn974a8beb12d7",
        "X-RapidAPI-Host": "remove-background-image2.p.rapidapi.com",
        ...data.getHeaders(),
      },
      data: data,
    };

    axios
      .request(options)
      .then(async function (response) {
        const base64 = response.data.image;
        let resultImage = Buffer.from(base64, "base64");
        writeFileSync(
          `${__dirname}/../public/results/${fileName}.png`,
          resultImage
        );

        resultImage = sharp(resultImage);
        const resultMeta = await resultImage.metadata();
        if (
          originMeta.width != resultMeta.height ||
          originMeta.height != resultMeta.height
        ) {
          resultImage = resultImage.rotate(90);
        }
        await resultImage
          .extractChannel("alpha")
          .toFile(`${__dirname}/../public/masks/${fileName}.png`);

        res.status(200).json({
          image: `http://localhost:3000/results/${fileName}.png`,
          mask: `http://localhost:3000/masks/${fileName}.png`,
        });
      })
      .catch(function (error) {
        console.error(error);
        res.status(400).json({ message: "Something happened wrong" });
      });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Something happened wrong" });
  }
};

module.exports = {
  removeBg,
};
