import Link from "next/link";
import ActiveLink from "./ActiveLink";

const Navigation = () => {
  return (
    <nav className="max-w-5xl mx-auto">
      <div className="flex flex-wrap items-center text-gray-500">
        <div className="px-6 flex items-center justify-between md:justify-start w-full md:flex-1">
          <Link href="/">
            <a>{/* TODO: logo */}</a>
          </Link>

          <nav className="flex items-center md:border-gray-200 md:pl-6 md:ml-6 space-x-3">
            <ActiveLink href="/" activeClassName="text-black">
              <a className="px-3 py-1.5 text-sm opacity-75 hover:text-black font-medium hidden md:flex items-center">
                <span>Discover</span>
              </a>
            </ActiveLink>
          </nav>
        </div>
        <div className="hidden md:flex md:items-center md:text-right px-6">
          <ActiveLink href="/" activeClassName="text-black">
            <a className="px-3 py-1.5 text-sm rounded bg-gray-100 opacity-75 hover:text-black font-medium inline-flex items-center">
              <span>Request</span>
            </a>
          </ActiveLink>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
