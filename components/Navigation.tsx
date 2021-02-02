import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import ActiveLink from "./ActiveLink";

// Turn on when launched. Until then users can't easily find and navigate the list
// of integrations
const SHOW_DISCOVER_LINK = false;

const Navigation = () => {
  const router = useRouter();
  return (
    <nav className="mx-auto p-4 full-width bg-gradient-to-br from-dark to-primary">
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
          <a
            className="text-xl"
            onClick={(e) => {
              if (location.hostname === "localhost") {
                e.preventDefault();
                router.push("/discover");
              }
            }}
          >
            <Image
              className="object-contain object-center"
              width="332"
              height="44"
              src="https://cdn.builder.io/api/v1/image/assets%2FYJIGb4i01jvw0SRdL5Bt%2F911817f943d34d9e8d6c08b0769a4a23"
            />
          </a>
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
