import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'

import {FiLogOut} from 'react-icons/fi'
import {AiFillHome} from 'react-icons/ai'
import {BsFillBriefcaseFill} from 'react-icons/bs'
import './index.css'

const Header = props => {
  const {history} = props
  const onClickLogout = () => {
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  return (
    <>
      <nav className="nav-header-container">
        <div className="nav-content-container">
          <div className="small-devices-container">
            <Link to="/">
              <img
                className="website-logo"
                src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
                alt="website logo"
              />
            </Link>
            <ul className="nav-menu-items-container">
              <li className="list">
                <Link to="/">
                  <AiFillHome className="nav-item-link" />
                </Link>
              </li>
              <li className="list">
                <Link to="/jobs">
                  <BsFillBriefcaseFill className="nav-item-link" />
                </Link>
              </li>
            </ul>
            <div>
              <button
                label="text"
                className="logout-link-button"
                type="button"
                onClick={onClickLogout}
              >
                <FiLogOut />
              </button>
            </div>
          </div>
          <div className="large-devices-container">
            <Link to="/">
              <img
                className="website-logo"
                src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
                alt="website logo"
              />
            </Link>
            <ul className="nav-menu-items-container">
              <li className="menu-item">
                <Link className="nav-item" to="/">
                  Home
                </Link>
              </li>
              <li className="menu-item">
                <Link className="nav-item" to="/jobs">
                  Jobs
                </Link>
              </li>
            </ul>
            <button
              className="logout-button"
              type="button"
              onClick={onClickLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </nav>
    </>
  )
}

export default withRouter(Header)
