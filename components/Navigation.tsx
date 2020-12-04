import Link from "next/link";

import ActiveLink from "./ActiveLink";
import * as GridSVG from "../svg/grid.svg";

const Navigation = () => {
  const BrowseSVG = GridSVG;

  return (
    <nav className="max-w-5xl mx-auto">
      <div className="flex flex-wrap items-center text-gray-500">
        <div className="px-6 flex items-center justify-between md:justify-start w-full md:flex-1">
          <Link href="/">
            <a>
              {/* <LogoSVG className="h-6 md:h-8 fill-current text-black opacity-75 hover:opacity-100" /> */}
            </a>
          </Link>

          <nav className="flex items-center md:border-gray-200 md:pl-6 md:ml-6 space-x-3">
            <ActiveLink href="/" activeClassName="text-black">
              <a className="px-3 py-1.5 text-sm opacity-75 hover:text-black font-medium hidden md:flex items-center">
                <BrowseSVG className="w-5 h-5 fill-current mr-1.5" />
                <span>Discover</span>
              </a>
            </ActiveLink>
          </nav>
        </div>
        <div className="hidden md:flex md:items-center md:text-right px-6">
          <ActiveLink href="/request" activeClassName="text-black">
            <a className="px-3 py-1.5 text-sm rounded bg-gray-100 opacity-75 hover:text-black font-medium inline-flex items-center">
              <svg
                className="w-5 h-5 fill-current mr-1.5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path fill="none" d="M0 0h24v24H0z" />
                <path d="M14 3v2H4v13.385L5.763 17H20v-7h2v8a1 1 0 0 1-1 1H6.455L2 22.5V4a1 1 0 0 1 1-1h11zm5 0V0h2v3h3v2h-3v3h-2V5h-3V3h3z" />
              </svg>
              <span>Request</span>
            </a>
          </ActiveLink>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
