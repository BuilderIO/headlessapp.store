import Link from "next/link";
import ActiveLink from "./ActiveLink";

const Navigation = () => {
  return (
    <nav className="max-w-7xl mx-auto bg-primary p-6 md:p-8">
      <div className="flex flex-wrap items-center text-gray-500">
        <div className="px-6 flex items-center justify-between md:justify-start md:flex-1">
          <nav className="flex items-center md:border-gray-200 md:pl-6 md:ml-6 space-x-3">
            <ActiveLink href="/discover" activeClassName="text-black">
              <a className="px-3 py-1.5 text-sm opacity-75 hover:text-black font-medium hidden md:flex items-center">
                <span>Discover</span>
              </a>
            </ActiveLink>
          </nav>
        </div>
        <Link href="/">
          <a>Headless App Store</a>
        </Link>
        <div className="hidden md:flex md:items-center md:text-right px-6 md:flex-1 justify-end">
          <a
            target="_blank"
            href="mailto:goheadless@builder.io"
            className="px-3 py-1.5 text-sm rounded opacity-75 hover:text-black font-medium inline-flex items-center"
          >
            <span>Request</span>
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
