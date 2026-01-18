import React from "react";

export default function Card({ title, children, className = "" }) {
  return (
    <div className={`bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-lg p-4 shadow-sm ${className}`}>
      {title && <h3 className="text-sm font-semibold mb-2 text-slate-700 dark:text-slate-200">{title}</h3>}
      <div>{children}</div>
    </div>
  );
}
