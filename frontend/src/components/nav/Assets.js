import React, {useEffect, useState} from "react";
import {GoCloudUpload} from "react-icons/go";
import AWS from 'aws-sdk';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

const Assets = () => {
  const s3 = new AWS.S3({
    accessKeyId: process.env.REACT_APP_S3_ACCESS_KEY,
    secretAccessKey: process.env.REACT_APP_S3_SECRET_ACCESS_KEY,
    region: process.env.REACT_APP_S3_BUCKET_REGION
  });

  const [listFiles, setListFiles] = useState([]);

  const listParams = {
    Bucket: process.env.REACT_APP_S3_BUCKET_NAME,
    Delimiter: '',
  };

  useEffect(() => {
    s3.listObjectsV2(listParams, (err, data) => {
      if (err) {
        console.log(err, err.stack);
      } else {
        setListFiles(data.Contents);
        console.log(data.Contents);
      }
    });
  }, []);

  async function handleChange(e) {
    const file = e.target.files[0];
    if (!file) {
      return;
    }
    const params = {
      Bucket: process.env.REACT_APP_S3_BUCKET_NAME,
      Key: `${Date.now()}.${file.name}`,
      Body: file,
      ContentType: 'image/png',
      ContentDisposition: 'inline'
    };
    const {Location} = await s3.upload(params).promise();
    console.log(Location);
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
      <ul className="image-list">
        {listFiles && listFiles.map((name, index) => (
          <li key={index}>
            <LazyLoadImage
              effect="blur"
              src={"https://s3.us-east-2.amazonaws.com/webdesigned.ai/" + name.Key}
              />
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Assets;
