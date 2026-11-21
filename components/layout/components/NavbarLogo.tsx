import SafeImage from "@/components/shared/SafeImages";
import Link from "next/link";

const NavbarLogo = () => {
  return (
    <Link href="/" className="block">
      <SafeImage
        src="/images/logo.png"
        alt="Heal point"
        width={80}
        height={80}
        className="rounded-full object-cover shadow-2xl border-2 border-green-500 size-10  md:size-14"
        sizes="(max-width: 768px) 48px, (max-width: 1024px) 64px, 80px"
        priority
      />
    </Link>
  );
};

export default NavbarLogo;
