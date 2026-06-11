"use client";

import React, { useState, useEffect, useRef } from "react";
import { Terminal, CornerDownLeft, Circle } from "lucide-react";
import { motion } from "framer-motion";

interface CommandHistory {
  command: string;
  output: React.ReactNode;
}

export default function TerminalHero() {
  const [input, setInput] = useState("");
  const terminalStreamRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const welcomeMessage = (
    <div className="space-y-1 text-slate-300">
      <p className="text-emerald-400 font-bold font-heading text-lg md:text-xl">
        &gt; INITIALIZING BAYU_ERICH_SHELL v1.4.8_STABLE
      </p>
      <p className="text-slate-400 text-xs md:text-sm">
        Type <span className="text-emerald-400 font-mono">help</span> to view available commands. Click suggestions to execute them.
      </p>
      <div className="flex flex-wrap gap-2 pt-2">
        {["help", "about", "projects", "skills", "secret"].map((cmd) => (
          <button
            key={cmd}
            onClick={() => handleCommandRun(cmd)}
            className="px-2 py-0.5 bg-slate-800 hover:bg-emerald-500/20 border border-slate-700 hover:border-emerald-500/50 text-slate-300 hover:text-emerald-400 text-xs font-mono rounded cursor-pointer transition-all duration-200"
          >
            {cmd}
          </button>
        ))}
      </div>
    </div>
  );

  const [history, setHistory] = useState<CommandHistory[]>(() => [
    { command: "system_init", output: welcomeMessage },
  ]);

  useEffect(() => {
    if (terminalStreamRef.current) {
      terminalStreamRef.current.scrollTo({
        top: terminalStreamRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [history]);

  const focusInput = () => {
    inputRef.current?.focus();
  };

  const handleCommandRun = (cmdStr: string) => {
    const trimmed = cmdStr.trim().toLowerCase();
    if (!trimmed) return;

    let output: React.ReactNode = null;

    switch (trimmed) {
      case "help":
        output = (
          <div className="space-y-1 text-slate-300 font-mono text-sm">
            <p className="text-emerald-400 font-bold mb-1">Available Commands:</p>
            <p><span className="text-emerald-300 font-semibold min-w-[100px] inline-block">about</span>- Who is Bayu Erich?</p>
            <p><span className="text-emerald-300 font-semibold min-w-[100px] inline-block">projects</span>- Highlighted public repositories & stats</p>
            <p><span className="text-emerald-300 font-semibold min-w-[100px] inline-block">skills</span>- Technical stack & capabilities</p>
            <p><span className="text-emerald-300 font-semibold min-w-[100px] inline-block">activity</span>- Recent Git contributions overview</p>
            <p><span className="text-emerald-300 font-semibold min-w-[100px] inline-block">clear</span>- Clear terminal log screen</p>
            <p><span className="text-emerald-300 font-semibold min-w-[100px] inline-block">secret</span>- Reveal profile easter egg</p>
          </div>
        );
        break;

      case "about":
        output = (
          <div className="space-y-2 text-slate-300 text-sm leading-relaxed">
            <p className="text-emerald-400 font-bold">Biography:</p>
            <p>
              I am a **Bandung-based developer** who builds web systems, scrapers, and automation scripts.
              My bio is <span className="italic text-emerald-300">{'"pull stuck overflow dev"'}</span> — reflecting a relentless drive to solve tricky bugs, piece complex APIs together, and ship clean projects.
            </p>
            <p>
              Currently focus: Frontend visualizations (Next.js/React/TypeScript), scalable scrapers (Python), and Discord automation microservices.
            </p>
          </div>
        );
        break;

      case "projects":
        output = (
          <div className="space-y-2 text-slate-300 text-sm font-mono">
            <p className="text-emerald-400 font-bold">Featured Projects:</p>
            <div className="space-y-2 border-l border-slate-700 pl-3 ml-1">
              <div>
                <p className="text-emerald-300 font-bold">1. gitSdm</p>
                <p className="text-slate-400">AI-powered repository visualizer & graph analyzer. Stack: TS / Next.js</p>
              </div>
              <div>
                <p className="text-emerald-300 font-bold">2. keking</p>
                <p className="text-slate-400">Advanced Discord music player bot reboot with custom styled Embed overlays.</p>
              </div>
              <div>
                <p className="text-emerald-300 font-bold">3. pia-scrap</p>
                <p className="text-slate-400">Python-based scrap tool exporting Web Novels to clean, custom EPUB structures.</p>
              </div>
              <div>
                <p className="text-emerald-300 font-bold">4. xfa</p>
                <p className="text-slate-400">Specialized Node.js preview corrector for social shares (Discord, FB link cards).</p>
              </div>
            </div>
            <p className="text-slate-400 text-xs mt-2 italic">Scroll down to see the visual card grids for more details.</p>
          </div>
        );
        break;

      case "skills":
        output = (
          <div className="space-y-2 text-slate-300 text-sm font-mono">
            <p className="text-emerald-400 font-bold">Technical Skill Tree:</p>
            <p><span className="text-emerald-300">Languages:</span> JavaScript (ES6+), TypeScript, Python, Go, HTML, CSS</p>
            <p><span className="text-emerald-300">Frameworks:</span> Next.js 15, React, Node.js (Express), Tailwind CSS</p>
            <p><span className="text-emerald-300">Tools & Libs:</span> Framer Motion, Discord.js, BeautifulSoup4, Git/GitHub</p>
          </div>
        );
        break;

      case "activity":
        output = (
          <div className="space-y-1 text-slate-300 text-sm font-mono">
            <p className="text-emerald-400 font-bold">Git Activity Summary:</p>
            <p>• Pushed updates to <span className="text-emerald-300">bayue48/keking</span> (June 2026)</p>
            <p>• Pushed updates to <span className="text-emerald-300">bayue48/xrd</span> (June 2026)</p>
            <p>• Created and launched <span className="text-emerald-300">bayue48/xfa</span> server (May 2026)</p>
            <p>• Active contributions in repository analysis dashboards.</p>
          </div>
        );
        break;

      case "clear":
        setHistory([]);
        setInput("");
        return;

      case "secret":
        output = (
          <div className="p-3 bg-emerald-950/30 border border-emerald-500/30 rounded text-emerald-400 font-mono text-xs md:text-sm">
            <p className="font-bold mb-1">🎉 SUCCESS: Easter Egg Unlocked!</p>
            <p className="text-slate-300 italic mb-2">{'"pull stuck, copy-pasta overflow dev"'}</p>
            <p className="text-slate-400 text-xs">
              Meaning: Even when git pulls get stuck, Stack Overflow tabs pile up, and copy-paste almost works, a developer keeps coding, debugging, adapting and resolving issues with persistence.
            </p>
          </div>
        );
        break;

      default:
        output = (
          <p className="text-red-400 font-mono text-sm">
            Command not recognized: <span className="font-bold underline">{trimmed}</span>. Type <span className="text-emerald-400">help</span> to view available list.
          </p>
        );
    }

    setHistory((prev) => [...prev, { command: cmdStr, output }]);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleCommandRun(input);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-1 rounded-xl glass shadow-terminal border border-slate-700/60 overflow-hidden">
      {/* Top Window Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800 rounded-t-lg select-none">
        <div className="flex gap-2">
          <Circle className="w-3.5 h-3.5 fill-red-500 text-red-500 opacity-80" />
          <Circle className="w-3.5 h-3.5 fill-amber-500 text-amber-500 opacity-80" />
          <Circle className="w-3.5 h-3.5 fill-emerald-500 text-emerald-500 opacity-80" />
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
          <Terminal className="w-3.5 h-3.5 text-emerald-500" />
          <span>bayue48@shell:~</span>
        </div>
        <div className="w-12"></div> {/* Spacing spacer */}
      </div>

      {/* Terminal Output Stream */}
      <div
        ref={terminalStreamRef}
        onClick={focusInput}
        className="h-80 md:h-[26rem] p-4 bg-slate-950/80 font-mono text-sm overflow-y-auto cursor-text select-text"
      >
        <div className="space-y-4">
          {history.map((item, idx) => (
            <div key={idx} className="space-y-2">
              {item.command !== "system_init" && (
                <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                  <span className="text-slate-500">visitor@bayue48:~$</span>
                  <span>{item.command}</span>
                </div>
              )}
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="pl-2 border-l-2 border-slate-800/40"
              >
                {item.output}
              </motion.div>
            </div>
          ))}
        </div>
      </div>

      {/* Terminal Input Line */}
      <div
        onClick={focusInput}
        className="flex items-center gap-2 px-4 py-3 bg-slate-950/95 border-t border-slate-900 font-mono text-sm text-emerald-400 cursor-text"
      >
        <span className="text-slate-500 font-bold shrink-0 select-none">visitor@bayue48:~$</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent border-none outline-none focus:ring-0 text-slate-200 caret-emerald-400 font-mono placeholder-slate-700"
          placeholder="type command here..."
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
        />
        <div className="flex items-center gap-1 text-xs text-slate-500 select-none shrink-0">
          <span>Enter</span>
          <CornerDownLeft className="w-3 h-3" />
        </div>
      </div>
    </div>
  );
}
