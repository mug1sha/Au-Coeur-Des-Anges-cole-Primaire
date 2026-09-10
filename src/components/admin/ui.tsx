"use client";

import { Fragment, ReactNode, useEffect, useRef, useState } from "react";
import { AlertTriangle, X, Check, Loader2, ChevronLeft, ChevronRight } from "lucide-react";

// ─────────────────────────────────────────────
// STAT CARD
// ─────────────────────────────────────────────
interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ElementType;
  iconBg?: string;
  suffix?: string;
}

export function StatCard({ title, value, change, icon: Icon, iconBg = "bg-[#FF6B35]/10", suffix }: StatCardProps) {
  return (
    <div className="rounded-[20px] border border-slate-100 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</p>
          <p className="mt-2 font-[family-name:var(--font-heading)] text-2xl font-extrabold text-[#0B1B3D]">
            {typeof value === "number" ? value.toLocaleString("fr-FR") : value}
            {suffix && <span className="ml-1 text-sm font-medium text-slate-400">{suffix}</span>}
          </p>
        </div>
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconBg}`}>
          <Icon size={20} className="text-[#FF6B35]" />
        </div>
      </div>
      {change !== undefined && (
        <div className={`mt-3 flex items-center gap-1 text-xs font-medium ${change >= 0 ? "text-emerald-600" : "text-red-500"}`}>
          <span>{change >= 0 ? "▲" : "▼"} {Math.abs(change)}%</span>
          <span className="text-slate-400 font-normal">vs mois précédent</span>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// BADGE
// ─────────────────────────────────────────────
type BadgeVariant = "success" | "warning" | "danger" | "info" | "neutral";

const BADGE_STYLES: Record<BadgeVariant, string> = {
  success: "bg-emerald-100 text-emerald-700",
  warning: "bg-amber-100 text-amber-700",
  danger: "bg-red-100 text-red-600",
  info: "bg-blue-100 text-blue-700",
  neutral: "bg-slate-100 text-slate-600",
};

export function Badge({ variant = "neutral", children }: { variant?: BadgeVariant; children: ReactNode }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${BADGE_STYLES[variant]}`}>
      {children}
    </span>
  );
}

// ─────────────────────────────────────────────
// BUTTON
// ─────────────────────────────────────────────
type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";

const BTN_STYLES: Record<ButtonVariant, string> = {
  primary: "bg-[#FF6B35] text-white hover:bg-[#F95738] shadow-sm hover:shadow-md",
  secondary: "border border-slate-200 bg-white text-[#0B1B3D] hover:bg-slate-50",
  danger: "bg-red-500 text-white hover:bg-red-600",
  ghost: "text-slate-600 hover:bg-slate-100",
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  icon?: React.ElementType;
  children?: ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  loading,
  icon: Icon,
  children,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const sizeClass = size === "sm" ? "px-3 py-1.5 text-xs" : size === "lg" ? "px-6 py-3 text-base" : "px-4 py-2 text-sm";
  return (
    <button
      disabled={disabled || loading}
      className={`inline-flex items-center gap-2 rounded-xl font-semibold transition duration-150 disabled:cursor-not-allowed disabled:opacity-60 ${BTN_STYLES[variant]} ${sizeClass} ${className}`}
      {...props}
    >
      {loading ? <Loader2 size={14} className="animate-spin" /> : Icon ? <Icon size={14} /> : null}
      {children}
    </button>
  );
}

// ─────────────────────────────────────────────
// INPUT
// ─────────────────────────────────────────────
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, id, className = "", ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="mb-1.5 block text-xs font-semibold text-[#0B1B3D]">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`w-full rounded-xl border px-4 py-2.5 text-sm text-[#0B1B3D] outline-none transition focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/20 ${
          error ? "border-red-400 bg-red-50" : "border-slate-200 bg-white"
        } ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

// ─────────────────────────────────────────────
// TEXTAREA
// ─────────────────────────────────────────────
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function Textarea({ label, error, id, className = "", ...props }: TextareaProps) {
  return (
    <div className="w-full">
      {label && <label htmlFor={id} className="mb-1.5 block text-xs font-semibold text-[#0B1B3D]">{label}</label>}
      <textarea
        id={id}
        className={`w-full rounded-xl border px-4 py-2.5 text-sm text-[#0B1B3D] outline-none transition focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/20 resize-none ${
          error ? "border-red-400 bg-red-50" : "border-slate-200 bg-white"
        } ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

