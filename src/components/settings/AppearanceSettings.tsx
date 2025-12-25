import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardBody } from "../ui/Card";
import { Button } from "../ui/Button";
import { Sun, Moon, Monitor, Check } from "lucide-react";

type Theme = "light" | "dark" | "system";
type FontSize = "small" | "medium" | "large";

export const AppearanceSettings: React.FC = () => {
  const [selectedTheme, setSelectedTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem("theme");
    return (saved as Theme) || "light";
  });

  const [fontSize, setFontSize] = useState<FontSize>(() => {
    const saved = localStorage.getItem("fontSize");
    return (saved as FontSize) || "medium";
  });

  const [highContrast, setHighContrast] = useState<boolean>(() => {
    const saved = localStorage.getItem("highContrast");
    return saved === "true";
  });

  const [reduceMotion, setReduceMotion] = useState<boolean>(() => {
    const saved = localStorage.getItem("reduceMotion");
    return saved === "true";
  });

  const themes = [
    {
      id: "light" as Theme,
      label: "Light",
      icon: Sun,
      description: "Clean and bright interface",
      preview: "bg-white border-gray-300",
    },
    {
      id: "dark" as Theme,
      label: "Dark",
      icon: Moon,
      description: "Easy on the eyes in low light",
      preview: "bg-gray-900 border-gray-700",
    },
    {
      id: "system" as Theme,
      label: "System",
      icon: Monitor,
      description: "Follows your system settings",
      preview: "bg-gradient-to-br from-white to-gray-900 border-gray-500",
    },
  ];

  const fontSizes = [
    {
      id: "small" as FontSize,
      label: "Small",
      size: "14px",
      description: "Compact and space-efficient"
    },
    {
      id: "medium" as FontSize,
      label: "Medium",
      size: "16px",
      description: "Recommended for most users"
    },
    {
      id: "large" as FontSize,
      label: "Large",
      size: "18px",
      description: "Better readability"
    },
  ];

  // Apply theme changes
  useEffect(() => {
    localStorage.setItem("theme", selectedTheme);

    const root = document.documentElement;

    if (selectedTheme === "system") {
      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      root.classList.toggle("dark", isDark);
    } else {
      root.classList.toggle("dark", selectedTheme === "dark");
    }

    // TODO: Implement actual theme switching logic
    console.log("Theme changed to:", selectedTheme);
  }, [selectedTheme]);

  // Apply font size changes
  useEffect(() => {
    localStorage.setItem("fontSize", fontSize);

    const root = document.documentElement;
    const sizeMap = {
      small: "14px",
      medium: "16px",
      large: "18px",
    };

    root.style.fontSize = sizeMap[fontSize];
    console.log("Font size changed to:", fontSize);
  }, [fontSize]);

  // Apply high contrast
  useEffect(() => {
    localStorage.setItem("highContrast", highContrast.toString());
    document.documentElement.classList.toggle("high-contrast", highContrast);
    console.log("High contrast:", highContrast);
  }, [highContrast]);

  // Apply reduce motion
  useEffect(() => {
    localStorage.setItem("reduceMotion", reduceMotion.toString());
    document.documentElement.classList.toggle("reduce-motion", reduceMotion);
    console.log("Reduce motion:", reduceMotion);
  }, [reduceMotion]);

  const handleThemeChange = (theme: Theme) => {
    setSelectedTheme(theme);
  };

  const handleFontSizeChange = (size: FontSize) => {
    setFontSize(size);
  };

  return (
    <div className="space-y-6">
      {/* Theme Selection */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-medium text-gray-900">Theme</h2>
          <p className="text-sm text-gray-600">
            Choose how you want the interface to look
          </p>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {themes.map((theme) => {
              const Icon = theme.icon;
              const isSelected = selectedTheme === theme.id;
              return (
                <button
                  key={theme.id}
                  onClick={() => handleThemeChange(theme.id)}
                  className={`relative p-5 rounded-xl border-2 transition-all text-left group hover:shadow-md ${isSelected
                    ? "border-primary-500 bg-primary-50 shadow-sm"
                    : "border-gray-200 hover:border-gray-300"
                    }`}
                >
                  {isSelected && (
                    <div className="absolute top-3 right-3">
                      <div className="w-6 h-6 rounded-full bg-primary-600 flex items-center justify-center">
                        <Check size={14} className="text-white" />
                      </div>
                    </div>
                  )}

                  <div className={`w-12 h-12 rounded-lg ${theme.preview} border-2 mb-4 flex items-center justify-center`}>
                    <Icon
                      size={24}
                      className={
                        isSelected ? "text-primary-600" : "text-gray-600"
                      }
                    />
                  </div>

                  <h3 className="font-semibold text-gray-900 mb-1">
                    {theme.label}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {theme.description}
                  </p>
                </button>
              );
            })}
          </div>
        </CardBody>
      </Card>

      {/* Font Size */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-medium text-gray-900">Font Size</h2>
          <p className="text-sm text-gray-600">
            Adjust the text size for better readability
          </p>
        </CardHeader>
        <CardBody>
          <div className="space-y-3">
            {fontSizes.map((size) => {
              const isSelected = fontSize === size.id;
              return (
                <button
                  key={size.id}
                  onClick={() => handleFontSizeChange(size.id)}
                  className={`w-full p-4 rounded-xl border-2 transition-all text-left flex items-center justify-between group hover:shadow-sm ${isSelected
                    ? "border-primary-500 bg-primary-50"
                    : "border-gray-200 hover:border-gray-300"
                    }`}
                >
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {size.label}
                    </h3>
                    <p className="text-sm text-gray-600">{size.description}</p>
                    <p className="text-xs text-gray-500 mt-1 font-mono">
                      Base size: {size.size}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className="text-gray-700 font-medium"
                      style={{ fontSize: size.size }}
                    >
                      Aa
                    </span>
                    {isSelected && (
                      <div className="w-6 h-6 rounded-full bg-primary-600 flex items-center justify-center">
                        <Check size={14} className="text-white" />
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Preview:</strong> This text is displayed in your current selected font size setting.
            </p>
          </div>
        </CardBody>
      </Card>


      {/* Reset Settings */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-medium text-gray-900">
            Reset Appearance
          </h2>
        </CardHeader>
        <CardBody>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Reset all appearance settings to their default values
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSelectedTheme("light");
                setFontSize("medium");
                setHighContrast(false);
                setReduceMotion(false);
              }}
            >
              Reset to Defaults
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};