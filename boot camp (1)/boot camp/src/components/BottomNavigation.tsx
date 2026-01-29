import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Search, PlusSquare, Bookmark, User } from 'lucide-react';
import { motion } from 'framer-motion';

const navItems = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/explore', icon: Search, label: 'Explore' },
  { path: '/upload', icon: PlusSquare, label: 'Upload', isCenter: true },
  { path: '/saved', icon: Bookmark, label: 'Saved' },
  { path: '/profile', icon: User, label: 'Profile' },
];

const BottomNavigation: React.FC = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass safe-area-bottom">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          if (item.isCenter) {
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className="relative -mt-6"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center shadow-lg shadow-primary/30"
                >
                  <Icon className="w-6 h-6 text-primary-foreground" />
                </motion.div>
              </NavLink>
            );
          }

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className="relative flex flex-col items-center justify-center w-16 h-full"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="flex flex-col items-center"
              >
                <Icon
                  className={`w-6 h-6 transition-colors ${
                    isActive ? 'text-primary' : 'text-muted-foreground'
                  }`}
                />
                <span
                  className={`text-xs mt-1 transition-colors ${
                    isActive ? 'text-primary font-medium' : 'text-muted-foreground'
                  }`}
                >
                  {item.label}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute -bottom-1 w-1 h-1 rounded-full bg-primary"
                  />
                )}
              </motion.div>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation;
