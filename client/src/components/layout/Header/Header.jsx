import { useState } from "react";
import { NavLink } from "react-router-dom";
import Logo from "../../common/Logo/Logo";
import ApplyNow from "../../ApplyNow";
import { Menu } from "lucide-react";

const navigationItems = [
  { title: "الرئيسية", path: "/" },
  { title: "المعرض", path: "/gallery" },
  { title: "من نحن", path: "/about" },
  { title: "آراء العملاء", path: "/testimonials" },
];

export default function Header() {
  const [isMenuMobileOpen, setIsMenuMobileOpen] = useState(false);

  const handleToggleMenu = () => {
    setIsMenuMobileOpen(!isMenuMobileOpen);
  };

  return (
    <>
      <header className="bg-white shadow-md sticky top-0 z-50" dir="rtl">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Logo />
          <nav className="hidden md:flex items-center space-x-6">
            {navigationItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className="text-gray-600 hover:text-purple"
              >
                {item.title}
              </NavLink>
            ))}
          </nav>
          <ApplyNow />
          <Menu className="md:hidden" onClick={handleToggleMenu} />
        </div>
        {isMenuMobileOpen && (
          <nav className="md:hidden bg-white px-4 pb-4">
            {navigationItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className="block py-2 text-gray-600 hover:text-purple"
                onClick={handleToggleMenu}
              >
                {item.title}
              </NavLink>
            ))}
          </nav>
        )}
      </header>
    </>
  );
}
