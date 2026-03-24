import { Outlet } from 'react-router-dom';

const PublicLayout = () => {
  return (
    <div className="App">
      <Outlet />
    </div>
  );
};

export default PublicLayout;