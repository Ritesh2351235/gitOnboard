'use client';

export const Navbar = () => {
  return (
    <nav className="fixed right-3 top-3 z-[0] flex w-[calc(100vw_-_6%)] flex-row items-center justify-between rounded-lg bg-transparent py-2 backdrop-blur-xl transition-all md:right-[30px] md:top-4 md:w-[calc(100vw_-_8%)] md:p-2 lg:w-[calc(100vw_-_6%)] xl:top-[20px] xl:w-[calc(100vw_-_365px)] 2xl:w-[calc(100vw_-_380px)]">
      <div className="ml-[6px]">
        <div className="h-6 md:mb-2 md:w-[224px] md:pt-1">
          <a
            className="hidden text-xs font-normal text-white hover:underline md:inline"
            href="/dashboard"
          >
            Dashboard
            <span className="mx-1 text-xs text-white">
              {' '}
              /{' '}
            </span>
          </a>
          <a
            className="text-xs font-normal capitalize text-white hover:underline"
            href="/home"
          >
            Home
          </a>
        </div>
        <p className="text-md shrink capitalize text-white md:text-3xl">
          <a
            href="/dashboard"
            className="font-bold capitalize text-white hover:text-gray-200"
          >
            Dashboard
          </a>
        </p>
      </div>
      <div className="w-[154px] min-w-max md:ml-auto md:w-[unset]">
        <div className="flex items-center gap-4">
          <a href="/profile" className="text-white hover:text-gray-200">
            Profile
          </a>
          <a href="/settings" className="text-white hover:text-gray-200">
            Settings
          </a>
          <a href="/logout" className="text-white hover:text-gray-200">
            Logout
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;