
const Header = () => {
  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : {};


  return (
    <header className="bg-white shadow-sm p-4 flex justify-between items-center fixed top-0 z-10 w-full">
      <div>
        <h1 className="text-xl font-semibold text-gray-800 text-end w-screen md:text-start md:w-auto pr-10">
          Welcome, {user.name || 'User'}
        </h1>
      </div>
    </header>
  );
};

export default Header;