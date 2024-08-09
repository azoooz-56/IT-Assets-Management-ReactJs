import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Logo from '../../assets/images/logo.png';
import './Sidebar.css';

const sidebarContent = [
  {
    ID: 'item-1',
    isActive: true,
    path: '/',
    icon: 'house',
    text: 'Dashboard',
  },
  {
    ID: 'item-2',
    isActive: false,
    path: '/assets',
    icon: 'inbox',
    text: 'Assets',
  },
  // {
  //   ID: 'item-3',
  //   isActive: false,
  //   path: '/asignados',
  //   icon: 'user',
  //   text: 'Asignados',
  // },
  // {
  //   ID: 'item-4',
  //   isActive: false,
  //   path: '/cerrados',
  //   icon: 'check',
  //   text: 'Cerrados',
  // },
];

const Sidebar = () => {
  const project = 'IT Assets';

  const [items, setItems] = useState(sidebarContent);
  const [link, setLink] = useState('');
  const [open, setOpen] = useState(true);
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    if (link !== '') {
      setItems((prevItems) => {
        const newItems = prevItems.map((item) => {
          if (item.ID === link) {
            return { ...item, isActive: true }; // Activate the selected item
          }

          return { ...item, isActive: false };
        });
        return newItems;
      });
    }
  }, [link]);

  const handleSideBar = () => {
    setOpen((open) => !open);
  };

  const handleMobileBar = () => {
    setMobile((mobile) => !mobile);
  };

  return (
    <div className={open ? 'sidebar' : 'sidebar min'}>
      <div className="sidebar-container">
        <header className="sidebar-header">
          <img className="sidebar-logo" src={Logo} alt="" />
          <h1 className="sidebar-title">{project}</h1>
          <button className="sidebar-button hidden" type="button" onClick={handleSideBar}>
            <i className={open ? 'fa-solid fa-arrow-left' : 'fa-solid fa-bars'} />
          </button>
        </header>
        <button className="sidebar-button mobile" type="button" onClick={handleMobileBar}>
          <i className={mobile ? 'fa-solid fa-x' : 'fa-solid fa-bars'} />
        </button>
        <div className={mobile ? 'sidebar-content mobile' : 'sidebar-content mobile hidden'}>
          <h2 className="sidebar-subtitle">Inbox</h2>
          <nav className="sidebar-nav ">
            <ul className="sidebar-list">
              {items.map((item) => (
                <SidebarItem
                  key={item.ID}
                  ID={item.ID}
                  path={item.path}
                  active={item.isActive}
                  icon={item.icon}
                  text={item.text}
                  setLink={setLink}
                  setMobile={setMobile}
                />
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
};

/* eslint-disable */
const SidebarItem = ({ ID, path, active, icon, text, setLink, setMobile }) => {
  /* eslint-enable */
  const iconClassName = `sidebar-icon fa-solid fa-${icon}`;

  const handleStatus = () => {
    setLink(ID);
    setMobile((mobile) => !mobile);
  };

  return (
    <li className={`sidebar-item ${active ? 'active' : ''}`}>
      <Link to={path} onClick={handleStatus} className="sidebar-link">
        <i className={iconClassName} />
        <span className="sidebar-text">{text}</span>
      </Link>
    </li>
  );
};

SidebarItem.propTypes = {
  ID: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
  active: PropTypes.bool.isRequired,
  icon: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  setLink: PropTypes.func.isRequired,
  setMobile: PropTypes.func.isRequired,
};

export default Sidebar;
