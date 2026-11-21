import { auth } from "@/lib/auth";

import NavbarCartButtonWrapper from "./components/NavbarCartButtonWrapper";
import NavbarLinks from "./components/NavbarLinks";
import NavbarLogo from "./components/NavbarLogo";
import NavbarMobileMenu from "./components/NavbarMobileMenu";
import NavbarProfileDropdown from "./components/NavbarProfileDropdown";
import NavbarSearch from "./components/NavbarSearch";
import MobileSearch from "./components/MobileSearch";

const Header = async () => {
  const session = await auth();

  return (
    <header className="sticky top-0 z-50 w-full bg-white shadow-md">
      <nav className="relative flex items-center justify-between gap-3 px-3 py-3 sm:px-4 md:px-6">
        {/* Left: Logo + Links */}
        <div className="flex shrink-0 items-center gap-3 md:gap-8 lg:gap-14">
          <NavbarLogo />

          <div className="hidden md:block">
            <NavbarLinks />
          </div>
        </div>

        {/* Right: Search, Cart, Profile, Mobile Menu */}
        <div className="flex min-w-0 flex-1 items-center justify-end gap-2 sm:gap-3">
          {/* Desktop Search */}
          <div className="hidden max-w-[400px] flex-1 md:block">
            <NavbarSearch />
          </div>

          {/* Mobile Search */}
          <MobileSearch />

          <NavbarCartButtonWrapper />

          <NavbarProfileDropdown session={session} />

          <div className="flex items-center md:hidden">
            <NavbarMobileMenu />
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
