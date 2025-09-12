"use client";

import AddSchoolButton from "@/features/school/components/button/AddSchoolButton";
import LogoButton from "../buttons/LogoButton";
import { UserButton } from "../buttons/UserButton";
import SearchInput from "../inputs/SearchInput";

export default function Navbar() {
  return (
    <nav className="border-b backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <LogoButton />

            <div className="hidden md:flex items-center space-x-6">
              <SearchInput />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <AddSchoolButton />
            <UserButton />
          </div>
        </div>
      </div>
    </nav>
  );
}
