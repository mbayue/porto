"use client";

import React, { useState } from "react";
import { Terminal, Send, CheckCircle2 } from "lucide-react";

export default function ContactConsole() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [logs, setLogs] = useState<string[]>([]);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const appendLogs = async (lines: string[], delayMs = 600) => {
    for (const line of lines) {
      setLogs((prev) => [...prev, line]);
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !message) return;

    setStatus("sending");
    setLogs([]);

    const recipient = "bayu.erich@gmail.com";
    const subject = encodeURIComponent(`Portfolio contact from ${email}`);
    const body = encodeURIComponent(`Sender: ${email}\n\n${message}`);
    const mailtoUrl = `mailto:${recipient}?subject=${subject}&body=${body}`;

    const initialLogs = [
      `$ ping -c 3 me.gsdm.site`,
      `PING me.gsdm.site (172.67.142.155) 56(84) bytes of data.`,
      `64 bytes from 172.67.142.155: icmp_seq=1 ttl=57 time=21.4 ms`,
      `64 bytes from 172.67.142.155: icmp_seq=2 ttl=57 time=19.8 ms`,
      `64 bytes from 172.67.142.155: icmp_seq=3 ttl=57 time=20.2 ms`,
      `--- me.gsdm.site ping statistics ---`,
      `3 packets transmitted, 3 received, 0% packet loss, time 2003ms`,
      `$ ssh-send --sender="${email}" --payload="..."`,
      `Establishing SSL handshake with mail-broker...`,
      `Broker handshake: TLS_AES_256_GCM_SHA384 (256-bit encryption)`,
      `$ compose-mail --to="${recipient}" --sender="${email}"`,
      `Preparing local mail client handoff...`,
      `Uploading message payload packet (size: ${message.length} bytes)...`,
      `Database buffer insertion: OK`,
      `Opening default email client for manual review and send.`,
    ];

    await appendLogs(initialLogs, 250);
    window.location.href = mailtoUrl;
    setStatus("success");
    setEmail("");
    setMessage("");
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-1 rounded-xl glass border border-slate-800/80 shadow-lg overflow-hidden">
      {/* Console Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-850">
        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
          <Terminal className="w-4 h-4 text-emerald-500" />
          <span>secure-transmission-agent@mbayue</span>
        </div>
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-slate-800" />
          <span className="w-2.5 h-2.5 rounded-full bg-slate-800" />
          <span className="w-2.5 h-2.5 rounded-full bg-slate-800" />
        </div>
      </div>

      {status !== "success" ? (
        <form onSubmit={handleSend} className="p-5 space-y-4 font-mono text-sm bg-slate-950/60">
          <div className="space-y-1">
            <label className="text-[10px] text-slate-500 uppercase tracking-wider block">
              Sender Address (Email)
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={status === "sending"}
              placeholder="visitor@domain.com"
              className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500/50 outline-none p-3 rounded text-slate-200 placeholder-slate-700 font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-slate-500 uppercase tracking-wider block">
              Payload Content (Message)
            </label>
            <textarea
              required
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={status === "sending"}
              placeholder="Enter message details here..."
              className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500/50 outline-none p-3 rounded text-slate-200 placeholder-slate-700 font-mono resize-none"
            />
          </div>

          {status === "sending" && (
            <div className="p-3 bg-slate-950 border border-slate-850 rounded font-mono text-xs text-slate-400 space-y-1 max-h-40 overflow-y-auto select-none">
              {logs.map((log, idx) => (
                <div key={idx} className={log.startsWith("$") ? "text-emerald-400 font-bold" : ""}>
                  {log}
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={status === "sending"}
              className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold rounded-lg cursor-pointer transition-all duration-200 disabled:bg-slate-800 disabled:text-slate-500 shadow-md hover:shadow-emerald-500/20"
            >
              <span>Transmit Packet</span>
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      ) : (
        <div className="p-8 text-center bg-slate-950/60 font-mono space-y-4">
          <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-pulse" />
          <div className="space-y-1">
            <h4 className="text-slate-100 font-bold text-base">TRANSMISSION COMPLETED</h4>
            <p className="text-slate-400 text-xs">Your email client has opened with the message draft.</p>
          </div>

          <div className="text-left p-3 bg-slate-950 border border-slate-850 rounded text-xs text-slate-400 max-h-40 overflow-y-auto">
            {logs.map((log, idx) => (
              <div key={idx} className={log.startsWith("$") ? "text-emerald-400 font-bold" : ""}>
                {log}
              </div>
            ))}
          </div>

          <button
            onClick={() => setStatus("idle")}
            className="px-4 py-2 border border-slate-800 hover:border-emerald-500/50 text-slate-400 hover:text-emerald-400 font-bold text-xs rounded transition-all duration-200 cursor-pointer"
          >
            Send Another Message
          </button>
        </div>
      )}
    </div>
  );
}
