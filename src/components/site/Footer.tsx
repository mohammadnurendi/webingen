import { Link } from "@tanstack/react-router";
import { Mail, Phone, MapPin, Instagram, Youtube, MessageCircle } from "lucide-react";
import logo from "@/assets/logo-mark-putih.png";

export function Footer() {
  return (
    <footer className="bg-navy text-navy-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:grid-cols-2 sm:px-6 sm:py-14 md:grid-cols-4">
        <div className="md:col-span-1">
          <img src={logo} alt="Ingenious Generation" className="h-12 w-auto" />
          <p className="mt-4 max-w-xs text-sm text-white/70">
            Dari angkatan, menjadi ruang untuk bergerak, bertumbuh, dan memberi manfaat bersama.
          </p>
        </div>
        <div>
          <p className="mb-4 text-xs font-bold tracking-widest text-lime">NAVIGASI</p>
          <ul className="space-y-2 text-sm text-white/80">
            <li><Link to="/" className="hover:text-lime">Home</Link></li>
            <li><Link to="/activity" className="hover:text-lime">Activity</Link></li>
            <li><Link to="/community" className="hover:text-lime">Community</Link></li>
            <li><Link to="/moments" className="hover:text-lime">Moments</Link></li>
            <li><Link to="/join" className="hover:text-lime">Join</Link></li>
          </ul>
        </div>
        <div>
          <p className="mb-4 text-xs font-bold tracking-widest text-lime">KONTAK</p>
          <ul className="space-y-3 text-sm text-white/80">
            <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-lime" /><span>hello@ingenious.id</span></li>
            <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-lime" /><span>+62 812-3456-7890</span></li>
            <li className="flex items-center gap-2"><MapPin className="h-4 w-4 text-lime" /><span>Jakarta, Indonesia</span></li>
          </ul>
        </div>
        <div>
          <p className="mb-4 text-xs font-bold tracking-widest text-lime">FOLLOW US</p>
          <div className="flex gap-3">
            {[Instagram, MessageCircle, Youtube].map((Icon, i) => (
              <a key={i} href="#" className="grid h-10 w-10 place-items-center rounded-full border border-white/20 text-white/80 transition hover:border-lime hover:text-lime">
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-6 py-5 text-xs text-white/60 md:flex-row">
          <p>© 2026 Ingenious Community. All rights reserved.</p>
          <div className="flex gap-5">
            <a href="#" className="hover:text-lime">Privacy Policy</a>
            <a href="#" className="hover:text-lime">Terms of Use</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
