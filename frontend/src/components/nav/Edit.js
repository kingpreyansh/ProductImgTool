import React, {useState} from "react";
import {BiImageAlt} from "react-icons/bi";
import {FiDownload} from "react-icons/fi";
import {MdOutlineLayers} from "react-icons/md";

const Edit = (props) => {
  const [filename, setFilename] = useState('');

  function handleChange(e) {
    setFilename(e.target.files[0].name);
    props.onChangeImg(e.target.files[0]);
  }

  function onRemoveBg() {
    props.onRemoveBg();
  }

  function onDownload() {
    props.onDownload();
  }

  return (
    <div className="nav-content">
      <h3 style={{marginTop: 0}}>Edit Image</h3>
      <div className="replace-box">
        {filename &&
          <span className="img-name">
            <BiImageAlt/> {filename}
          </span>
        }
        <label>
          <input
            style={{display: "none"}}
            type="file"
            accept={"image/*"}
            onChange={handleChange}
          />
          <a className="btn-replace">
            {filename ? 'Replace' : 'Insert'}
          </a>
        </label>
      </div>
      <h4 style={{marginBottom: 10}}>Arrange</h4>
      <div className="bring-box">
        <a className="btn-bring"><MdOutlineLayers fontSize={24}/> Bring to Front</a>
        <a className="btn-bring reverse"><MdOutlineLayers fontSize={24}/> Send to Back</a>
      </div>
      <h4 style={{marginBottom: 10}}>Tools</h4>
      <div className="btn-remove-bg" onClick={onRemoveBg}>
        Remove Background
        <br/>
        <span>Remove the background of your image in one click.</span>
      </div>
      <div className="btn-remove-bg">
        Magic Erase
        <br/>
        <span>Paint over objects to erase them from the image.</span>
      </div>
      <div className="btn-remove-bg">
        Upscale
        <br/>
        <span>Upscale image up to 2k resolution.</span>
      </div>
      <h4 style={{marginBottom: 10}}>Download</h4>
      <div className="btn-upload" onClick={onDownload}>
        <FiDownload/>
        Download Image
      </div>
    </div>
  )
}

export default Edit;
