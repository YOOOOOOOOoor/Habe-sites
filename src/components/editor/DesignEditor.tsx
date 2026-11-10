import React from 'react';
import { AlertTriangle, Check } from 'lucide-react';
import { DESIGN_PRESETS, TYPOGRAPHY_OPTIONS } from '../../data/initialSiteData';
import { CafeWebsiteData, DesignSettings } from '../../types/editor';
import { getContrastRatio } from '../../utils/siteHelpers';
import { EditorSectionHeader } from '../ui/EditorPrimitives';

interface DesignEditorProps {
  data: CafeWebsiteData;
  onChange: (updater: (prev: CafeWebsiteData) => CafeWebsiteData) => void;
}

export function DesignEditor({ data, onChange }: DesignEditorProps) {
  const { design } = data;
  const contrastRatio = getContrastRatio(design.backgroundColor, design.textColor);
  const lowContrast = contrastRatio < 4.5;

  const updateDesign = (patch: Partial<DesignSettings>) => {
    onChange((prev) => ({
      ...prev,
      design: {
        ...prev.design,
        ...patch,
      },
    }));
  };

  const applyPreset = (presetId: string) => {
    const preset = DESIGN_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    updateDesign({
      presetId: preset.id,
      primaryColor: preset.primaryColor,
      secondaryColor: preset.secondaryColor,
      backgroundColor: preset.backgroundColor,
      textColor: preset.textColor,
      typographyId: preset.typographyId,
    });
  };

  const colorFields: Array<{
    key: 'primaryColor' | 'secondaryColor' | 'backgroundColor' | 'textColor';
    label: string;
    helper: string;
  }> = [
    {
      key: 'primaryColor',
      label: 'Primary color',
      helper: 'Main buttons and active highlights',
    },
    {
      key: 'secondaryColor',
      label: 'Secondary color',
      helper: 'Subtle category labels and icons',
    },
    {
      key: 'backgroundColor',
      label: 'Background color',
      helper: 'Overall page surface canvas',
    },
    {
      key: 'textColor',
      label: 'Text color',
      helper: 'Headings and body paragraphs',
    },
  ];

  return (
    <div className="space-y-8">
      <EditorSectionHeader
        title="Design & Appearance"
        description="Customize your café’s colors, typography, and layout mood. Every change updates your live preview right away."
      />

      {/* Curated Palettes */}
      <section className="space-y-3">
        <div>
          <h2 className="text-sm font-semibold text-[#111827]">Curated Color & Mood Presets</h2>
          <p className="text-xs text-[#6B7280] mt-0.5">
            Start with a balanced look designed for cafés and restaurants, then fine-tune below.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {DESIGN_PRESETS.map((preset) => {
            const isSelected = design.presetId === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => applyPreset(preset.id)}
                className={`p-3.5 rounded-xl border text-left transition-colors flex items-start justify-between gap-3 ${
                  isSelected
                    ? 'border-[#1E3A2F] bg-[#1E3A2F]/[0.04] ring-1 ring-[#1E3A2F]'
                    : 'border-[#E5E7EB] bg-white hover:border-[#9CA3AF]'
                }`}
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-[#111827]">{preset.name}</span>
                  </div>
                  <p className="text-xs text-[#6B7280] leading-relaxed">{preset.description}</p>
                </div>
                <div className="flex items-center -space-x-1.5 shrink-0 pt-0.5">
                  {[
                    preset.backgroundColor,
                    preset.primaryColor,
                    preset.secondaryColor,
                    preset.textColor,
                  ].map((hex, i) => (
                    <span
                      key={i}
                      style={{ backgroundColor: hex }}
                      className="w-5 h-5 rounded-full border border-black/15 shadow-xs"
                    />
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Custom Color Swatches */}
      <section className="space-y-3 pt-2 border-t border-[#E5E7EB]">
        <div>
          <h2 className="text-sm font-semibold text-[#111827]">Brand Colors</h2>
          <p className="text-xs text-[#6B7280] mt-0.5">
            Click any swatch to pick a custom color matching your signage or menu printouts.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {colorFields.map((field) => (
            <label
              key={field.key}
              className="flex items-center justify-between gap-3 p-3 rounded-xl border border-[#E5E7EB] bg-white cursor-pointer hover:border-[#9CA3AF] transition-colors"
            >
              <div className="min-w-0">
                <span className="block text-sm font-medium text-[#111827]">{field.label}</span>
                <span className="block text-xs text-[#6B7280]">{field.helper}</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-mono text-[#4B5563] uppercase">
                  {design[field.key]}
                </span>
                <input
                  type="color"
                  value={design[field.key]}
                  onChange={(e) =>
                    updateDesign({
                      presetId: 'custom',
                      [field.key]: e.target.value,
                    })
                  }
                  className="w-8 h-8 rounded-lg border border-[#D1D5DB] cursor-pointer bg-transparent p-0"
                />
              </div>
            </label>
          ))}
        </div>

        {lowContrast && (
          <div className="p-3.5 rounded-xl border border-[#F59E0B]/50 bg-[#FFFBEB] flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 text-[#B45309] shrink-0 mt-0.5" />
            <p className="text-xs text-[#92400E] leading-relaxed">
              Your text and background colors are quite close in brightness (contrast{' '}
              <span className="font-mono tabular-nums">{contrastRatio.toFixed(1)}:1</span>). Choosing
              a darker text or lighter background will make your menu easier to read.
            </p>
          </div>
        )}
      </section>

      {/* Typography Pairings */}
      <section className="space-y-3 pt-2 border-t border-[#E5E7EB]">
        <div>
          <h2 className="text-sm font-semibold text-[#111827]">Typography</h2>
          <p className="text-xs text-[#6B7280] mt-0.5">
            Choose a curated heading and body font pairing.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {TYPOGRAPHY_OPTIONS.map((option) => {
            const isSelected = design.typographyId === option.id;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => updateDesign({ typographyId: option.id })}
                className={`p-4 rounded-xl border text-left transition-colors relative ${
                  isSelected
                    ? 'border-[#1E3A2F] bg-[#1E3A2F]/[0.04] ring-1 ring-[#1E3A2F]'
                    : 'border-[#E5E7EB] bg-white hover:border-[#9CA3AF]'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <span
                    style={{ fontFamily: option.displayFont }}
                    className="text-lg font-semibold text-[#111827]"
                  >
                    {option.name}
                  </span>
                  {isSelected && <Check className="w-4 h-4 text-[#1E3A2F] shrink-0 mt-1" />}
                </div>
                <p
                  style={{ fontFamily: option.bodyFont }}
                  className="text-xs text-[#6B7280] mt-1 leading-relaxed"
                >
                  {option.description}
                </p>
              </button>
            );
          })}
        </div>
      </section>

      {/* Template Appearance Options */}
      <section className="space-y-4 pt-2 border-t border-[#E5E7EB]">
        <div>
          <h2 className="text-sm font-semibold text-[#111827]">Layout & Shape Options</h2>
          <p className="text-xs text-[#6B7280] mt-0.5">
            Adjust how your homepage header, hero photo, and buttons are shaped.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <span className="block text-xs font-medium text-[#374151]">Hero style</span>
            <div className="grid grid-cols-2 gap-1 p-1 bg-[#F3F4F6] rounded-lg">
              {(
                [
                  { id: 'split', label: 'Split' },
                  { id: 'backdrop', label: 'Full Photo' },
                ] as const
              ).map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => updateDesign({ heroLayout: opt.id })}
                  className={`px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    design.heroLayout === opt.id
                      ? 'bg-white text-[#111827] shadow-xs'
                      : 'text-[#4B5563] hover:text-[#111827]'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <span className="block text-xs font-medium text-[#374151]">Corner roundness</span>
            <div className="grid grid-cols-3 gap-1 p-1 bg-[#F3F4F6] rounded-lg">
              {(
                [
                  { id: 'sharp', label: 'Crisp' },
                  { id: 'rounded', label: 'Soft' },
                  { id: 'soft', label: 'Pill' },
                ] as const
              ).map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => updateDesign({ cornerStyle: opt.id })}
                  className={`px-2 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    design.cornerStyle === opt.id
                      ? 'bg-white text-[#111827] shadow-xs'
                      : 'text-[#4B5563] hover:text-[#111827]'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <span className="block text-xs font-medium text-[#374151]">Navigation bar</span>
            <div className="grid grid-cols-2 gap-1 p-1 bg-[#F3F4F6] rounded-lg">
              {(
                [
                  { id: 'left', label: 'Classic' },
                  { id: 'centered', label: 'Centered' },
                ] as const
              ).map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => updateDesign({ headerStyle: opt.id })}
                  className={`px-2.5 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    design.headerStyle === opt.id
                      ? 'bg-white text-[#111827] shadow-xs'
                      : 'text-[#4B5563] hover:text-[#111827]'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
