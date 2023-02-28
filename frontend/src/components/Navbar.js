import {FaRegFolder} from "react-icons/fa";
import {HiOutlineRefresh} from "react-icons/hi";
import {BsToggles2} from "react-icons/bs";
import Assets from "./nav/Assets";
import {useState} from "react";
import Generate from "./nav/Generate";
import Edit from "./nav/Edit";

const Navbar = (props) => {
  const [idx, setIdx] = useState(0);

  return (
    <div className="nav-container">
      <div className="navbar">
        <ul>
          <li>
            <a onClick={() => {setIdx(0)}} className={idx === 0 ? 'active' : ''}>
              <FaRegFolder/> Assets
            </a>
          </li>
          <li>
            <a onClick={() => {setIdx(1)}} className={idx === 1 ? 'active' : ''}>
              <HiOutlineRefresh/> Generate
            </a>
          </li>
          <li>
            <a onClick={() => {setIdx(2)}} className={idx === 2 ? 'active' : ''}>
              <BsToggles2/> Edit
            </a>
          </li>
        </ul>
      </div>

      {idx === 0 && <Assets/>}
      {idx === 1 && <Generate/>}
      {idx === 2 &&
        <Edit
          onChangeImg={(img) => props.onChangeImg(img)}
          onRemoveBg={() => props.onRemoveBg()}
          onDownload={() => props.onDownload()}
        />
      }
    </div>
  )
};

export default Navbar;
