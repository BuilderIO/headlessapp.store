import Link from "next/link";
import ActiveLink from "./ActiveLink";

const NAME = "JSX Lite Gallery"; // 'JSX Lite Gallery'
const SHOW_DISCOVER_LINK = false;

const Navigation = () => {
  return (
    <nav className="mx-auto bg-primary p-4 full-width">
      <div className="flex flex-wrap items-center text-white container mx-auto">
        <div className="px-6 flex items-center justify-between md:justify-start md:flex-1">
          <nav className="flex items-center md:border-gray-200 md:pl-6 md:ml-6 space-x-3">
            {SHOW_DISCOVER_LINK && (
              <ActiveLink href="/discover" activeClassName="text-black">
                <a className="px-3 py-1.5 text-sm opacity-75 hover:text-black font-medium hidden md:flex items-center">
                  <span>Discover</span>
                </a>
              </ActiveLink>
            )}
          </nav>
        </div>
        <Link href="/">
          <a className="text-xl">{NAME}</a>
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
