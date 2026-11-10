import React, { useRef, useState } from 'react';
import { Check, Pencil, Plus, Trash2, Upload, X } from 'lucide-react';
import { MediaAsset } from '../../types/editor';
import { EditorSectionHeader, SafeImage } from '../ui/EditorPrimitives';

interface ImageLibraryContentProps {
  assets: MediaAsset[];
  selectedId?: string | null;
  onSelect?: (asset: MediaAsset) => void;
  onAddAsset: (asset: MediaAsset) => void;
  onUpdateAsset: (asset: MediaAsset) => void;
  onDeleteAsset: (id: string) => void;
  mode: 'picker' | 'standalone';
}

export function ImageLibraryContent({
  assets,
  selectedId,
  onSelect,
  onAddAsset,
  onUpdateAsset,
  onDeleteAsset,
  mode,
}: ImageLibraryContentProps) {
  const [filter, setFilter] = useState<'All' | MediaAsset['category']>('All');
  const [editingAssetId, setEditingAssetId] = useState<string | null>(null);
  const [draftTitle, setDraftTitle] = useState('');
  const [draftAlt, setDraftAlt] = useState('');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const replaceInputRef = useRef<HTMLInputElement>(null);
  const [replacingId, setReplacingId] = useState<string | null>(null);

  const filteredAssets =
    filter === 'All' ? assets : assets.filter((asset) => asset.category === filter);

  const activeEditingAsset = assets.find((a) => a.id === editingAssetId);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, replaceTargetId?: string) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Please choose a valid image file (JPG, PNG, or WebP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Please choose an image smaller than 5 MB.');
      return;
    }

    setUploadError(null);
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = typeof reader.result === 'string' ? reader.result : '';
      if (!dataUrl) return;
      const cleanName = file.name.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' ');

      if (replaceTargetId) {
        const existing = assets.find((a) => a.id === replaceTargetId);
        if (existing) {
          onUpdateAsset({
            ...existing,
            url: dataUrl,
          });
        }
        setReplacingId(null);
      } else {
        const newAsset: MediaAsset = {
          id: `img-upload-${Date.now()}`,
          url: dataUrl,
          title: cleanName || 'Uploaded Cafe Photo',
          alt: cleanName || 'Cafe photograph',
          category: 'Upload',
          isCustomUpload: true,
        };
        onAddAsset(newAsset);
        if (mode === 'picker' && onSelect) {
          onSelect(newAsset);
        } else {
          setEditingAssetId(newAsset.id);
          setDraftTitle(newAsset.title);
          setDraftAlt(newAsset.alt);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const openEditDetails = (asset: MediaAsset) => {
    setEditingAssetId(asset.id);
    setDraftTitle(asset.title);
    setDraftAlt(asset.alt);
  };

  const saveEditDetails = () => {
    if (!activeEditingAsset) return;
    onUpdateAsset({
      ...activeEditingAsset,
      title: draftTitle.trim() || activeEditingAsset.title,
      alt: draftAlt.trim() || activeEditingAsset.alt,
    });
    setEditingAssetId(null);
  };

  const categories: Array<'All' | MediaAsset['category']> = [
    'All',
    'Interior',
    'Coffee',
    'Food',
    'Upload',
  ];

  return (
    <div className="space-y-5">
      {mode === 'standalone' && (
        <EditorSectionHeader
          title="Image Library"
          description="Browse sample café photography or upload your own photos to use across your homepage, gallery, and menu."
          action={
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#1E3A2F] rounded-lg hover:bg-[#162C23] transition-colors whitespace-nowrap shrink-0"
            >
              <Upload className="w-4 h-4" />
              Upload Photo
            </button>
          }
        />
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFileUpload(e)}
      />
      <input
        ref={replaceInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFileUpload(e, replacingId || undefined)}
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1 p-1 bg-[#F3F4F6] rounded-lg overflow-x-auto max-w-full">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setFilter(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 ${
                filter === cat
                  ? 'bg-white text-[#111827] shadow-sm'
                  : 'text-[#4B5563] hover:text-[#111827]'
              }`}
            >
              {cat === 'Upload' ? 'Your Uploads' : cat}
            </button>
          ))}
        </div>

        {mode === 'picker' && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-white bg-[#1E3A2F] rounded-lg hover:bg-[#162C23] transition-colors whitespace-nowrap shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            Upload Photo
          </button>
        )}
      </div>

      {uploadError && (
        <div className="p-3 rounded-lg bg-[#FEF2F2] border border-[#FECACA] text-xs text-[#991B1B]">
          {uploadError}
        </div>
      )}

      {/* Focused edit drawer when an image's details are being edited */}
      {activeEditingAsset && (
        <div className="p-4 rounded-xl border border-[#D1D5DB] bg-[#F9FAFB] space-y-3">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-sm font-semibold text-[#111827]">Edit Image Details</h3>
            <button
              type="button"
              onClick={() => setEditingAssetId(null)}
              className="text-xs text-[#6B7280] hover:text-[#111827]"
            >
              Close
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-start">
            <div className="aspect-[4/3] rounded-lg overflow-hidden border border-[#E5E7EB] bg-white">
              <SafeImage
                src={activeEditingAsset.url}
                alt={activeEditingAsset.alt}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="sm:col-span-2 space-y-3">
              <div>
                <label className="block text-xs font-medium text-[#374151] mb-1">
                  Image title
                </label>
                <input
                  type="text"
                  value={draftTitle}
                  onChange={(e) => setDraftTitle(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white border border-[#D1D5DB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A2F]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#374151] mb-1">
                  Description (alt text for accessibility & SEO)
                </label>
                <input
                  type="text"
                  value={draftAlt}
                  onChange={(e) => setDraftAlt(e.target.value)}
                  placeholder="Describe what appears in this photograph"
                  className="w-full px-3 py-2 text-sm bg-white border border-[#D1D5DB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A2F]"
                />
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setReplacingId(activeEditingAsset.id);
                    replaceInputRef.current?.click();
                  }}
                  className="px-3 py-1.5 text-xs font-medium text-[#374151] bg-white border border-[#D1D5DB] rounded-lg hover:bg-[#F3F4F6] transition-colors"
                >
                  Replace Image File
                </button>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingAssetId(null)}
                    className="px-3 py-1.5 text-xs font-medium text-[#4B5563] hover:text-[#111827]"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={saveEditDetails}
                    className="px-3.5 py-1.5 text-xs font-medium text-white bg-[#1E3A2F] rounded-lg hover:bg-[#162C23]"
                  >
                    Save Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {filteredAssets.length === 0 ? (
        <div className="border border-dashed border-[#D1D5DB] rounded-xl p-10 text-center bg-white">
          <p className="text-sm font-medium text-[#111827]">No photos in this category yet</p>
          <p className="text-xs text-[#6B7280] mt-1">
            Upload a photo from your computer or phone to add it to your library.
          </p>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-[#1E3A2F] rounded-lg hover:bg-[#162C23]"
          >
            <Upload className="w-3.5 h-3.5" />
            Upload Photo
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAssets.map((asset) => {
            const isSelected = selectedId === asset.id;
            return (
              <div
                key={asset.id}
                className={`group rounded-xl border bg-white overflow-hidden transition-colors ${
                  isSelected
                    ? 'border-[#1E3A2F] ring-2 ring-[#1E3A2F]/20'
                    : 'border-[#E5E7EB] hover:border-[#9CA3AF]'
                }`}
              >
                <div className="relative aspect-[4/3] bg-[#F3F4F6] overflow-hidden">
                  <SafeImage
                    src={asset.url}
                    alt={asset.alt}
                    className="w-full h-full object-cover"
                  />
                  {isSelected && (
                    <div className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-[#1E3A2F] text-white flex items-center justify-center shadow-sm">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>
                <div className="p-3 space-y-2">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[#111827] truncate">{asset.title}</p>
                    <p className="text-xs text-[#6B7280] mt-0.5 truncate">
                      {asset.category === 'Upload' ? 'Uploaded photo' : `${asset.category} sample`}
                    </p>
                  </div>
                  <div className="flex items-center justify-between gap-2 pt-1 border-t border-[#F3F4F6]">
                    {mode === 'picker' && onSelect ? (
                      <button
                        type="button"
                        onClick={() => onSelect(asset)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                          isSelected
                            ? 'bg-[#1E3A2F] text-white'
                            : 'bg-[#F3F4F6] text-[#111827] hover:bg-[#E5E7EB]'
                        }`}
                      >
                        {isSelected ? 'Selected' : 'Use Photo'}
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => openEditDetails(asset)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-[#374151] hover:bg-[#F3F4F6] rounded-lg transition-colors"
                      >
                        <Pencil className="w-3 h-3" />
                        Edit Details
                      </button>
                    )}

                    <div className="flex items-center gap-1">
                      {mode === 'picker' && (
                        <button
                          type="button"
                          onClick={() => openEditDetails(asset)}
                          title="Edit image details"
                          className="p-1.5 text-[#6B7280] hover:text-[#111827] hover:bg-[#F3F4F6] rounded-lg transition-colors"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {asset.isCustomUpload && (
                        <button
                          type="button"
                          onClick={() => onDeleteAsset(asset.id)}
                          title="Remove uploaded image"
                          className="p-1.5 text-[#6B7280] hover:text-[#DC2626] hover:bg-[#FEF2F2] rounded-lg transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function ImagePickerModal({
  open,
  title = 'Choose an Image',
  selectedId,
  assets,
  onSelect,
  onClose,
  onAddAsset,
  onUpdateAsset,
  onDeleteAsset,
}: {
  open: boolean;
  title?: string;
  selectedId?: string | null;
  assets: MediaAsset[];
  onSelect: (asset: MediaAsset) => void;
  onClose: () => void;
  onAddAsset: (asset: MediaAsset) => void;
  onUpdateAsset: (asset: MediaAsset) => void;
  onDeleteAsset: (id: string) => void;
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#111827]/50 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className="w-full max-w-3xl max-h-[86vh] bg-white rounded-2xl border border-[#E5E7EB] shadow-2xl flex flex-col overflow-hidden">
        <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-[#E5E7EB]">
          <div>
            <h2 className="text-base font-semibold text-[#111827]">{title}</h2>
            <p className="text-xs text-[#6B7280] mt-0.5">
              Select a curated café photo or upload your own image.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#6B7280] hover:text-[#111827] hover:bg-[#F3F4F6] transition-colors"
            aria-label="Close image picker"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto flex-1">
          <ImageLibraryContent
            assets={assets}
            selectedId={selectedId}
            onSelect={(asset) => {
              onSelect(asset);
              onClose();
            }}
            onAddAsset={onAddAsset}
            onUpdateAsset={onUpdateAsset}
            onDeleteAsset={onDeleteAsset}
            mode="picker"
          />
        </div>
      </div>
    </div>
  );
}
