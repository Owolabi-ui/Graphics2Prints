import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faCog, faUser } from '@fortawesome/free-solid-svg-icons';


const Sidebar = () => {
  return (
    <aside className="bg-secondary text-secondary-foreground w-64 min-h-screen p-4">
      <nav>
        <ul className="space-y-2">
          <li>
            <a href="#" className="flex items-center space-x-2 p-2 rounded-lg hover:bg-primary/10">
              <FontAwesomeIcon icon={faHome} size="lg" />
              <span>Home</span>
            </a>
          </li>
          <li>
            <a href="#" className="flex items-center space-x-2 p-2 rounded-lg hover:bg-primary/10">
              <FontAwesomeIcon icon={faCog} size="lg" />
              <span>Settings</span>
            </a>
          </li>
          <li>
            <a href="#" className="flex items-center space-x-2 p-2 rounded-lg hover:bg-primary/10">
              <FontAwesomeIcon icon={faUser} size="lg" />
              <span>Profile</span>
            </a>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;