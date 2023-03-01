import React from "react";
import {GoCloudUpload} from "react-icons/go";
import {LazyLoadImage} from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Constants from "../../config/Constants";
import {FaTimesCircle} from "react-icons/fa";

const Assets = (props) => {
  const assetList = props.assetList;
  const loaded = props.loaded;

  async function onUploadAssets(e) {
    const fileList = e.target.files;
    if (!fileList) {
      return;
    }
    props.onUploadAssets(fileList);
  }

  const onInsertImg = (key) => {
    props.onInsertImg(Constants.S3_URL_PREFIX + key);
  }

  const onDeleteAsset = (index, key) => {
    props.onDeleteAsset(index, key);
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
          onChange={onUploadAssets}
          multiple
        />
      </label>

      <h4>Library</h4>
      <ul className="image-list">
        {assetList && loaded && assetList.map((item, index) => (
          <li key={index}>
            <LazyLoadImage
              onClick={() => onInsertImg(item.Key)}
              effect="blur"
              src={Constants.S3_URL_PREFIX + item.Key}
            />
            <a className="btn-remove" onClick={() => onDeleteAsset(index, item.Key)}><FaTimesCircle color="red"/></a>
          </li>
        ))}
        {!loaded &&
          Array(15)
            .fill()
            .map((item, index) => (
              <Skeleton key={index} width={86} height={86}/>
            ))
        }
      </ul>
    </div>
  )
}

export default Assets;
