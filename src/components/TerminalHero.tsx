"use client";

import React, { useState, useEffect, useRef } from "react";
import { Terminal, CornerDownLeft, Circle } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { profile } from "@/data/profile";

interface CommandHistory {
  command: string;
  output: React.ReactNode;
}

export default function TerminalHero() {
  const reducedMotion = useReducedMotion();
  const [input, setInput] = useState("");
  const terminalStreamRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const welcomeMessage = (
    <div className="space-y-1 text-slate-200">
      <p className="text-emerald-400 font-bold font-heading text-lg md:text-xl">
        &gt; INITIALIZING BAYU_ERICH_SHELL v1.4.8_STABLE
      </p>
      <p className="text-slate-400 text-xs md:text-sm">
        Type <span className="text-emerald-400 font-mono">help</span> to view available commands. Click suggestions to execute them.
      </p>
      <div className="flex flex-wrap gap-2 pt-2">
        {["help", "about", "work", "stack", "projects", "contact", "clear"].map((cmd) => (
          <button
            key={cmd}
            onClick={() => handleCommandRun(cmd)}
            className="px-2 py-0.5 bg-slate-800 hover:bg-emerald-500/20 border border-slate-700 hover:border-emerald-500/50 text-slate-200 hover:text-emerald-400 text-xs font-mono rounded cursor-pointer transition-all duration-200"
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
        behavior: reducedMotion ? "instant" : "smooth",
      });
    }
  }, [history, reducedMotion]);

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
          <div className="space-y-1 text-slate-200 font-mono text-sm">
            <p className="text-emerald-400 font-bold mb-1">Available Commands:</p>
            <p><span className="text-emerald-300 font-semibold min-w-[100px] inline-block">about</span>- Who is {profile.shortName}?</p>
            <p><span className="text-emerald-300 font-semibold min-w-[100px] inline-block">work</span>- Past experience</p>
            <p><span className="text-emerald-300 font-semibold min-w-[100px] inline-block">stack</span>- Tools and technologies</p>
            <p><span className="text-emerald-300 font-semibold min-w-[100px] inline-block">projects</span>- Highlighted public repositories</p>
            <p><span className="text-emerald-300 font-semibold min-w-[100px] inline-block">contact</span>- Reach out</p>
            <p><span className="text-emerald-300 font-semibold min-w-[100px] inline-block">clear</span>- Clear terminal log screen</p>
          </div>
        );
        break;

      case "about":
        output = (
          <div className="space-y-2 text-slate-200 text-sm leading-relaxed">
            <p>
              {profile.name} — {profile.role}, {profile.location}.
            </p>
            <p>{profile.tagline}</p>
          </div>
        );
        break;
        
      case "work":
      case "experience":
        output = (
          <div className="space-y-1 text-slate-200 text-sm leading-relaxed">
            {profile.experience.map((job) => (
              <p key={job.company}>
                {job.role} at {job.company} <span className="text-slate-400">({job.period})</span>
              </p>
            ))}
          </div>
        );
        break;

      case "stack":
      case "skills": {
        const groups: [string, string[]][] = [
          ["Languages", profile.skills.languages],
          ["Backend", profile.skills.backend],
          ["Databases", profile.skills.database],
          ["Cloud", profile.skills.cloud],
          ["DevOps", profile.skills.devops],
        ];
        output = (
          <div className="space-y-1 text-slate-200 text-sm leading-relaxed">
            {groups.map(([label, items]) => (
              <p key={label}>
                <span className="text-emerald-400 font-mono">{label}: </span>
                {items.join(", ")}.
              </p>
            ))}
          </div>
        );
        break;
      }

      case "projects":
        output = (
          <div className="space-y-1 text-slate-200 text-sm leading-relaxed">
            <p>
              Featured: {profile.featuredProjects.join(", ")}.
            </p>
            <p className="text-slate-400 text-xs mt-2 italic">Scroll up to the <a href="#projects" className="text-emerald-400 not-italic underline">visual card grids</a> for more details.</p>
          </div>
        );
        break;

      case "contact":
        output = (
          <div className="space-y-1 text-slate-200 text-sm leading-relaxed">
            <p>Available for backend engineering opportunities and collaboration.</p>
            <p>
              Email: <span className="text-emerald-400">{profile.email}</span>
            </p>
            <p>
              GitHub: <span className="text-emerald-400">github.com/{profile.github}</span>
            </p>
            <p>
              LinkedIn: <span className="text-emerald-400">{profile.linkedin}</span>
            </p>
          </div>
        );
        break;

      case "clear":
        setHistory([{ command: "system_init", output: welcomeMessage }]);
        setInput("");
        return;

      case "secret":
        output = (
          <div className="p-3 bg-emerald-950/30 border border-emerald-500/30 rounded text-emerald-400 font-mono text-xs md:text-sm">
            <p className="font-bold">secret unlocked: commit, push, touch grass.</p>
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
          <span>{profile.github}@shell:~</span>
        </div>
        <div className="w-12"></div> {/* Spacing spacer */}
      </div>

      {/* Terminal Output Stream */}
      <div
        ref={terminalStreamRef}
        onClick={focusInput}
        className="h-64 md:h-80 p-4 bg-slate-950/80 font-mono text-sm md:text-base overflow-y-auto cursor-text select-text"
      >
        <div className="space-y-4">
          {history.map((item, idx) => (
            <div key={idx} className="space-y-2">
              {item.command !== "system_init" && (
                <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                  <span className="text-slate-500">visitor@{profile.github}:~$</span>
                  <span>{item.command}</span>
                </div>
              )}
              <motion.div
                // The welcome message must render identically before hydration.
                // Command responses are added only after user interaction.
                initial={item.command === "system_init" || reducedMotion ? false : { opacity: 0, y: 5 }}
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
        className="flex items-center gap-2 px-4 py-3 bg-slate-950/95 border-t border-slate-900 font-mono text-sm md:text-base text-emerald-400 cursor-text"
      >
        <span className="text-slate-500 font-bold shrink-0 select-none">visitor@{profile.github}:~$</span>
        <input
          ref={inputRef}
          type="text"
          aria-label="Terminal command"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="terminal-input min-w-0 flex-1 bg-transparent border-none outline-none focus:ring-0 focus:outline-none text-slate-200 caret-emerald-400 font-mono placeholder-slate-700"
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
