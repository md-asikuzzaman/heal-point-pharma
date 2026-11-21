"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";
import NavbarSearch from "./NavbarSearch";

const MobileSearch = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Search Toggle */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? "Close search" : "Open search"}
        aria-expanded={isOpen}
        className="
          flex h-9 w-9 items-center justify-center
          rounded-full text-green-500
          transition-colors hover:bg-gray-100
          md:hidden cursor-pointer
        "
      >
        {isOpen ? <X className="h-5 w-5" /> : <Search className="size-6" />}
      </button>

      {/* Expandable Mobile Search */}
      {isOpen && (
        <div
          className="
            absolute left-0 right-0 top-full z-50
            border-t border-gray-100 bg-white
            px-4 py-3 shadow-lg
            md:hidden
          "
        >
          <NavbarSearch />
        </div>
      )}
    </>
  );
};

export default MobileSearch;
