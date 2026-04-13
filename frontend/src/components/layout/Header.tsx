"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FaSearch } from "react-icons/fa";

type Category = {
  _id: string;
  name: string;
  slug: string;
  children?: Category[];
};

type SettingWebsiteInfo = {
  websiteName?: string;
  phone?: string;
  email?: string;
  address?: string;
  logo?: string;
  favicon?: string;
};

export const Header = () => {
  const [openMenu, setOpenMenu] = useState<boolean>(false);
  const [activeSub, setActiveSub] = useState<string | null>(null);
  const [settingWebsiteInfo, setSettingWebsiteInfo] = useState<SettingWebsiteInfo | null>(null);
  const [categoryList, setCategoryList] = useState<Category[]>([]);

  useEffect(() => {
    const fetchHeaderData = async () => {
      try {
        const res = await fetch("http://localhost:5000/dashboard/info", {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();

        if (data.code === "success") {
          setSettingWebsiteInfo(data.settingWebsiteInfo || null);
          setCategoryList(data.categoryList || []);
        }
      } catch (error) {
        console.error("Fetch header data error", error);
      }
    };

    fetchHeaderData();
  }, []);
  return (
    <>
      <header className="fixed top-0 w-full z-50 bg-surface/80 dark:bg-slate-900/80 backdrop-blur-xl no-border bg-gradient-to-b from-white/10 to-transparent">
        <nav className="flex justify-between items-center h-20 px-8 max-w-7xl mx-auto">
          <div className="text-2xl font-extrabold tracking-tighter text-slate-900 dark:text-white font-headline">TravelKa</div>
          <div className="hidden md:flex items-center space-x-8 font-headline text-sm font-semibold tracking-tight">
            <a className="text-lime-600 dark:text-lime-400 border-b-2 border-lime-500 pb-1" href="#">
              Home
            </a>
            <a className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors" href="#">
              Tours
            </a>
            <a className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors" href="#">
              Combos
            </a>
            <a className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors" href="#">
              Gear
            </a>
            <a className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors" href="#">
              Journal
            </a>
          </div>
          <div className="flex items-center gap-4">
            <FaSearch className="text-on-surface-variant hover:opacity-80 transition-all">search</FaSearch>
            <button className="primary-gradient-btn text-on-primary font-bold px-6 py-2 rounded-full scale-105 active:scale-95 transition-transform">Sign In</button>
          </div>
        </nav>
      </header>
    </>
  );
};
