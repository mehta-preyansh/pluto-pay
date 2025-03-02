"use client";

import { sidebarLinks } from "@/constants";
import { cn } from "@/lib/utils";
import  Link  from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import React from "react";
import Footer from "./Footer";
import PlaidLink from "./PlaidLink";

const Sidebar = ({ user }: SiderbarProps) => {
  const pathname = usePathname();
  return (
    <section className="sidebar">
      <nav className="flex flex-col gap-4">
        <Link href="/" className="mb-12 flex cursor-pointer items-center gap-2">
          <Image
            src="/icons/logo.svg"
            width={34}
            height={34}
            alt="Pluto Pay logo"
            className="size-[24px] max-xl:size-14"
          />
          <h1 className="sidebar-logo">Pluto Pay</h1>
        </Link>
        {sidebarLinks.map((link, index) => {
          const isActive =
            link.route === pathname || pathname.startsWith(`${link.route}/`);
          return (
            <Link
              className={cn("sidebar-link", { "bg-bank-gradient": isActive })}
              href={link.route}
              key={link.label}
            >
              <div className="relative size-6">
                <Image src={link.imgURL} alt={link.label}
                fill
                className={cn({"brightness-[3] invert-0" : isActive})}>
                </Image>
              </div>
                <p className={cn("sidebar-label", {
                  "!text-white": isActive,
                })}>
                  {link.label}
                </p>
            </Link>
          );
        })}
        <PlaidLink user={user}/>
      </nav>
      <Footer user={user} />
    </section>
  );
};

export default Sidebar;