// ─────────────────────────────────────────────
// SELECT
// ─────────────────────────────────────────────
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export function Select({ label, error, id, options, className = "", ...props }: SelectProps) {
  return (
    <div className="w-full">
      {label && <label htmlFor={id} className="mb-1.5 block text-xs font-semibold text-[#0B1B3D]">{label}</label>}
      <select
        id={id}
        className={`w-full rounded-xl border px-4 py-2.5 text-sm text-[#0B1B3D] outline-none transition focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/20 ${
          error ? "border-red-400 bg-red-50" : "border-slate-200 bg-white"
        } ${className}`}
        {...props}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

// ─────────────────────────────────────────────
// CARD
// ─────────────────────────────────────────────
export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-[20px] border border-slate-100 bg-white shadow-sm ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`flex items-center justify-between border-b border-slate-100 px-6 py-4 ${className}`}>{children}</div>;
}

export function CardBody({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`p-6 ${className}`}>{children}</div>;
}

// ─────────────────────────────────────────────
// TABLE
// ─────────────────────────────────────────────
export function Table({ children }: { children: ReactNode }) {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse text-sm">{children}</table>
    </div>
  );
}

export function Th({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <th className={`border-b border-slate-100 bg-slate-50/80 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 ${className}`}>
      {children}
    </th>
  );
}

export function Td({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <td className={`border-b border-slate-50 px-4 py-3.5 text-[#0B1B3D] ${className}`}>
      {children}
    </td>
  );
}

// ─────────────────────────────────────────────
// PAGINATION
// ─────────────────────────────────────────────
interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  pageSize: number;
  onChange: (page: number) => void;
}

