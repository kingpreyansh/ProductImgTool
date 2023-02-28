import React, {useState} from "react";
import {GoCloudUpload} from "react-icons/go";

const Assets = () => {
  const [uploadImage, setUploadImage] = useState();
  const [image, setImage] = useState();
  const [maskImage, setMaskImage] = useState();

  function handleChange(e) {
    console.log(e.target.files);
    setUploadImage(URL.createObjectURL(e.target.files[0]));
    // var formData = new FormData();
    // formData.append("image", e.target.files[0]);
    // axios({
    //   method: "post",
    //   url: "http://localhost:3000/remove-bg",
    //   data: formData,
    // })
    //   .then((response) => {
    //     console.log(response.data);
    //     setImage(response.data.image);
    //     setMaskImage(response.data.mask);
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
  }

  return (
    <div className="nav-content">
      <h3 style={{marginTop: 0}}>Add Assets</h3>
      <label>
        <a className="btn-upload"><GoCloudUpload fontSize={20}/> Upload Image</a>
        <input
          style={{display: "none"}}
          type="file"
          accept={"image/*"}
          onChange={handleChange}
        />
      </label>

      <h4>Library</h4>
    </div>
  )
}

export default Assets;
