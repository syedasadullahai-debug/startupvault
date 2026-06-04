import Navbar from './Navbar';

const AppLayout = ({ children }) => (
  <div className="page-bg min-h-screen">
    <div className="grain" />
    <Navbar />
    <main className="pt-20 px-4 pb-12 max-w-7xl mx-auto">
      {children}
    </main>
  </div>
);

export default AppLayout;