export function Pagination({ page, totalPages, total, pageSize, onChange }: PaginationProps) {
  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);
  return (
    <div className="flex items-center justify-between px-1 py-3 text-xs text-slate-500">
      <span>{start}–{end} sur {total.toLocaleString("fr-FR")}</span>
      <div className="flex gap-1">
        <button
          onClick={() => onChange(page - 1)}
          disabled={page <= 1}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 transition hover:bg-slate-100 disabled:opacity-40"
        >
          <ChevronLeft size={14} />
        </button>
        <span className="flex h-8 items-center px-3 font-medium text-[#0B1B3D]">{page}</span>
        <button
          onClick={() => onChange(page + 1)}
          disabled={page >= totalPages}
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 transition hover:bg-slate-100 disabled:opacity-40"
        >
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// EMPTY STATE
// ─────────────────────────────────────────────
export function EmptyState({ icon: Icon, title, description, action }: {
  icon: React.ElementType;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
        <Icon size={24} className="text-slate-400" />
      </div>
      <p className="font-[family-name:var(--font-heading)] font-bold text-[#0B1B3D]">{title}</p>
      {description && <p className="mt-1 max-w-xs text-sm text-slate-400">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

// ─────────────────────────────────────────────
// CONFIRMATION DIALOG
// ─────────────────────────────────────────────
interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export function ConfirmDialog({ open, title, description, confirmLabel = "Confirmer", onConfirm, onCancel, loading }: ConfirmDialogProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-sm rounded-[20px] bg-white p-6 shadow-xl">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100">
            <AlertTriangle size={18} className="text-red-500" />
          </div>
          <div>
            <p className="font-[family-name:var(--font-heading)] font-bold text-[#0B1B3D]">{title}</p>
            {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
          </div>
        </div>
        <div className="mt-5 flex gap-3">
          <Button variant="secondary" className="flex-1" onClick={onCancel}>Annuler</Button>
          <Button variant="danger" className="flex-1" loading={loading} onClick={onConfirm}>{confirmLabel}</Button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// TOAST
// ─────────────────────────────────────────────
type ToastType = "success" | "error" | "info";

interface ToastProps { message: string; type: ToastType; onClose: () => void; }

export function Toast({ message, type, onClose }: ToastProps) {
  const bg = type === "success" ? "bg-emerald-600" : type === "error" ? "bg-red-500" : "bg-[#0B1B3D]";
  const Icon = type === "success" ? Check : type === "error" ? X : AlertTriangle;
  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl px-5 py-3.5 text-sm font-medium text-white shadow-xl ${bg}`}>
      <Icon size={16} />
      <span>{message}</span>
      <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100"><X size={14} /></button>
    </div>
  );
}

// ─────────────────────────────────────────────
// LOADING SKELETON
// ─────────────────────────────────────────────
export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-slate-200 ${className}`} />;
}

// ─────────────────────────────────────────────
// MODAL
// ─────────────────────────────────────────────
interface ModalProps { open: boolean; onClose: () => void; title: string; children: ReactNode; width?: string; }

export function Modal({ open, onClose, title, children, width = "max-w-lg" }: ModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className={`w-full ${width} rounded-[20px] bg-white shadow-xl`}>
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h2 className="font-[family-name:var(--font-heading)] text-lg font-bold text-[#0B1B3D]">{title}</h2>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"><X size={18} /></button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// TOGGLE
// ─────────────────────────────────────────────
export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label?: string }) {
  return (
    <label className="flex cursor-pointer items-center gap-2">
      <div
        onClick={() => onChange(!checked)}
        className={`relative h-5 w-9 rounded-full transition-colors duration-200 ${checked ? "bg-[#FF6B35]" : "bg-slate-300"}`}
      >
        <div className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform duration-200 ${checked ? "translate-x-4" : "translate-x-0.5"}`} />
      </div>
      {label && <span className="text-sm text-[#0B1B3D]">{label}</span>}
    </label>
  );
}

// ─────────────────────────────────────────────
// STATUS DOT
// ─────────────────────────────────────────────
export function StatusDot({ active }: { active: boolean }) {
  return (
    <span className={`inline-block h-2 w-2 rounded-full ${active ? "bg-emerald-500" : "bg-slate-300"}`} />
  );
}

// ─────────────────────────────────────────────
// SEARCH INPUT
// ─────────────────────────────────────────────
export function SearchInput({ value, onChange, placeholder = "Rechercher…" }: {
  value: string; onChange: (v: string) => void; placeholder?: string;
}) {
  return (
    <div className="relative">
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-4 text-sm text-[#0B1B3D] outline-none transition focus:border-[#FF6B35] focus:ring-2 focus:ring-[#FF6B35]/20"
      />
      <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────
// USE TOAST HOOK
// ─────────────────────────────────────────────
export function useToast() {
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const show = (message: string, type: ToastType = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const ToastComponent = toast ? (
    <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
  ) : null;

  return { show, ToastComponent };
}


// ─────────────────────────────────────────────
// RICH EDITOR
// contentEditable-based editor with a formatting toolbar.
// Stores content as HTML string. Sanitisation must be applied
// before rendering HTML on the public site.
// ─────────────────────────────────────────────
type RichEditorFormat = "bold" | "italic" | "underline" | "strikeThrough"
  | "insertUnorderedList" | "insertOrderedList" | "h2" | "h3" | "blockquote";

interface RichEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  minHeight?: number;
}

export function RichEditor({
  value, onChange, placeholder = "Rédigez votre contenu ici…",
  label, error, minHeight = 220,
}: RichEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [focused, setFocused] = useState(false);

  // Initialise content once on mount
  useEffect(() => {
    const el = editorRef.current;
    if (el && el.innerHTML !== value) {
      el.innerHTML = value ?? "";
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function exec(cmd: RichEditorFormat, arg?: string) {
    editorRef.current?.focus();
    if (cmd === "h2" || cmd === "h3") {
      document.execCommand("formatBlock", false, cmd === "h2" ? "<h2>" : "<h3>");
    } else if (cmd === "blockquote") {
      document.execCommand("formatBlock", false, "<blockquote>");
    } else {
      document.execCommand(cmd, false, arg);
    }
    // Flush the change
    if (editorRef.current) onChange(editorRef.current.innerHTML);
  }

  function isActive(cmd: string): boolean {
    try {
      if (cmd === "h2" || cmd === "h3") {
        const block = document.queryCommandValue("formatBlock").toLowerCase();
        return block === cmd;
      }
      if (cmd === "blockquote") {
        const block = document.queryCommandValue("formatBlock").toLowerCase();
        return block === "blockquote";
      }
      return document.queryCommandState(cmd);
    } catch {
      return false;
    }
  }

  const TOOLBAR: { cmd: RichEditorFormat; label: string; icon: string; title: string }[] = [
    { cmd: "bold",                 label: "B",   icon: "font-bold",          title: "Gras (Ctrl+B)" },
    { cmd: "italic",               label: "I",   icon: "italic",             title: "Italique (Ctrl+I)" },
    { cmd: "underline",            label: "U",   icon: "underline",          title: "Souligné (Ctrl+U)" },
    { cmd: "h2",                   label: "H2",  icon: "",                   title: "Titre 2" },
    { cmd: "h3",                   label: "H3",  icon: "",                   title: "Titre 3" },
    { cmd: "insertUnorderedList",  label: "•",   icon: "",                   title: "Liste à puces" },
    { cmd: "insertOrderedList",    label: "1.",  icon: "",                   title: "Liste numérotée" },
    { cmd: "blockquote",           label: "❝",   icon: "",                   title: "Citation" },
  ];

  const showPlaceholder = !value || value === "" || value === "<br>";

  return (
    <div className="w-full">
      {label && <label className="mb-1.5 block text-xs font-semibold text-[#0B1B3D]">{label}</label>}

      <div
        className={`overflow-hidden rounded-xl border transition ${
          error ? "border-red-400" : focused ? "border-[#FF6B35] ring-2 ring-[#FF6B35]/20" : "border-slate-200"
        }`}
      >
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-0.5 border-b border-slate-100 bg-slate-50 px-2 py-1.5">
          {TOOLBAR.map(({ cmd, label: lbl, title }, i) => {
            const sep = i === 2 || i === 4 || i === 6;
            return (
              <Fragment key={cmd}>
                {sep && <span className="mx-1 h-4 w-px bg-slate-200" />}
                <button
                  type="button"
                  title={title}
                  onMouseDown={(e) => { e.preventDefault(); exec(cmd); }}
                  className={`flex h-7 min-w-7 items-center justify-center rounded-lg px-1.5 text-xs font-semibold transition ${
                    isActive(cmd)
                      ? "bg-[#FF6B35] text-white"
                      : "text-slate-600 hover:bg-slate-200"
                  } ${cmd === "bold" ? "font-bold" : cmd === "italic" ? "italic" : cmd === "underline" ? "underline" : ""}`}
                >
                  {lbl}
                </button>
              </Fragment>
            );
          })}
        </div>

        {/* Editable area */}
        <div className="relative">
          {showPlaceholder && !focused && (
            <p className="pointer-events-none absolute left-4 top-3 text-sm text-slate-400 select-none">
              {placeholder}
            </p>
          )}
          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            onFocus={() => setFocused(true)}
            onBlur={(e) => {
              setFocused(false);
              onChange(e.currentTarget.innerHTML);
            }}
            onInput={(e) => onChange(e.currentTarget.innerHTML)}
            style={{ minHeight }}
            className="rich-editor px-4 py-3 text-sm text-[#0B1B3D] outline-none"
          />
        </div>
      </div>

      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}

      <style>{`
        .rich-editor h2 { font-size: 1.15rem; font-weight: 700; margin: 0.75rem 0 0.35rem; color: #0B1B3D; }
        .rich-editor h3 { font-size: 1rem; font-weight: 600; margin: 0.6rem 0 0.3rem; color: #0B1B3D; }
        .rich-editor p  { margin: 0 0 0.5rem; }
        .rich-editor ul { list-style: disc; padding-left: 1.5rem; margin: 0.4rem 0; }
        .rich-editor ol { list-style: decimal; padding-left: 1.5rem; margin: 0.4rem 0; }
        .rich-editor li { margin-bottom: 0.2rem; }
        .rich-editor blockquote { border-left: 3px solid #FF6B35; padding-left: 1rem; margin: 0.75rem 0; color: #475569; font-style: italic; }
        .rich-editor strong { font-weight: 700; }
        .rich-editor em { font-style: italic; }
        .rich-editor u  { text-decoration: underline; }
        .rich-editor s  { text-decoration: line-through; }
        .rich-editor a  { color: #FF6B35; text-decoration: underline; }
        .rich-editor [data-placeholder]:empty:before { content: attr(data-placeholder); color: #94a3b8; }
      `}</style>
    </div>
  );
}
