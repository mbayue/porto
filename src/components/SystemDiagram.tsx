"use client";

import { Braces, Database, Globe2, Server } from "lucide-react";
import { motion, MotionConfig, type Variants } from "framer-motion";

const list: Variants = {
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

export default function SystemDiagram() {
  return (
    <MotionConfig reducedMotion="user">
    <div className="architecture" role="img" aria-label="Backend architecture illustration: a client connects to an API service, which connects to a database and a background worker.">
      <motion.div initial="hidden" animate="show" variants={list}>
        <motion.div variants={item} className="architecture-caption"><span><span className="status-dot" /> SYSTEMS OPERATIONAL</span><Braces size={17} /></motion.div>
        <motion.div variants={item} className="system-node client-node"><Globe2 size={19} /><span>Client request</span><span className="node-code">HTTPS</span></motion.div>
        <motion.div variants={item} className="connector connector-top"><span>GET /something-good</span></motion.div>
        <motion.div variants={item} className="system-node api-node"><div className="api-icon"><Server size={28} /></div><div><span className="node-kicker">THE BACKEND</span><strong>Built to do the work.</strong><small>Logic. Integrations. Reliability.</small></div><span className="node-indicator" /></motion.div>
        <motion.div variants={item} className="connector-branch"><i /><i /></motion.div>
        <motion.div variants={item} className="system-bottom"><div className="system-node"><Database size={21} /><span>Database<small>Store what matters</small></span></div><div className="system-node"><Braces size={21} /><span>Worker<small>Handle the details</small></span></div></motion.div>
        <motion.div variants={item} className="architecture-footer"><span><i /> Request → response</span><span>One thoughtful layer at a time.</span></motion.div>
      </motion.div>
      <span className="diagram-index">FIG. 01 / BEHIND THE INTERFACE</span>
    </div>
    </MotionConfig>
  );
}
