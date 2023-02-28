import React, {useState} from "react";
import "./App.scss";
import Header from "./components/Header";
import Navbar from "./components/Navbar";
import axios from "axios";
import FreeTransform from 'react-free-transform'
import * as htmlToImage from 'html-to-image';

function App() {
  const [img, setImg] = useState();
  const [file, setFile] = useState();
  const [transformInfo, setTransformInfo] = useState({
    x: 0,
    y: 0,
    scaleX: 1,
    scaleY: 1,
    width: 300,
    height: 300,
    angle: 0,
    styles: {
      width: "100%",
      height: "100%"
    }
  });

  const onRemoveBg = () => {
    if (file) {
      var formData = new FormData();
      formData.append("image", file);
      axios({
        method: "post",
        url: "http://localhost:3000/remove-bg",
        data: formData,
      })
        .then((response) => {
          setImg(response.data.image);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  const onDownload = async () => {
    if (file) {
      let content = document.getElementById('img_box');

      document.getElementsByClassName('tr-transform__controls')[0].style.display = 'none';

      htmlToImage.toPng(content)
        .then(function (dataUrl) {
          let element = document.createElement("a");
          element.href = dataUrl;
          element.download = file.name;
          element.click();

          document.getElementsByClassName('tr-transform__controls')[0].style.display = 'block';
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  };

  const onTransform = (value) => {
    setTransformInfo({...transformInfo, ...value});
  };

  return (
    <div className="App">
      <Header/>
      <div className="container">
        <Navbar
          onChangeImg={(file) => {
            setImg(URL.createObjectURL(file));
            setFile(file);
          }}
          onRemoveBg={() => onRemoveBg()}
          onDownload={() => onDownload()}
        />
        <div className="page-content">
          <div className="img-box">
            {img &&
              <div id="img_box">
                <FreeTransform
                  {...transformInfo}
                  onUpdate={value => {onTransform(value)}}
                  classPrefix="tr"
                  disableScale={false}
                >
                  <img
                    src={img}
                    style={{
                      ...transformInfo
                    }}
                  />
                </FreeTransform>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
