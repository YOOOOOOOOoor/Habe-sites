import React, { useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  ChevronDown,
  ChevronRight,
  Eye,
  FolderPlus,
  Pencil,
  Plus,
  Star,
  Trash2,
} from 'lucide-react';
import {
  CafeWebsiteData,
  CurrencyCode,
  MediaAsset,
  MenuCategory,
  MenuItem,
} from '../../types/editor';
import { formatPrice, resolveMediaAsset, slugify } from '../../utils/siteHelpers';
import {
  ConfirmDialog,
  EditorSectionHeader,
  ImageFieldControl,
  SafeImage,
} from '../ui/EditorPrimitives';

interface MenuEditorProps {
  data: CafeWebsiteData;
  onChange: (updater: (prev: CafeWebsiteData) => CafeWebsiteData) => void;
  mediaAssets: MediaAsset[];
  onRequestImagePick: (
    title: string,
    currentId: string | null | undefined,
    onPick: (asset: MediaAsset) => void
  ) => void;
  onPreviewMenuItem?: (itemSlug: string) => void;
}

type ActiveFormState =
  | { kind: 'none' }
  | { kind: 'add-category' }
  | { kind: 'edit-category'; categoryId: string }
  | { kind: 'add-item'; categoryId: string }
  | { kind: 'edit-item'; itemId: string };

const CURRENCIES: CurrencyCode[] = ['ETB', 'USD', 'EUR', 'GBP'];

