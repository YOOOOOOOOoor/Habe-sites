import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Image as ImageIcon, RefreshCw, Trash2, X } from 'lucide-react';
import { MediaAsset } from '../../types/editor';

export function SafeImage({
  src,
  alt,
  className = '',
  fallbackLabel = 'No image selected',
}: {
  src?: string | null;
  alt: string;
  className?: string;
  fallbackLabel?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-[#F3F4F6] text-[#6B7280] select-none ${className}`}
        role="img"
        aria-label={alt || fallbackLabel}
      >
        <ImageIcon className="w-5 h-5 mb-1.5 text-[#9CA3AF]" strokeWidth={1.6} />
        <span className="text-[11px] font-medium text-[#6B7280] px-2 text-center truncate max-w-full">
          {fallbackLabel}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}

export function EditorSectionHeader({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 pb-6 border-b border-[#E5E7EB]">
      <div className="space-y-1 max-w-xl">
        <h1 className="text-xl font-semibold tracking-tight text-[#111827]">{title}</h1>
        <p className="text-sm text-[#4B5563] leading-relaxed">{description}</p>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function ExpandableSection({
  title,
  subtitle,
  defaultOpen = false,
  isOpen: controlledOpen,
  onToggle,
  children,
}: {
  title: string;
  subtitle?: string;
  defaultOpen?: boolean;
  isOpen?: boolean;
  onToggle?: () => void;
  children: React.ReactNode;
}) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const handleToggle = () => {
    if (onToggle) onToggle();
    else setInternalOpen((prev) => !prev);
  };

  return (
    <div className="border border-[#E5E7EB] rounded-xl bg-white overflow-hidden">
      <button
        type="button"
        onClick={handleToggle}
        aria-expanded={open}
        className="w-full flex items-center justify-between gap-4 px-4 py-3.5 text-left hover:bg-[#F9FAFB] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#1E3A2F]"
      >
        <div className="min-w-0">
          <div className="text-sm font-medium text-[#111827]">{title}</div>
          {subtitle && <div className="text-xs text-[#6B7280] mt-0.5">{subtitle}</div>}
        </div>
        {open ? (
          <ChevronDown className="w-4 h-4 text-[#6B7280] shrink-0" />
        ) : (
          <ChevronRight className="w-4 h-4 text-[#6B7280] shrink-0" />
        )}
      </button>
      {open && <div className="px-4 pb-4 pt-2 border-t border-[#F3F4F6] space-y-4">{children}</div>}
    </div>
  );
}

export function ImageFieldControl({
  label,
  helperText,
  asset,
  onOpenPicker,
  onRemove,
  aspectClass = 'aspect-[16/10]',
}: {
  label: string;
  helperText?: string;
  asset?: MediaAsset;
  onOpenPicker: () => void;
  onRemove?: () => void;
  aspectClass?: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between gap-2">
        <label className="block text-sm font-medium text-[#111827]">{label}</label>
        {helperText && <span className="text-xs text-[#6B7280]">{helperText}</span>}
      </div>
      <div className="border border-[#E5E7EB] rounded-xl bg-white p-3 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className={`w-full sm:w-44 ${aspectClass} rounded-lg overflow-hidden border border-[#E5E7EB] shrink-0 bg-[#F9FAFB]`}>
          <SafeImage
            src={asset?.url}
            alt={asset?.alt || label}
            className="w-full h-full object-cover"
            fallbackLabel="No photo chosen"
          />
        </div>
        <div className="flex-1 min-w-0 space-y-3">
          {asset ? (
            <div>
              <p className="text-sm font-medium text-[#111827] truncate">{asset.title}</p>
              <p className="text-xs text-[#6B7280] line-clamp-2 mt-0.5">{asset.alt}</p>
            </div>
          ) : (
            <div>
              <p className="text-sm font-medium text-[#374151]">No image selected</p>
              <p className="text-xs text-[#6B7280] mt-0.5">
                Choose a photo from your library or upload one from your device.
              </p>
            </div>
          )}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onOpenPicker}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-[#D1D5DB] bg-white text-[#111827] hover:bg-[#F9FAFB] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1E3A2F]"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#4B5563]" />
              {asset ? 'Replace Image' : 'Choose Image'}
            </button>
            {asset && onRemove && (
              <button
                type="button"
                onClick={onRemove}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-[#B91C1C] hover:bg-[#FEF2F2] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#DC2626]"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Remove
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel = 'Cancel',
  tone = 'default',
  onConfirm,
  onCancel,
  extraContent,
}: {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel?: string;
  tone?: 'default' | 'danger';
  onConfirm: () => void;
  onCancel: () => void;
  extraContent?: React.ReactNode;
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#111827]/45 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
    >
      <div className="w-full max-w-md bg-white rounded-2xl border border-[#E5E7EB] shadow-xl overflow-hidden">
        <div className="flex items-start justify-between gap-4 px-6 pt-5 pb-3">
          <h2 id="confirm-dialog-title" className="text-base font-semibold text-[#111827]">
            {title}
          </h2>
          <button
            type="button"
            onClick={onCancel}
            className="p-1 rounded-lg text-[#6B7280] hover:text-[#111827] hover:bg-[#F3F4F6] transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="px-6 pb-5 space-y-3">
          <p className="text-sm text-[#4B5563] leading-relaxed">{description}</p>
          {extraContent}
        </div>
        <div className="flex items-center justify-end gap-2.5 px-6 py-4 bg-[#F9FAFB] border-t border-[#E5E7EB]">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-[#374151] bg-white border border-[#D1D5DB] rounded-lg hover:bg-[#F3F4F6] transition-colors whitespace-nowrap shrink-0"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              tone === 'danger'
                ? 'bg-[#DC2626] hover:bg-[#B91C1C]'
                : 'bg-[#1E3A2F] hover:bg-[#162C23]'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
