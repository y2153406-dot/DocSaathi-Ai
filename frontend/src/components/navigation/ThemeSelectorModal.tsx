"use client";

import React, { useState } from "react";
import { Modal } from "../common/Modal";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { ThemePreviewCard3D } from "../themes/ThemePreviewCard3D";
import { ThemeConfig } from "@/types/themes";

export function ThemeSelectorModal() {
  const { allThemes, themeId, isThemeModalOpen, setIsThemeModalOpen, setThemeById } = useTheme();
  const { t } = useLanguage();
  const [selectedPreview, setSelectedPreview] = useState<ThemeConfig | null>(null);

  const handleApplyTheme = (id: ThemeConfig["id"]) => {
    setThemeById(id);
    setIsThemeModalOpen(false);
  };

  return (
    <Modal
      isOpen={isThemeModalOpen}
      onClose={() => setIsThemeModalOpen(false)}
      maxWidth="4xl"
      title={t.settings.themeHeading}
      description="Select from 15 authentic cultural visual themes inspired by architectural jaalis, stepwells, Warli, Phulkari, Alpana, Dravidian gopurams, and manuscripts."
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-h-[60vh] overflow-y-auto p-1">
          {allThemes.map((config) => (
            <div key={config.id} className="cursor-pointer" onClick={() => setSelectedPreview(config)}>
              <ThemePreviewCard3D
                themeConfig={config}
                isActive={themeId === config.id}
                onApply={() => handleApplyTheme(config.id)}
              />
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
}
