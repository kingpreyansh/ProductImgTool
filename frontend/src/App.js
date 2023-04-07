import React, {useEffect, useState} from "react";
import "./App.scss";
import Header from "./components/Header";
import Navbar from "./components/Navbar";
import axios from "axios";
import FreeTransform from 'react-free-transform'
import * as htmlToImage from 'html-to-image';
import AWS from "aws-sdk";
import {FaTimesCircle} from "react-icons/fa";
import {CircularProgress} from "react-loading-indicators";

function App() {
  const s3 = new AWS.S3({
    accessKeyId: process.env.REACT_APP_S3_ACCESS_KEY,
    secretAccessKey: process.env.REACT_APP_S3_SECRET_ACCESS_KEY,
    region: process.env.REACT_APP_S3_BUCKET_REGION
  });

  const listParams = {
    Bucket: process.env.REACT_APP_S3_BUCKET_NAME,
    Delimiter: '',
  };

  const [assetList, setAssetList] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);

  const [imgList, setImgList] = useState([]);
  const [selectedKey, setSelectedKey] = useState(-1);
  const [transformList, setTransformList] = useState([]);
  const [maxZIndex, setMaxZIndex] = useState(1);
  const transformInfo = {
    x: 150,
    y: 150,
    scaleX: 1,
    scaleY: 1,
    width: 300,
    height: 300,
    angle: 0,
    styles: {
      width: "100%",
      height: "100%"
    }
  };

  useEffect(() => {
    s3.listObjectsV2(listParams, (err, data) => {
      if (err) {
        console.log(err, err.stack);
      } else {
        setLoaded(true);
        setAssetList(data.Contents);
      }
    });
  }, []);

  const onRemoveBg = async () => {
    if (imgList[selectedKey]) {
      setLoading(true);

      var formData = new FormData();
      const response = await fetch(imgList[selectedKey] + "?" + Date.now());
      const data = await response.blob();
      const file = new File([data], imgList[selectedKey], {
        type: 'image/jpeg',
      });
      formData.append("image", file);

      axios({
        method: "post",
        url: "http://localhost:3000/remove-bg",
        data: formData,
      })
        .then(async (response) => {
          const temp = imgList[selectedKey].split("/");
          const key = temp[temp.length - 1];
          await doUpload(key + '_result.png', response.data.image);
          // await doUpload(key + '_mask.png', response.data.mask);

          const tmp = [...imgList];
          tmp[selectedKey] = response.data.image;
          setImgList(tmp);
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
          console.log(error);
        });
    }
  }

  const doUpload = async (key, url) => {
    const response = await fetch(url);
    const data = await response.blob();
    const file = new File([data], key, {
      type: 'image/png',
    });

    const params = {
      Bucket: process.env.REACT_APP_S3_BUCKET_NAME,
      Key: key,
      Body: file,
      ContentType: 'image/png',
      ContentDisposition: 'inline'
    };
    const {Location} = await s3.upload(params).promise();
    if (Location) {
      setAssetList([{Key: key}, ...assetList]);
    }
  }

  const onDownload = async () => {
    let content = document.getElementById('img_box');

    setSelectedKey(-1);

    htmlToImage.toPng(content)
      .then(function (dataUrl) {
        let link = document.createElement("a");
        link.href = dataUrl;
        link.download = "1.png";
        link.click();
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const onTransform = (index, value) => {
    setSelectedKey(index);
    const tmp = [...transformList];
    tmp[index] = {...tmp[index], ...value};
    setTransformList(tmp);
  };

  const onBringToFront = () => {
    setMaxZIndex(maxZIndex + 1);
    let elements = document.getElementsByClassName('img-active');
    for (const element of elements) {
      element.style.zIndex = maxZIndex;
    }
  }

  const onSendToBack = () => {
    let elements = document.getElementsByClassName('img-active');
    for (const element of elements) {
      element.style.zIndex = 0;
    }
  }

  const onUploadAssets = async (fileList) => {
    for (const file of fileList) {
      const key = `${Date.now()}.${file.name}`
      const params = {
        Bucket: process.env.REACT_APP_S3_BUCKET_NAME,
        Key: key,
        Body: file,
        ContentType: 'image/png',
        ContentDisposition: 'inline'
      };
      const {Location} = await s3.upload(params).promise();
      if (Location) {
        setAssetList([{Key: key}, ...assetList]);
      }
    }
  }

  const onDelete = (index) => {
    console.log(index);
    let tmp = [...imgList];
    tmp.splice(index, 1);
    setImgList(tmp);

    let tmp2 = [...transformList];
    tmp2.splice(index, 1);
    setTransformList(tmp2);
  }

  const onDeleteAsset = (index, key) => {
    s3.deleteObject({Bucket: process.env.REACT_APP_S3_BUCKET_NAME, Key: key}, (err, data) => {
      let tmp = [...assetList];
      tmp.splice(index, 1);
      setAssetList(tmp);
    });
  }
  return (
    <div className="App">
      <Header/>
      <div className="container">
        <Navbar
          assetList={assetList}
          loaded={loaded}
          onUploadAssets={(fileList) => onUploadAssets(fileList)}
          onDeleteAsset={(index, key) => onDeleteAsset(index, key)}
          onReplaceImg={(img) => {
            const tmp = [...imgList];
            tmp[selectedKey] = img;
            setImgList(tmp);
          }}
          onInsertImg={(img) => {
            setImgList([...imgList, img]);
            setTransformList([...transformList, transformInfo]);
            setSelectedKey(imgList.length);
          }}
          onRemoveBg={() => onRemoveBg()}
          onDownload={() => onDownload()}
          onBringToFront={() => onBringToFront()}
          onSendToBack={() => onSendToBack()}
        />
        <div className="page-content">
          <div className="img-box">
            {loading &&
              <CircularProgress variant="disc" color="#32cd32" size="medium" text="" textColor=""/>
            }
            <div id="img_box">
              {imgList && imgList.map((item, index) => (
                <div
                  className={"img " + (selectedKey === index ? 'img-active' : '')}
                  onClick={() => {
                    setSelectedKey(index)
                  }}
                  key={index}>
                  <FreeTransform
                    {...transformList[index]}
                    onUpdate={(value) => {
                      onTransform(index, value)
                    }}
                    classPrefix="tr"
                    disableScale={false}
                  >
                    <div>
                      <a className="btn-remove" onClick={() => onDelete(index)}><FaTimesCircle color="red"/></a>
                      <img
                        src={imgList[index] + "?" + Date.now()}
                        crossOrigin="anonymous"
                        style={{
                          ...transformList[index]
                        }}
                      />
                    </div>
                  </FreeTransform>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
