"use client";

import { useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const links = [
  ["Work", "projects"],
  ["Experience", "experience"],
  ["Toolkit", "skills"],
  ["Activity", "activity"],
  ["About", "about"],
  ["Contact", "contact"],
];

export default function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="header-inner">
        <a className="wordmark" href="#hero" aria-label="Bayu Erich home">
          bayue<span>.</span>
        </a>
        <nav className="desktop-nav" aria-label="Main navigation">
          {links.map(([label, id]) => <a key={id} href={`#${id}`}>{label}</a>)}
        </nav>
        <div className="header-actions">
          <ThemeToggle />
          <a className="header-cv" href="/cv-bayu-erich.pdf" target="_blank" rel="noopener noreferrer">
            Get my CV <ArrowUpRight size={16} />
          </a>
          <button
            type="button"
            className="menu-button"
            aria-label={open ? "Close navigation" : "Open navigation"}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen(!open)}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>
      {open && (
        <nav className="mobile-nav" id="mobile-nav" aria-label="Mobile navigation">
          {links.map(([label, id]) => (
            <a key={id} href={`#${id}`} onClick={() => setOpen(false)}>
              {label}<ArrowUpRight size={16} />
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