export function MenuEditor({
  data,
  onChange,
  mediaAssets,
  onRequestImagePick,
  onPreviewMenuItem,
}: MenuEditorProps) {
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    data.menuCategories.forEach((cat) => {
      initial[cat.id] = true;
    });
    return initial;
  });

  const [activeForm, setActiveForm] = useState<ActiveFormState>({ kind: 'none' });

  // Category form state
  const [catName, setCatName] = useState('');
  const [catDescription, setCatDescription] = useState('');
  const [catError, setCatError] = useState<string | null>(null);

  // Item form state
  const [itemName, setItemName] = useState('');
  const [itemDescription, setItemDescription] = useState('');
  const [itemPrice, setItemPrice] = useState('');
  const [itemCurrency, setItemCurrency] = useState<CurrencyCode>('ETB');
  const [itemImageId, setItemImageId] = useState<string | null>(null);
  const [itemFeatured, setItemFeatured] = useState(false);
  const [itemError, setItemError] = useState<string | null>(null);

  // Confirmation modal state
  const [deleteTarget, setDeleteTarget] = useState<
    | { type: 'category'; id: string; name: string; itemCount: number }
    | { type: 'item'; id: string; name: string }
    | null
  >(null);

  const toggleCategory = (id: string) => {
    setExpandedCategories((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const openAddCategory = () => {
    setCatName('');
    setCatDescription('');
    setCatError(null);
    setActiveForm({ kind: 'add-category' });
  };

  const openEditCategory = (cat: MenuCategory) => {
    setCatName(cat.name);
    setCatDescription(cat.description);
    setCatError(null);
    setActiveForm({ kind: 'edit-category', categoryId: cat.id });
  };

  const saveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = catName.trim();
    if (!trimmedName) {
      setCatError('Please enter a category name (for example, Coffee or Breakfast).');
      return;
    }

    if (activeForm.kind === 'add-category') {
      const newCat: MenuCategory = {
        id: `cat-${Date.now()}`,
        name: trimmedName,
        description: catDescription.trim(),
      };
      onChange((prev) => ({
        ...prev,
        menuCategories: [...prev.menuCategories, newCat],
      }));
      setExpandedCategories((prev) => ({ ...prev, [newCat.id]: true }));
    } else if (activeForm.kind === 'edit-category') {
      onChange((prev) => ({
        ...prev,
        menuCategories: prev.menuCategories.map((c) =>
          c.id === activeForm.categoryId
            ? { ...c, name: trimmedName, description: catDescription.trim() }
            : c
        ),
      }));
    }
    setActiveForm({ kind: 'none' });
  };

  const openAddItem = (categoryId: string) => {
    setExpandedCategories((prev) => ({ ...prev, [categoryId]: true }));
    setItemName('');
    setItemDescription('');
    setItemPrice('');
    setItemCurrency('ETB');
    setItemImageId(null);
    setItemFeatured(false);
    setItemError(null);
    setActiveForm({ kind: 'add-item', categoryId });
  };

  const openEditItem = (item: MenuItem) => {
    setExpandedCategories((prev) => ({ ...prev, [item.categoryId]: true }));
    setItemName(item.name);
    setItemDescription(item.description);
    setItemPrice(String(item.price));
    setItemCurrency(item.currency);
    setItemImageId(item.imageId);
    setItemFeatured(item.featured);
    setItemError(null);
    setActiveForm({ kind: 'edit-item', itemId: item.id });
  };

  const saveItem = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = itemName.trim();
    const parsedPrice = Number(itemPrice);

    if (!trimmedName) {
      setItemError('Please enter a menu item name.');
      return;
    }
    if (itemPrice.trim() === '' || Number.isNaN(parsedPrice) || parsedPrice < 0) {
      setItemError('Please enter a valid price (0 or higher).');
      return;
    }

    if (activeForm.kind === 'add-item') {
      const baseSlug = slugify(trimmedName) || `item-${Date.now()}`;
      const uniqueSlug = data.menuItems.some((m) => m.slug === baseSlug)
        ? `${baseSlug}-${Date.now().toString().slice(-4)}`
        : baseSlug;

      const newItem: MenuItem = {
        id: `item-${Date.now()}`,
        categoryId: activeForm.categoryId,
        name: trimmedName,
        slug: uniqueSlug,
        description: itemDescription.trim(),
        price: parsedPrice,
        currency: itemCurrency,
        imageId: itemImageId,
        featured: itemFeatured,
      };
      onChange((prev) => ({
        ...prev,
        menuItems: [...prev.menuItems, newItem],
      }));
    } else if (activeForm.kind === 'edit-item') {
      onChange((prev) => ({
        ...prev,
        menuItems: prev.menuItems.map((m) =>
          m.id === activeForm.itemId
            ? {
                ...m,
                name: trimmedName,
                slug: slugify(trimmedName) || m.slug,
                description: itemDescription.trim(),
                price: parsedPrice,
                currency: itemCurrency,
                imageId: itemImageId,
                featured: itemFeatured,
              }
            : m
        ),
      }));
    }
    setActiveForm({ kind: 'none' });
  };

  const moveCategory = (index: number, direction: -1 | 1) => {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= data.menuCategories.length) return;
    onChange((prev) => {
      const copy = [...prev.menuCategories];
      const [moved] = copy.splice(index, 1);
      copy.splice(nextIndex, 0, moved);
      return { ...prev, menuCategories: copy };
    });
  };

  const moveItemInCategory = (categoryId: string, itemId: string, direction: -1 | 1) => {
    onChange((prev) => {
      const catItems = prev.menuItems.filter((i) => i.categoryId === categoryId);
      const otherItems = prev.menuItems.filter((i) => i.categoryId !== categoryId);
      const idx = catItems.findIndex((i) => i.id === itemId);
      const nextIdx = idx + direction;
      if (idx === -1 || nextIdx < 0 || nextIdx >= catItems.length) return prev;
      const reordered = [...catItems];
      const [moved] = reordered.splice(idx, 1);
      reordered.splice(nextIdx, 0, moved);
      return { ...prev, menuItems: [...otherItems, ...reordered] };
    });
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    if (deleteTarget.type === 'category') {
      onChange((prev) => ({
        ...prev,
        menuCategories: prev.menuCategories.filter((c) => c.id !== deleteTarget.id),
        menuItems: prev.menuItems.filter((i) => i.categoryId !== deleteTarget.id),
      }));
      if (
        (activeForm.kind === 'edit-category' && activeForm.categoryId === deleteTarget.id) ||
        (activeForm.kind === 'add-item' && activeForm.categoryId === deleteTarget.id)
      ) {
        setActiveForm({ kind: 'none' });
      }
    } else {
      onChange((prev) => ({
        ...prev,
        menuItems: prev.menuItems.filter((i) => i.id !== deleteTarget.id),
      }));
      if (activeForm.kind === 'edit-item' && activeForm.itemId === deleteTarget.id) {
        setActiveForm({ kind: 'none' });
      }
    }
    setDeleteTarget(null);
  };

  const renderCategoryForm = (heading: string) => (
    <form
      onSubmit={saveCategory}
      className="p-5 rounded-xl border border-[#1E3A2F]/35 bg-white space-y-4 shadow-xs"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-[#111827]">{heading}</h2>
      </div>
      <div className="space-y-3">
        <div className="space-y-1">
          <label className="block text-xs font-medium text-[#374151]">Category name *</label>
          <input
            type="text"
            autoFocus
            value={catName}
            onChange={(e) => {
              setCatName(e.target.value);
              if (catError) setCatError(null);
            }}
            placeholder="e.g. Traditional Coffee, Breakfast, Pastries"
            className={`w-full px-3.5 py-2 text-sm bg-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A2F] ${
              catError ? 'border-[#DC2626]' : 'border-[#D1D5DB]'
            }`}
          />
          {catError && <p className="text-xs text-[#DC2626]">{catError}</p>}
        </div>
        <div className="space-y-1">
          <label className="block text-xs font-medium text-[#374151]">
            Description (optional)
          </label>
          <input
            type="text"
            value={catDescription}
            onChange={(e) => setCatDescription(e.target.value)}
            placeholder="Short note shown beneath the category heading"
            className="w-full px-3.5 py-2 text-sm bg-white border border-[#D1D5DB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A2F]"
          />
        </div>
      </div>
      <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#F3F4F6]">
        <button
          type="button"
          onClick={() => setActiveForm({ kind: 'none' })}
          className="px-3.5 py-2 text-xs font-medium text-[#374151] bg-white border border-[#D1D5DB] rounded-lg hover:bg-[#F9FAFB]"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-xs font-medium text-white bg-[#1E3A2F] rounded-lg hover:bg-[#162C23]"
        >
          Save Category
        </button>
      </div>
    </form>
  );

  const renderItemForm = (heading: string) => {
    const selectedAsset = resolveMediaAsset(mediaAssets, itemImageId);
    return (
      <form
        onSubmit={saveItem}
        className="p-5 rounded-xl border border-[#1E3A2F]/35 bg-[#FAFBFB] space-y-4"
      >
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-sm font-semibold text-[#111827]">{heading}</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
          <div className="sm:col-span-7 space-y-1">
            <label className="block text-xs font-medium text-[#374151]">Item name *</label>
            <input
              type="text"
              autoFocus
              value={itemName}
              onChange={(e) => {
                setItemName(e.target.value);
                if (itemError) setItemError(null);
              }}
              placeholder="e.g. Traditional Jebena Buna"
              className="w-full px-3.5 py-2 text-sm bg-white border border-[#D1D5DB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A2F]"
            />
          </div>

          <div className="sm:col-span-3 space-y-1">
            <label className="block text-xs font-medium text-[#374151]">Price *</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={itemPrice}
              onChange={(e) => {
                setItemPrice(e.target.value);
                if (itemError) setItemError(null);
              }}
              placeholder="180"
              className="w-full px-3.5 py-2 text-sm bg-white border border-[#D1D5DB] rounded-lg tabular-nums focus:outline-none focus:ring-2 focus:ring-[#1E3A2F]"
            />
          </div>

          <div className="sm:col-span-2 space-y-1">
            <label className="block text-xs font-medium text-[#374151]">Currency</label>
            <select
              value={itemCurrency}
              onChange={(e) => setItemCurrency(e.target.value as CurrencyCode)}
              className="w-full px-2.5 py-2 text-sm bg-white border border-[#D1D5DB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A2F]"
            >
              {CURRENCIES.map((cur) => (
                <option key={cur} value={cur}>
                  {cur}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-medium text-[#374151]">Description</label>
          <textarea
            rows={2}
            value={itemDescription}
            onChange={(e) => setItemDescription(e.target.value)}
            placeholder="Ingredients, flavor notes, or serving style..."
            className="w-full px-3.5 py-2 text-sm bg-white border border-[#D1D5DB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E3A2F]"
          />
        </div>

        <ImageFieldControl
          label="Item photo"
          aspectClass="aspect-[4/3]"
          asset={selectedAsset}
          onOpenPicker={() =>
            onRequestImagePick('Select Menu Item Photo', itemImageId, (asset) =>
              setItemImageId(asset.id)
            )
          }
          onRemove={() => setItemImageId(null)}
        />

        <label className="flex items-center gap-2.5 cursor-pointer pt-1">
          <input
            type="checkbox"
            checked={itemFeatured}
            onChange={(e) => setItemFeatured(e.target.checked)}
            className="w-4 h-4 rounded border-[#D1D5DB] text-[#1E3A2F] focus:ring-[#1E3A2F]"
          />
          <span className="text-sm text-[#111827]">
            Feature this item on the homepage
          </span>
        </label>

        {itemError && <p className="text-xs text-[#DC2626]">{itemError}</p>}

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E5E7EB]">
          <button
            type="button"
            onClick={() => setActiveForm({ kind: 'none' })}
            className="px-3.5 py-2 text-xs font-medium text-[#374151] bg-white border border-[#D1D5DB] rounded-lg hover:bg-[#F3F4F6]"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-xs font-medium text-white bg-[#1E3A2F] rounded-lg hover:bg-[#162C23]"
          >
            Save Item
          </button>
        </div>
      </form>
    );
  };

  return (
    <div className="space-y-6">
      <EditorSectionHeader
        title="Menu"
        description="Organize your drinks and dishes into categories. Every menu item also gets its own detail page on your website."
        action={
          <button
            type="button"
            onClick={openAddCategory}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#1E3A2F] rounded-lg hover:bg-[#162C23] transition-colors whitespace-nowrap shrink-0"
          >
            <FolderPlus className="w-4 h-4" />
            Add Category
          </button>
        }
      />

      {activeForm.kind === 'add-category' && renderCategoryForm('New Menu Category')}

      {data.menuCategories.length === 0 ? (
        <div className="border border-dashed border-[#D1D5DB] rounded-xl p-12 text-center bg-white space-y-3">
          <p className="text-sm font-semibold text-[#111827]">No menu categories yet</p>
          <p className="text-xs text-[#6B7280] max-w-sm mx-auto leading-relaxed">
            Start by creating your first category—such as Signature Coffee, Breakfast, or Pastries.
          </p>
          <button
            type="button"
            onClick={openAddCategory}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-[#1E3A2F] rounded-lg hover:bg-[#162C23]"
          >
            <FolderPlus className="w-3.5 h-3.5" />
            Add First Category
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {data.menuCategories.map((category, catIdx) => {
            const categoryItems = data.menuItems.filter(
              (item) => item.categoryId === category.id
            );
            const isExpanded = expandedCategories[category.id] ?? true;
            const isEditingThisCategory =
              activeForm.kind === 'edit-category' && activeForm.categoryId === category.id;

            return (
              <div
                key={category.id}
                className="border border-[#E5E7EB] rounded-xl bg-white overflow-hidden"
              >
                {/* Category Header Row */}
                <div className="px-4 py-3.5 flex flex-wrap items-center justify-between gap-3 bg-white">
                  <button
                    type="button"
                    onClick={() => toggleCategory(category.id)}
                    aria-expanded={isExpanded}
                    className="flex items-center gap-2.5 min-w-0 flex-1 text-left focus-visible:outline-none"
                  >
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-[#6B7280] shrink-0" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-[#6B7280] shrink-0" />
                    )}
                    <div className="min-w-0">
                      <div className="flex items-baseline gap-2.5 flex-wrap">
                        <h2 className="text-sm font-semibold text-[#111827] truncate">
                          {category.name}
                        </h2>
                        <span className="text-xs text-[#6B7280] tabular-nums">
                          {categoryItems.length}{' '}
                          {categoryItems.length === 1 ? 'item' : 'items'}
                        </span>
                      </div>
                      {category.description && (
                        <p className="text-xs text-[#6B7280] truncate mt-0.5">
                          {category.description}
                        </p>
                      )}
                    </div>
                  </button>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      disabled={catIdx === 0}
                      onClick={() => moveCategory(catIdx, -1)}
                      aria-label={`Move ${category.name} up`}
                      className="p-1.5 rounded-lg text-[#6B7280] hover:bg-[#F3F4F6] disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={catIdx === data.menuCategories.length - 1}
                      onClick={() => moveCategory(catIdx, 1)}
                      aria-label={`Move ${category.name} down`}
                      className="p-1.5 rounded-lg text-[#6B7280] hover:bg-[#F3F4F6] disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => openEditCategory(category)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-[#374151] hover:bg-[#F3F4F6] rounded-lg transition-colors"
                    >
                      <Pencil className="w-3 h-3" />
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setDeleteTarget({
                          type: 'category',
                          id: category.id,
                          name: category.name,
                          itemCount: categoryItems.length,
                        })
                      }
                      aria-label={`Remove ${category.name}`}
                      className="p-1.5 rounded-lg text-[#6B7280] hover:text-[#DC2626] hover:bg-[#FEF2F2] transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Focused Category Edit Form (shown only on Edit click) */}
                {isEditingThisCategory && (
                  <div className="p-4 border-t border-[#E5E7EB] bg-[#F9FAFB]">
                    {renderCategoryForm(`Edit "${category.name}"`)}
                  </div>
                )}

                {/* Expanded Items Area */}
                {isExpanded && (
                  <div className="border-t border-[#F3F4F6] px-4 py-3 space-y-3 bg-[#FCFCFD]">
                    {categoryItems.length === 0 &&
                    !(activeForm.kind === 'add-item' && activeForm.categoryId === category.id) ? (
                      <div className="py-5 text-center space-y-2">
                        <p className="text-xs text-[#6B7280]">
                          No menu items in {category.name} yet.
                        </p>
                      </div>
                    ) : (
                      <div className="divide-y divide-[#E5E7EB] border border-[#E5E7EB] rounded-xl bg-white overflow-hidden">
                        {categoryItems.map((item, itemIdx) => {
                          const asset = resolveMediaAsset(mediaAssets, item.imageId);
                          const isEditingThisItem =
                            activeForm.kind === 'edit-item' && activeForm.itemId === item.id;

                          if (isEditingThisItem) {
                            return (
                              <div key={item.id} className="p-3 bg-[#F9FAFB]">
                                {renderItemForm(`Edit "${item.name}"`)}
                              </div>
                            );
                          }

                          return (
                            <div
                              key={item.id}
                              className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#F9FAFB] transition-colors"
                            >
                              <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                                <div className="w-14 h-14 rounded-lg overflow-hidden border border-[#E5E7EB] shrink-0 bg-[#F3F4F6]">
                                  <SafeImage
                                    src={asset?.url}
                                    alt={item.name}
                                    className="w-full h-full object-cover"
                                    fallbackLabel="No photo"
                                  />
                                </div>
                                <div className="min-w-0 space-y-0.5">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <h3 className="text-sm font-medium text-[#111827]">
                                      {item.name}
                                    </h3>
                                    <span className="text-xs font-semibold text-[#111827] tabular-nums">
                                      {formatPrice(item.price, item.currency)}
                                    </span>
                                    {item.featured && (
                                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#9A6B3B]">
                                        <Star className="w-3 h-3 fill-[#9A6B3B]" />
                                        Featured
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-xs text-[#6B7280] line-clamp-1">
                                    {item.description || 'No description added'}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-1 self-end sm:self-center shrink-0">
                                {onPreviewMenuItem && (
                                  <button
                                    type="button"
                                    onClick={() => onPreviewMenuItem(item.slug)}
                                    title="View item detail page in live preview"
                                    className="p-1.5 rounded-lg text-[#6B7280] hover:text-[#111827] hover:bg-[#F3F4F6]"
                                  >
                                    <Eye className="w-3.5 h-3.5" />
                                  </button>
                                )}
                                <button
                                  type="button"
                                  disabled={itemIdx === 0}
                                  onClick={() => moveItemInCategory(category.id, item.id, -1)}
                                  aria-label={`Move ${item.name} up`}
                                  className="p-1.5 rounded-lg text-[#6B7280] hover:bg-[#F3F4F6] disabled:opacity-30 disabled:cursor-not-allowed"
                                >
                                  <ArrowUp className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  disabled={itemIdx === categoryItems.length - 1}
                                  onClick={() => moveItemInCategory(category.id, item.id, 1)}
                                  aria-label={`Move ${item.name} down`}
                                  className="p-1.5 rounded-lg text-[#6B7280] hover:bg-[#F3F4F6] disabled:opacity-30 disabled:cursor-not-allowed"
                                >
                                  <ArrowDown className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => openEditItem(item)}
                                  className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-[#111827] bg-white border border-[#D1D5DB] rounded-lg hover:bg-[#F3F4F6]"
                                >
                                  <Pencil className="w-3 h-3" />
                                  Edit
                                </button>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setDeleteTarget({
                                      type: 'item',
                                      id: item.id,
                                      name: item.name,
                                    })
                                  }
                                  aria-label={`Remove ${item.name}`}
                                  className="p-1.5 rounded-lg text-[#6B7280] hover:text-[#DC2626] hover:bg-[#FEF2F2]"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Focused Add Item Form (only shown inside this category when Add Item is clicked) */}
                    {activeForm.kind === 'add-item' && activeForm.categoryId === category.id ? (
                      renderItemForm(`Add Item to ${category.name}`)
                    ) : (
                      <div>
                        <button
                          type="button"
                          onClick={() => openAddItem(category.id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#1E3A2F] hover:bg-[#1E3A2F]/8 rounded-lg transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          Add Item to {category.name}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <ConfirmDialog
        open={deleteTarget !== null}
        title={
          deleteTarget?.type === 'category'
            ? `Remove "${deleteTarget.name}" category?`
            : `Remove "${deleteTarget?.name}"?`
        }
        description={
          deleteTarget?.type === 'category'
            ? deleteTarget.itemCount > 0
              ? `This will remove the "${deleteTarget.name}" category along with its ${deleteTarget.itemCount} menu ${
                  deleteTarget.itemCount === 1 ? 'item' : 'items'
                }.`
              : `This will remove the empty "${deleteTarget.name}" category.`
            : 'This menu item will be removed from your menu and homepage featured section.'
        }
        confirmLabel={deleteTarget?.type === 'category' ? 'Remove Category' : 'Remove Item'}
        tone="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
