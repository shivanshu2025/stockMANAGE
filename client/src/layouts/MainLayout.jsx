import { Outlet } from 'react-router-dom';
import Header from '../components/Header';

const MainLayout = () => (
  <div className="flex min-h-screen flex-col">
    <Header />
    <main className="flex-1 pb-24 md:pb-0">
      <Outlet />
    </main>
  </div>
);

export default MainLayout;
