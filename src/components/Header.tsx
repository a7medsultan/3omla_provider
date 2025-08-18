import { Bell, Lock, Menu, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

// Define the props for the component
interface HeaderProps {
  title: string
}


const Header: React.FC<HeaderProps> = ({
  title,
}) => {
  

  return (
    <header className="bg-gray-800 p-4 shadow-md">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-xl font-bold text-yellow-500">{title}</h1>
        </div>
        <div className="flex space-x-3">
          <button className="p-2 rounded-full text-gray-400 hover:text-yellow-500">
            <Bell size={20} />
          </button>
          <button className="p-2 rounded-full text-gray-400 hover:text-yellow-500">
          <Link to="/settings" ><Settings size={20} /></Link>
          </button>
          <button className="p-2 rounded-full text-gray-400 hover:text-yellow-500">
            <Link to="/signin" ><Lock size={20} /></Link>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
