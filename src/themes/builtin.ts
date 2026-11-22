// Built-in themes, converted from the original FluentPro (Fluent-modded) Luau theme tables.
import type { ThemeDefinition } from "./types";

export const BuiltinThemeNames: string[] = [
  "Deep Violet",
  "Dark",
  "Charcoal",
  "Pearl White",
  "Blood Red",
  "Neon Purple",
  "Deep Ocean",
  "Midnight Blue",
  "Royal Blue",
  "Rose",
  "Neon Cyber",
  "Arctic Frost",
  "Cotton Candy",
  "Cyanic",
  "Amber Glow",
  "Bloomings",
  "Crimson",
  "Gold",
  "Lavender Pink",
  "AMOLED",
  "Ash Gray",
  "Galaxy Purple",
  "RGB"
];

export const BuiltinThemes: Record<string, ThemeDefinition> = {
  "AMOLED": {
    "AcrylicGradient": [
      [
        0,
        "#000000"
      ],
      [
        1,
        "#000000"
      ]
    ],
    "Name": "AMOLED",
    "Accent": "#ffffff",
    "AcrylicMain": "#000000",
    "AcrylicBorder": "#141414",
    "AcrylicNoise": 1,
    "TitleBarLine": "#161616",
    "Tab": "#1c1c1c",
    "Element": "#0a0a0a",
    "ElementBorder": "#000000",
    "InElementBorder": "#1e1e1e",
    "ElementTransparency": 0.96,
    "ToggleSlider": "#1e1e1e",
    "ToggleToggled": "#ffffff",
    "SliderRail": "#1e1e1e",
    "DropdownFrame": "#121212",
    "DropdownHolder": "#000000",
    "DropdownBorder": "#000000",
    "DropdownOption": "#161616",
    "Keybind": "#161616",
    "Input": "#0c0c0c",
    "InputFocused": "#000000",
    "InputIndicator": "#2d2d2d",
    "InputIndicatorFocus": "#ffffff",
    "Dialog": "#000000",
    "DialogHolder": "#000000",
    "DialogHolderLine": "#121212",
    "DialogButton": "#0a0a0a",
    "DialogButtonBorder": "#1c1c1c",
    "DialogBorder": "#161616",
    "DialogInput": "#0a0a0a",
    "DialogInputLine": "#2d2d2d",
    "Text": "#ffffff",
    "SubText": "#969696",
    "Hover": "#161616",
    "HoverChange": 0.03,
    "ShineEnabled": false,
    "StrokeShine": false,
    "StrokeDark": "#121212",
    "BackgroundTransparency": 0,
    "Shine": {
      "Speed": 0,
      "RotationSpeed": 0,
      "ColorSequence": [
        [
          0,
          "#000000"
        ],
        [
          1,
          "#000000"
        ]
      ]
    },
    "ButtonGradient": {
      "Background": [
        [
          0,
          "#0a0a0a"
        ],
        [
          1,
          "#000000"
        ]
      ],
      "Stroke": [
        [
          0,
          "#1e1e1e"
        ],
        [
          0.5,
          "#3c3c3c"
        ],
        [
          1,
          "#1e1e1e"
        ]
      ]
    },
    "ThemeAccentColors": [
      "#ffffff"
    ]
  },
  "Ash Gray": {
    "AcrylicGradient": [
      [
        0,
        "#282828"
      ],
      [
        1,
        "#282828"
      ]
    ],
    "Name": "Ash Gray",
    "Accent": "#969696",
    "AcrylicMain": "#3c3c3c",
    "AcrylicBorder": "#5a5a5a",
    "AcrylicNoise": 0.9,
    "TitleBarLine": "#4b4b4b",
    "Tab": "#787878",
    "Element": "#787878",
    "ElementBorder": "#232323",
    "InElementBorder": "#5a5a5a",
    "ElementTransparency": 0.87,
    "ToggleSlider": "#787878",
    "ToggleToggled": "#000000",
    "SliderRail": "#787878",
    "DropdownFrame": "#a0a0a0",
    "DropdownHolder": "#2d2d2d",
    "DropdownBorder": "#232323",
    "DropdownOption": "#787878",
    "Keybind": "#787878",
    "Input": "#a0a0a0",
    "InputFocused": "#0a0a0a",
    "InputIndicator": "#969696",
    "Dialog": "#2d2d2d",
    "DialogHolder": "#232323",
    "DialogHolderLine": "#1e1e1e",
    "DialogButton": "#2d2d2d",
    "DialogButtonBorder": "#505050",
    "DialogBorder": "#464646",
    "DialogInput": "#373737",
    "DialogInputLine": "#a0a0a0",
    "Text": "#f0f0f0",
    "SubText": "#aaaaaa",
    "Hover": "#787878",
    "HoverChange": 0.07,
    "ShineEnabled": true,
    "StrokeShine": true,
    "StrokeDark": "#5a5a5a",
    "Shine": {
      "Speed": 0.4,
      "RotationSpeed": 20,
      "ColorSequence": [
        [
          0,
          "#282828"
        ],
        [
          0.5,
          "#696969"
        ],
        [
          1,
          "#282828"
        ]
      ]
    },
    "ButtonGradient": {
      "Background": [
        [
          0,
          "#3c3c3c"
        ],
        [
          1,
          "#1e1e1e"
        ]
      ],
      "Stroke": [
        [
          0,
          "#3c3c3c"
        ],
        [
          0.5,
          "#787878"
        ],
        [
          1,
          "#3c3c3c"
        ]
      ]
    }
  },
  "Blood Red": {
    "AcrylicGradient": [
      [
        0,
        "#820c14"
      ],
      [
        1,
        "#1c0508"
      ]
    ],
    "Name": "Blood Red",
    "Accent": "#b40a14",
    "AcrylicMain": "#23080a",
    "AcrylicBorder": "#8c0f19",
    "AcrylicNoise": 0.9,
    "TitleBarLine": "#9b121c",
    "Tab": "#910f19",
    "Element": "#820c16",
    "ElementBorder": "#55080e",
    "InElementBorder": "#96121c",
    "ElementTransparency": 0.9,
    "ToggleSlider": "#b40a14",
    "ToggleToggled": "#ffe6e6",
    "SliderRail": "#910f19",
    "CheckboxUnchecked": "#910f19",
    "CheckboxChecked": "#b40a14",
    "CheckboxCheck": "#ffe6e6",
    "ProgressBarRail": "#910f19",
    "ProgressBarFill": "#b40a14",
    "DropdownFrame": "#730a12",
    "DropdownHolder": "#1c0508",
    "DropdownBorder": "#50070d",
    "DropdownOption": "#b40a14",
    "Keybind": "#820c16",
    "Input": "#730a12",
    "InputFocused": "#120305",
    "InputIndicator": "#dc3246",
    "Dialog": "#1c0508",
    "DialogHolder": "#120305",
    "DialogHolderLine": "#0c0203",
    "DialogButton": "#1c0508",
    "DialogButtonBorder": "#910f19",
    "DialogBorder": "#55080e",
    "DialogInput": "#320a0e",
    "DialogInputLine": "#dc3246",
    "Text": "#ffb4b4",
    "SubText": "#f06464",
    "IconColor": "#f06464",
    "Hover": "#b40a14",
    "HoverChange": 0.05,
    "ShineEnabled": true,
    "StrokeShine": true,
    "StrokeDark": "#910f19",
    "BackgroundTransparency": 0.15,
    "Shine": {
      "Speed": 0.5,
      "RotationSpeed": 25,
      "ColorSequence": [
        [
          0,
          "#470000"
        ],
        [
          0.5,
          "#9f0000"
        ],
        [
          1,
          "#470000"
        ]
      ]
    },
    "ButtonGradient": {
      "Background": [
        [
          0,
          "#8d0000"
        ],
        [
          1,
          "#470000"
        ]
      ],
      "Stroke": [
        [
          0,
          "#470000"
        ],
        [
          0.5,
          "#9f0000"
        ],
        [
          1,
          "#470000"
        ]
      ]
    },
    "ThemeAccentColors": [
      "#b40a14"
    ]
  },
  "Charcoal": {
    "AcrylicGradient": [
      [
        0,
        "#1e1e1e"
      ],
      [
        1,
        "#0a0a0a"
      ]
    ],
    "Name": "Charcoal",
    "Accent": "#666666",
    "AcrylicMain": "#141414",
    "AcrylicBorder": "#3c3c3c",
    "AcrylicNoise": 0.9,
    "TitleBarLine": "#464646",
    "Tab": "#282828",
    "Element": "#232323",
    "ElementBorder": "#3c3c3c",
    "InElementBorder": "#2d2d2d",
    "ElementTransparency": 0.9,
    "ToggleSlider": "#5aa0ff",
    "ToggleToggled": "#000000",
    "SliderRail": "#3c3c3c",
    "CheckboxUnchecked": "#3c3c3c",
    "CheckboxChecked": "#666666",
    "CheckboxCheck": "#000000",
    "ProgressBarRail": "#3c3c3c",
    "ProgressBarFill": "#666666",
    "DropdownFrame": "#1e1e1e",
    "DropdownHolder": "#141414",
    "DropdownBorder": "#3c3c3c",
    "DropdownOption": "#5aa0ff",
    "Keybind": "#232323",
    "Input": "#191919",
    "InputFocused": "#0f0f0f",
    "InputIndicator": "#78b4ff",
    "Dialog": "#191919",
    "DialogHolder": "#141414",
    "DialogHolderLine": "#0f0f0f",
    "DialogButton": "#191919",
    "DialogButtonBorder": "#3c3c3c",
    "DialogBorder": "#3c3c3c",
    "DialogInput": "#1e1e1e",
    "DialogInputLine": "#78b4ff",
    "Text": "#ffffff",
    "SubText": "#b9cde1",
    "IconColor": "#b9cde1",
    "Hover": "#5aa0ff",
    "HoverChange": 0.05,
    "ShineEnabled": true,
    "StrokeShine": true,
    "StrokeDark": "#3c3c3c",
    "Shine": {
      "Speed": 0.45,
      "RotationSpeed": 25,
      "ColorSequence": [
        [
          0,
          "#141414"
        ],
        [
          0.5,
          "#b4b4b4"
        ],
        [
          1,
          "#141414"
        ]
      ]
    },
    "ButtonGradient": {
      "Background": [
        [
          0,
          "#141414"
        ],
        [
          1,
          "#afafaf"
        ]
      ],
      "Stroke": [
        [
          0,
          "#141414"
        ],
        [
          0.5,
          "#b4b4b4"
        ],
        [
          1,
          "#141414"
        ]
      ]
    }
  },
  "Deep Ocean": {
    "AcrylicGradient": [
      [
        0,
        "#005078"
      ],
      [
        1,
        "#0a1928"
      ]
    ],
    "Name": "Deep Ocean",
    "Accent": "#0096c8",
    "AcrylicMain": "#0f1e2d",
    "AcrylicBorder": "#006496",
    "AcrylicNoise": 0.9,
    "TitleBarLine": "#0078b4",
    "Tab": "#006496",
    "Element": "#005a87",
    "ElementBorder": "#004669",
    "InElementBorder": "#006ea5",
    "ElementTransparency": 0.87,
    "ToggleSlider": "#0096c8",
    "ToggleToggled": "#ffffff",
    "SliderRail": "#006496",
    "CheckboxUnchecked": "#006496",
    "CheckboxChecked": "#0096c8",
    "CheckboxCheck": "#ffffff",
    "ProgressBarRail": "#006496",
    "ProgressBarFill": "#0096c8",
    "DropdownFrame": "#005078",
    "DropdownHolder": "#0a1928",
    "DropdownBorder": "#004669",
    "DropdownOption": "#0096c8",
    "Keybind": "#005a87",
    "Input": "#005078",
    "InputFocused": "#051423",
    "InputIndicator": "#00c8ff",
    "Dialog": "#0a1928",
    "DialogHolder": "#050f19",
    "DialogHolderLine": "#000a14",
    "DialogButton": "#0a1928",
    "DialogButtonBorder": "#006496",
    "DialogBorder": "#004669",
    "DialogInput": "#0f2337",
    "DialogInputLine": "#00c8ff",
    "Text": "#c8e6fc",
    "SubText": "#5fc3f0",
    "IconColor": "#5fc3f0",
    "Hover": "#0096c8",
    "HoverChange": 0.05,
    "ShineEnabled": true,
    "StrokeShine": true,
    "StrokeDark": "#006496",
    "Shine": {
      "Speed": 0.5,
      "RotationSpeed": 25,
      "ColorSequence": [
        [
          0,
          "#003c5a"
        ],
        [
          0.5,
          "#00c8ff"
        ],
        [
          1,
          "#003c5a"
        ]
      ]
    },
    "ButtonGradient": {
      "Background": [
        [
          0,
          "#0078b4"
        ],
        [
          1,
          "#003c5a"
        ]
      ],
      "Stroke": [
        [
          0,
          "#006496"
        ],
        [
          0.5,
          "#00c8ff"
        ],
        [
          1,
          "#006496"
        ]
      ]
    }
  },
  "Galaxy Purple": {
    "AcrylicGradient": [
      [
        0,
        "#6e23af"
      ],
      [
        1,
        "#080314"
      ]
    ],
    "Name": "Galaxy Purple",
    "Accent": "#a03cdc",
    "AcrylicMain": "#0c0519",
    "AcrylicBorder": "#7828b9",
    "AcrylicNoise": 0.9,
    "TitleBarLine": "#8232c3",
    "Tab": "#7d2dbe",
    "Element": "#7028aa",
    "ElementBorder": "#4b1973",
    "InElementBorder": "#8232c3",
    "ElementTransparency": 0.87,
    "ToggleSlider": "#a03cdc",
    "ToggleToggled": "#ffffff",
    "SliderRail": "#7d2dbe",
    "DropdownFrame": "#642398",
    "DropdownHolder": "#080314",
    "DropdownBorder": "#48186c",
    "DropdownOption": "#a03cdc",
    "Keybind": "#7028aa",
    "Input": "#642398",
    "InputFocused": "#05020e",
    "InputIndicator": "#c364ff",
    "Dialog": "#080314",
    "DialogHolder": "#05020e",
    "DialogHolderLine": "#030109",
    "DialogButton": "#080314",
    "DialogButtonBorder": "#7d2dbe",
    "DialogBorder": "#4b1973",
    "DialogInput": "#160a32",
    "DialogInputLine": "#c364ff",
    "Text": "#f2e8ff",
    "SubText": "#c8b2e4",
    "Hover": "#a03cdc",
    "HoverChange": 0.05,
    "ShineEnabled": true,
    "StrokeShine": true,
    "StrokeDark": "#7d2dbe",
    "Shine": {
      "Speed": 0.5,
      "RotationSpeed": 25,
      "ColorSequence": [
        [
          0,
          "#301255"
        ],
        [
          0.5,
          "#c364ff"
        ],
        [
          1,
          "#301255"
        ]
      ]
    },
    "ButtonGradient": {
      "Background": [
        [
          0,
          "#8232c3"
        ],
        [
          1,
          "#301255"
        ]
      ],
      "Stroke": [
        [
          0,
          "#7d2dbe"
        ],
        [
          0.5,
          "#c364ff"
        ],
        [
          1,
          "#7d2dbe"
        ]
      ]
    }
  },
  "Midnight Blue": {
    "AcrylicGradient": [
      [
        0,
        "#322378"
      ],
      [
        1,
        "#080514"
      ]
    ],
    "Name": "Midnight Blue",
    "Accent": "#6450c8",
    "AcrylicMain": "#0a0819",
    "AcrylicBorder": "#3c2d8c",
    "AcrylicNoise": 0.9,
    "TitleBarLine": "#503caa",
    "Tab": "#3c2d8c",
    "Element": "#37287d",
    "ElementBorder": "#281e5a",
    "InElementBorder": "#46379b",
    "ElementTransparency": 0.87,
    "ToggleSlider": "#6450c8",
    "ToggleToggled": "#ffffff",
    "SliderRail": "#3c2d8c",
    "CheckboxUnchecked": "#3c2d8c",
    "CheckboxChecked": "#6450c8",
    "CheckboxCheck": "#ffffff",
    "ProgressBarRail": "#3c2d8c",
    "ProgressBarFill": "#6450c8",
    "DropdownFrame": "#2d1e6e",
    "DropdownHolder": "#080514",
    "DropdownBorder": "#231955",
    "DropdownOption": "#6450c8",
    "Keybind": "#37287d",
    "Input": "#2d1e6e",
    "InputFocused": "#05030f",
    "InputIndicator": "#8c78f0",
    "Dialog": "#080514",
    "DialogHolder": "#05030f",
    "DialogHolderLine": "#03020a",
    "DialogButton": "#080514",
    "DialogButtonBorder": "#3c2d8c",
    "DialogBorder": "#281e5a",
    "DialogInput": "#0f0a23",
    "DialogInputLine": "#8c78f0",
    "Text": "#c3c3f8",
    "SubText": "#8282f0",
    "IconColor": "#8282f0",
    "Hover": "#6450c8",
    "HoverChange": 0.05,
    "ShineEnabled": true,
    "StrokeShine": true,
    "StrokeDark": "#3c2d8c",
    "Shine": {
      "Speed": 0.5,
      "RotationSpeed": 25,
      "ColorSequence": [
        [
          0,
          "#190f3c"
        ],
        [
          0.5,
          "#8c78f0"
        ],
        [
          1,
          "#190f3c"
        ]
      ]
    },
    "ButtonGradient": {
      "Background": [
        [
          0,
          "#503caa"
        ],
        [
          1,
          "#190f3c"
        ]
      ],
      "Stroke": [
        [
          0,
          "#3c2d8c"
        ],
        [
          0.5,
          "#8c78f0"
        ],
        [
          1,
          "#3c2d8c"
        ]
      ]
    }
  },
  "Neon Cyber": {
    "AcrylicGradient": [
      [
        0,
        "#0a190a"
      ],
      [
        1,
        "#030803"
      ]
    ],
    "Name": "Neon Cyber",
    "Accent": "#39ff14",
    "AcrylicMain": "#050a05",
    "AcrylicBorder": "#28c814",
    "AcrylicNoise": 0.93,
    "TitleBarLine": "#23a00f",
    "Tab": "#39ff14",
    "Element": "#0a160a",
    "ElementBorder": "#030803",
    "InElementBorder": "#23a00f",
    "ElementTransparency": 0.88,
    "ToggleSlider": "#39ff14",
    "ToggleToggled": "#000000",
    "SliderRail": "#39ff14",
    "CheckboxUnchecked": "#39ff14",
    "CheckboxChecked": "#39ff14",
    "CheckboxCheck": "#000000",
    "ProgressBarRail": "#39ff14",
    "ProgressBarFill": "#39ff14",
    "DropdownFrame": "#23a00f",
    "DropdownHolder": "#050c05",
    "DropdownBorder": "#23a00f",
    "DropdownOption": "#39ff14",
    "Keybind": "#28c812",
    "Input": "#0a160a",
    "InputFocused": "#030703",
    "InputIndicator": "#39ff14",
    "InputIndicatorFocus": "#82ff50",
    "Dialog": "#050c05",
    "DialogHolder": "#030803",
    "DialogHolderLine": "#23a00f",
    "DialogButton": "#081208",
    "DialogButtonBorder": "#39ff14",
    "DialogBorder": "#28c812",
    "DialogInput": "#0a160a",
    "DialogInputLine": "#39ff14",
    "Text": "#82ff8c",
    "SubText": "#3cf528",
    "IconColor": "#3cf528",
    "Hover": "#0f280f",
    "HoverChange": 0.05,
    "ShineEnabled": true,
    "StrokeShine": true,
    "StrokeDark": "#23a00f",
    "BackgroundTransparency": 0,
    "Shine": {
      "Speed": 0.8,
      "RotationSpeed": 30,
      "ColorSequence": [
        [
          0,
          "#051e05"
        ],
        [
          0.5,
          "#39ff14"
        ],
        [
          1,
          "#051e05"
        ]
      ]
    },
    "ButtonGradient": {
      "Background": [
        [
          0,
          "#081608"
        ],
        [
          1,
          "#030803"
        ]
      ],
      "Stroke": [
        [
          0,
          "#23a00f"
        ],
        [
          0.5,
          "#39ff14"
        ],
        [
          1,
          "#23a00f"
        ]
      ]
    },
    "ThemeAccentColors": [
      "#39ff14"
    ]
  },
  "Neon Purple": {
    "AcrylicGradient": [
      [
        0,
        "#05000f"
      ],
      [
        1,
        "#2d00a0"
      ]
    ],
    "Name": "Neon Purple",
    "Accent": "#b400ff",
    "AcrylicMain": "#05000f",
    "AcrylicBorder": "#8c00ff",
    "AcrylicNoise": 0.9,
    "TitleBarLine": "#a000ff",
    "Tab": "#8200e6",
    "Element": "#7800d2",
    "ElementBorder": "#320064",
    "InElementBorder": "#9b00f5",
    "ElementTransparency": 0.87,
    "ToggleSlider": "#b400ff",
    "ToggleToggled": "#0f0028",
    "SliderRail": "#8200e6",
    "CheckboxUnchecked": "#8200e6",
    "CheckboxChecked": "#b400ff",
    "CheckboxCheck": "#0f0028",
    "ProgressBarRail": "#8200e6",
    "ProgressBarFill": "#b400ff",
    "DropdownFrame": "#ffffff",
    "DropdownHolder": "#0a001e",
    "DropdownBorder": "#32008c",
    "DropdownOption": "#b400ff",
    "Keybind": "#7800d2",
    "Input": "#ffffff",
    "InputFocused": "#140032",
    "InputIndicator": "#c800ff",
    "Dialog": "#0a001e",
    "DialogHolder": "#050014",
    "DialogHolderLine": "#03000c",
    "DialogButton": "#0a001e",
    "DialogButtonBorder": "#8c00ff",
    "DialogBorder": "#320078",
    "DialogInput": "#19003c",
    "DialogInputLine": "#c800ff",
    "Text": "#ebc8ff",
    "SubText": "#be91ff",
    "IconColor": "#be91ff",
    "Hover": "#9600ff",
    "HoverChange": 0.07,
    "ShineEnabled": true,
    "StrokeShine": true,
    "StrokeDark": "#3c0096",
    "Shine": {
      "Speed": 0.4,
      "RotationSpeed": 20,
      "ColorSequence": [
        [
          0,
          "#200589"
        ],
        [
          0.5,
          "#ab20fd"
        ],
        [
          1,
          "#200589"
        ]
      ]
    },
    "ButtonGradient": {
      "Background": [
        [
          0,
          "#7d12ff"
        ],
        [
          1,
          "#200589"
        ]
      ],
      "Stroke": [
        [
          0,
          "#7d12ff"
        ],
        [
          0.5,
          "#ab20fd"
        ],
        [
          1,
          "#7d12ff"
        ]
      ]
    }
  },
  "Pearl White": {
    "AcrylicGradient": [
      [
        0,
        "#ffffff"
      ],
      [
        1,
        "#dcdcdc"
      ]
    ],
    "Name": "Pearl White",
    "Accent": "#d6d6d6",
    "AcrylicMain": "#f0f0f0",
    "AcrylicBorder": "#c8c8c8",
    "AcrylicNoise": 0.9,
    "TitleBarLine": "#c8c8c8",
    "Tab": "#e6e6e6",
    "Element": "#dcdcdc",
    "ElementBorder": "#c8c8c8",
    "InElementBorder": "#d2d2d2",
    "ElementTransparency": 0.9,
    "ToggleSlider": "#3ca0ff",
    "ToggleToggled": "#ffffff",
    "SliderRail": "#c8c8c8",
    "CheckboxUnchecked": "#c8c8c8",
    "CheckboxChecked": "#d6d6d6",
    "CheckboxCheck": "#ffffff",
    "ProgressBarRail": "#c8c8c8",
    "ProgressBarFill": "#d6d6d6",
    "DropdownFrame": "#e6e6e6",
    "DropdownHolder": "#dcdcdc",
    "DropdownBorder": "#c8c8c8",
    "DropdownOption": "#3ca0ff",
    "Keybind": "#dcdcdc",
    "Input": "#e6e6e6",
    "InputFocused": "#d2d2d2",
    "InputIndicator": "#3ca0ff",
    "Dialog": "#e6e6e6",
    "DialogHolder": "#dcdcdc",
    "DialogHolderLine": "#d2d2d2",
    "DialogButton": "#e6e6e6",
    "DialogButtonBorder": "#c8c8c8",
    "DialogBorder": "#c8c8c8",
    "DialogInput": "#f0f0f0",
    "DialogInputLine": "#3ca0ff",
    "Text": "#141414",
    "SubText": "#5a5a5a",
    "IconColor": "#5a5a5a",
    "Hover": "#3ca0ff",
    "HoverChange": 0.05,
    "ShineEnabled": true,
    "StrokeShine": true,
    "StrokeDark": "#c8c8c8",
    "Shine": {
      "Speed": 0.4,
      "RotationSpeed": 20,
      "ColorSequence": [
        [
          0,
          "#c8c8c8"
        ],
        [
          0.5,
          "#ffffff"
        ],
        [
          1,
          "#c8c8c8"
        ]
      ]
    },
    "ButtonGradient": {
      "Background": [
        [
          0,
          "#ffffff"
        ],
        [
          1,
          "#b4b4b4"
        ]
      ],
      "Stroke": [
        [
          0,
          "#a0a0a0"
        ],
        [
          0.5,
          "#ffffff"
        ],
        [
          1,
          "#a0a0a0"
        ]
      ]
    }
  },
  "RGB": {
    "AcrylicGradient": [
      [
        0,
        "#140028"
      ],
      [
        0.5,
        "#001432"
      ],
      [
        1,
        "#1e001e"
      ]
    ],
    "Name": "RGB",
    "Accent": "#00ffb4",
    "AcrylicMain": "#08080e",
    "AcrylicBorder": "#00ffb4",
    "AcrylicNoise": 0.95,
    "TitleBarLine": "#00c88c",
    "Tab": "#00c8a0",
    "Element": "#141423",
    "ElementBorder": "#05050c",
    "InElementBorder": "#00c8a0",
    "ElementTransparency": 0.88,
    "ToggleSlider": "#00b48c",
    "ToggleToggled": "#000000",
    "SliderRail": "#00c8a0",
    "DropdownFrame": "#00c8a0",
    "DropdownHolder": "#080814",
    "DropdownBorder": "#00c8a0",
    "DropdownOption": "#00c8a0",
    "Keybind": "#00c8a0",
    "Input": "#141428",
    "InputFocused": "#05050c",
    "InputIndicator": "#00b48c",
    "InputIndicatorFocus": "#00ffc8",
    "Dialog": "#080814",
    "DialogHolder": "#05050f",
    "DialogHolderLine": "#00c8a0",
    "DialogButton": "#0a0a16",
    "DialogButtonBorder": "#00c8a0",
    "DialogBorder": "#00c8a0",
    "DialogInput": "#0f0f1e",
    "DialogInputLine": "#00c8a0",
    "Text": "#dcfff5",
    "SubText": "#64dcbe",
    "Hover": "#003228",
    "HoverChange": 0.05,
    "ShineEnabled": true,
    "StrokeShine": true,
    "StrokeDark": "#00b48c",
    "BackgroundTransparency": 0,
    "IsRGB": true,
    "Shine": {
      "Speed": 1.2,
      "RotationSpeed": 40,
      "ColorSequence": [
        [
          0,
          "#00ffb4"
        ],
        [
          0.33,
          "#7800ff"
        ],
        [
          0.66,
          "#ff0096"
        ],
        [
          1,
          "#00ffb4"
        ]
      ]
    },
    "ButtonGradient": {
      "Background": [
        [
          0,
          "#00281e"
        ],
        [
          1,
          "#00140f"
        ]
      ],
      "Stroke": [
        [
          0,
          "#00ffb4"
        ],
        [
          0.5,
          "#7800ff"
        ],
        [
          1,
          "#00ffb4"
        ]
      ]
    },
    "ThemeAccentColors": [
      "#00ffb4",
      "#7800ff",
      "#ff0096"
    ]
  },
  "Royal Blue": {
    "AcrylicGradient": [
      [
        0,
        "#0c46a0"
      ],
      [
        1,
        "#08142d"
      ]
    ],
    "Name": "Royal Blue",
    "Accent": "#0f52ba",
    "AcrylicMain": "#0a1932",
    "AcrylicBorder": "#0a4196",
    "AcrylicNoise": 0.9,
    "TitleBarLine": "#0d4baa",
    "Tab": "#0a4196",
    "Element": "#093a87",
    "ElementBorder": "#06285f",
    "InElementBorder": "#0b46a0",
    "ElementTransparency": 0.87,
    "ToggleSlider": "#0f52ba",
    "ToggleToggled": "#ffffff",
    "SliderRail": "#0a4196",
    "CheckboxUnchecked": "#0a4196",
    "CheckboxChecked": "#0f52ba",
    "CheckboxCheck": "#ffffff",
    "ProgressBarRail": "#0a4196",
    "ProgressBarFill": "#0f52ba",
    "DropdownFrame": "#083278",
    "DropdownHolder": "#08142d",
    "DropdownBorder": "#06285f",
    "DropdownOption": "#0f52ba",
    "Keybind": "#093a87",
    "Input": "#083278",
    "InputFocused": "#050f23",
    "InputIndicator": "#3278e6",
    "Dialog": "#08142d",
    "DialogHolder": "#050f23",
    "DialogHolderLine": "#030a19",
    "DialogButton": "#08142d",
    "DialogButtonBorder": "#0a4196",
    "DialogBorder": "#06285f",
    "DialogInput": "#0c1e41",
    "DialogInputLine": "#3278e6",
    "Text": "#b9d7ff",
    "SubText": "#6ea5f0",
    "IconColor": "#6ea5f0",
    "Hover": "#0f52ba",
    "HoverChange": 0.05,
    "ShineEnabled": true,
    "StrokeShine": true,
    "StrokeDark": "#0a4196",
    "Shine": {
      "Speed": 0.5,
      "RotationSpeed": 25,
      "ColorSequence": [
        [
          0,
          "#142855"
        ],
        [
          0.5,
          "#3278e6"
        ],
        [
          1,
          "#142855"
        ]
      ]
    },
    "ButtonGradient": {
      "Background": [
        [
          0,
          "#0d4baa"
        ],
        [
          1,
          "#142855"
        ]
      ],
      "Stroke": [
        [
          0,
          "#0a4196"
        ],
        [
          0.5,
          "#3278e6"
        ],
        [
          1,
          "#0a4196"
        ]
      ]
    }
  },
  "Deep Violet": {
    "AcrylicGradient": [
      [
        0,
        "#55398b"
      ],
      [
        1,
        "#281941"
      ]
    ],
    "Name": "Deep Violet",
    "Accent": "#613ea7",
    "AcrylicMain": "#141414",
    "AcrylicBorder": "#6e5a82",
    "AcrylicNoise": 0.92,
    "TitleBarLine": "#5f4b6e",
    "Tab": "#a08cb4",
    "Element": "#8c78a0",
    "ElementBorder": "#3c3246",
    "InElementBorder": "#645a6e",
    "ElementTransparency": 0.87,
    "ToggleSlider": "#8c78a0",
    "ToggleToggled": "#000000",
    "SliderRail": "#8c78a0",
    "CheckboxUnchecked": "#8c78a0",
    "CheckboxChecked": "#613ea7",
    "CheckboxCheck": "#000000",
    "ProgressBarRail": "#8c78a0",
    "ProgressBarFill": "#613ea7",
    "DropdownFrame": "#aaa0c8",
    "DropdownHolder": "#3c2d50",
    "DropdownBorder": "#322841",
    "DropdownOption": "#8c78a0",
    "Keybind": "#8c78a0",
    "Input": "#8c78a0",
    "InputFocused": "#140a1e",
    "InputIndicator": "#aa96be",
    "Dialog": "#3c2d50",
    "DialogHolder": "#2d1e41",
    "DialogHolderLine": "#28193c",
    "DialogButton": "#3c2d50",
    "DialogButtonBorder": "#5f506e",
    "DialogBorder": "#554664",
    "DialogInput": "#463755",
    "DialogInputLine": "#afa0be",
    "Text": "#fffaff",
    "SubText": "#d7c3fa",
    "IconColor": "#d7c3fa",
    "Hover": "#8c78a0",
    "HoverChange": 0.04,
    "ShineEnabled": true,
    "StrokeShine": true,
    "StrokeDark": "#6e5a82",
    "BackgroundTransparency": 0.15,
    "Shine": {
      "Speed": 0.5,
      "RotationSpeed": 25,
      "ColorSequence": [
        [
          0,
          "#281941"
        ],
        [
          0.5,
          "#a078dc"
        ],
        [
          1,
          "#281941"
        ]
      ]
    },
    "ButtonGradient": {
      "Background": [
        [
          0,
          "#281941"
        ],
        [
          1,
          "#a078dc"
        ]
      ],
      "Stroke": [
        [
          0,
          "#281941"
        ],
        [
          0.5,
          "#a078dc"
        ],
        [
          1,
          "#281941"
        ]
      ]
    }
  },
  "Dark": {
    "AcrylicGradient": [
      [
        0,
        "#282828"
      ],
      [
        1,
        "#282828"
      ]
    ],
    "Name": "Dark",
    "Accent": "#969696",
    "AcrylicMain": "#3c3c3c",
    "AcrylicBorder": "#5a5a5a",
    "AcrylicNoise": 0.9,
    "TitleBarLine": "#4b4b4b",
    "Tab": "#787878",
    "Element": "#787878",
    "ElementBorder": "#232323",
    "InElementBorder": "#5a5a5a",
    "ElementTransparency": 0.87,
    "ToggleSlider": "#787878",
    "ToggleToggled": "#000000",
    "SliderRail": "#787878",
    "CheckboxUnchecked": "#787878",
    "CheckboxChecked": "#969696",
    "CheckboxCheck": "#000000",
    "ProgressBarRail": "#787878",
    "ProgressBarFill": "#969696",
    "DropdownFrame": "#a0a0a0",
    "DropdownHolder": "#2d2d2d",
    "DropdownBorder": "#232323",
    "DropdownOption": "#787878",
    "Keybind": "#787878",
    "Input": "#a0a0a0",
    "InputFocused": "#0a0a0a",
    "InputIndicator": "#969696",
    "Dialog": "#2d2d2d",
    "DialogHolder": "#232323",
    "DialogHolderLine": "#1e1e1e",
    "DialogButton": "#2d2d2d",
    "DialogButtonBorder": "#505050",
    "DialogBorder": "#464646",
    "DialogInput": "#373737",
    "DialogInputLine": "#a0a0a0",
    "Text": "#ffffff",
    "SubText": "#b9b9b9",
    "IconColor": "#b9b9b9",
    "Hover": "#787878",
    "HoverChange": 0.07,
    "ShineEnabled": true,
    "StrokeShine": true,
    "StrokeDark": "#5a5a5a",
    "ViewportBackground": "#0f0f14",
    "ViewportBackgroundImages": true,
    "DropdownOutsideWindowBackground": "#232323",
    "DropdownOutsideWindowBackgroundImages": true,
    "ElementBorderThickness": 1,
    "DropdownBorderThickness": 1,
    "DiscordJoinButton": "#5865f2",
    "WarningNotifyColor": "#ffb91e",
    "SuccessNotifyColor": "#32cd50",
    "ErrorNotifyColor": "#dc3737",
    "InfoNotifyColor": "#4cc2ff",
    "Shine": {
      "Speed": 0.4,
      "RotationSpeed": 20,
      "ColorSequence": [
        [
          0,
          "#282828"
        ],
        [
          0.5,
          "#696969"
        ],
        [
          1,
          "#282828"
        ]
      ]
    },
    "ButtonGradient": {
      "Background": [
        [
          0,
          "#3c3c3c"
        ],
        [
          1,
          "#1e1e1e"
        ]
      ],
      "Stroke": [
        [
          0,
          "#3c3c3c"
        ],
        [
          0.5,
          "#787878"
        ],
        [
          1,
          "#3c3c3c"
        ]
      ]
    }
  },
  "Rose": {
    "AcrylicGradient": [
      [
        0,
        "#502837"
      ],
      [
        1,
        "#190f12"
      ]
    ],
    "Name": "Rose",
    "Accent": "#ff78a0",
    "AcrylicMain": "#191416",
    "AcrylicBorder": "#78465a",
    "AcrylicNoise": 0.9,
    "TitleBarLine": "#b45a78",
    "Tab": "#462832",
    "Element": "#3c232d",
    "ElementBorder": "#78465a",
    "InElementBorder": "#502d3c",
    "ElementTransparency": 0.9,
    "ToggleSlider": "#ff78a0",
    "ToggleToggled": "#000000",
    "SliderRail": "#78465a",
    "CheckboxUnchecked": "#78465a",
    "CheckboxChecked": "#ff78a0",
    "CheckboxCheck": "#000000",
    "ProgressBarRail": "#78465a",
    "ProgressBarFill": "#ff78a0",
    "DropdownFrame": "#321e28",
    "DropdownHolder": "#23141c",
    "DropdownBorder": "#78465a",
    "DropdownOption": "#ff78a0",
    "Keybind": "#3c232d",
    "Input": "#2d1920",
    "InputFocused": "#1e0f14",
    "InputIndicator": "#ffaac8",
    "InputIndicatorFocus": "#ffc8dc",
    "Dialog": "#2d1920",
    "DialogHolder": "#1e1216",
    "DialogHolderLine": "#190e12",
    "DialogButton": "#2d1920",
    "DialogButtonBorder": "#78465a",
    "DialogBorder": "#78465a",
    "DialogInput": "#3c232d",
    "DialogInputLine": "#ffaac8",
    "Text": "#ffaac8",
    "SubText": "#f078a0",
    "IconColor": "#f078a0",
    "Hover": "#ff78a0",
    "HoverChange": 0.05,
    "ShineEnabled": true,
    "StrokeShine": true,
    "StrokeDark": "#78465a",
    "BackgroundTransparency": 0,
    "Shine": {
      "Speed": 0.5,
      "RotationSpeed": 25,
      "ColorSequence": [
        [
          0,
          "#28141e"
        ],
        [
          0.5,
          "#ffa0be"
        ],
        [
          1,
          "#28141e"
        ]
      ]
    },
    "ButtonGradient": {
      "Background": [
        [
          0,
          "#ffa0be"
        ],
        [
          1,
          "#3c1e28"
        ]
      ],
      "Stroke": [
        [
          0,
          "#78465a"
        ],
        [
          0.5,
          "#ffa0be"
        ],
        [
          1,
          "#78465a"
        ]
      ]
    },
    "ThemeAccentColors": [
      "#ff78a0"
    ]
  },
  "Arctic Frost": {
    "AcrylicGradient": [
      [
        0,
        "#ebf8ff"
      ],
      [
        1,
        "#d2ebfa"
      ]
    ],
    "Name": "Arctic Frost",
    "Accent": "#64b4f0",
    "AcrylicMain": "#b9d7eb",
    "AcrylicBorder": "#c8e4f8",
    "AcrylicNoise": 0.97,
    "TitleBarLine": "#b4d7f0",
    "Tab": "#5a96c8",
    "Element": "#d2ebfa",
    "ElementBorder": "#aac8e1",
    "InElementBorder": "#8cb9da",
    "ElementTransparency": 0.65,
    "ToggleSlider": "#78afd7",
    "ToggleToggled": "#1e4678",
    "SliderRail": "#96c8eb",
    "CheckboxUnchecked": "#96c8eb",
    "CheckboxChecked": "#64b4f0",
    "CheckboxCheck": "#1e4678",
    "ProgressBarRail": "#96c8eb",
    "ProgressBarFill": "#64b4f0",
    "DropdownFrame": "#bee1f8",
    "DropdownHolder": "#e1f2ff",
    "DropdownBorder": "#aad2ee",
    "DropdownOption": "#82b4dc",
    "Keybind": "#96c8eb",
    "Input": "#c8e6f8",
    "InputFocused": "#6496be",
    "InputIndicator": "#a0d2f0",
    "InputIndicatorFocus": "#3c8cdc",
    "Dialog": "#dcf0ff",
    "DialogHolder": "#ebf8ff",
    "DialogHolderLine": "#c8e4f8",
    "DialogButton": "#e1f2ff",
    "DialogButtonBorder": "#aad2ee",
    "DialogBorder": "#b4d7f0",
    "DialogInput": "#c8e6f8",
    "DialogInputLine": "#96c8eb",
    "Text": "#142846",
    "SubText": "#416994",
    "IconColor": "#416994",
    "Hover": "#aad2ee",
    "HoverChange": 0.04,
    "ShineEnabled": true,
    "StrokeShine": true,
    "StrokeDark": "#aad2ee",
    "BackgroundTransparency": 0,
    "Shine": {
      "Speed": 0.3,
      "RotationSpeed": 15,
      "ColorSequence": [
        [
          0,
          "#c8ebff"
        ],
        [
          0.5,
          "#ffffff"
        ],
        [
          1,
          "#c8ebff"
        ]
      ]
    },
    "ButtonGradient": {
      "Background": [
        [
          0,
          "#bee1f8"
        ],
        [
          1,
          "#dcf0ff"
        ]
      ],
      "Stroke": [
        [
          0,
          "#96c8eb"
        ],
        [
          0.5,
          "#c8ebff"
        ],
        [
          1,
          "#96c8eb"
        ]
      ]
    },
    "ThemeAccentColors": [
      "#64b4f0"
    ]
  },
  "Cotton Candy": {
    "AcrylicGradient": [
      [
        0,
        "#ffebfa"
      ],
      [
        1,
        "#ebd2ff"
      ]
    ],
    "Name": "Cotton Candy",
    "Accent": "#ff82be",
    "AcrylicMain": "#ffe1f5",
    "AcrylicBorder": "#ffbee6",
    "AcrylicNoise": 0.96,
    "TitleBarLine": "#f0b4e1",
    "Tab": "#c382b9",
    "Element": "#ffc8eb",
    "ElementBorder": "#e6a5d2",
    "InElementBorder": "#ebaad7",
    "ElementTransparency": 0.7,
    "ToggleSlider": "#d791c0",
    "ToggleToggled": "#5a1e46",
    "SliderRail": "#ebaad7",
    "CheckboxUnchecked": "#ebaad7",
    "CheckboxChecked": "#ff82be",
    "CheckboxCheck": "#5a1e46",
    "ProgressBarRail": "#ebaad7",
    "ProgressBarFill": "#ff82be",
    "DropdownFrame": "#f8c0e6",
    "DropdownHolder": "#ffe1f8",
    "DropdownBorder": "#e4a8d5",
    "DropdownOption": "#cd8cbc",
    "Keybind": "#e4a8d5",
    "Input": "#fad2ee",
    "InputFocused": "#c37da8",
    "InputIndicator": "#fac3e8",
    "InputIndicatorFocus": "#ff82be",
    "Dialog": "#ffe4f8",
    "DialogHolder": "#ffeefc",
    "DialogHolderLine": "#eed0eb",
    "DialogButton": "#ffe9fa",
    "DialogButtonBorder": "#e4b2da",
    "DialogBorder": "#eebce2",
    "DialogInput": "#fad5f0",
    "DialogInputLine": "#e4acd7",
    "Text": "#4b1937",
    "SubText": "#914b73",
    "IconColor": "#914b73",
    "Hover": "#eeb6de",
    "HoverChange": 0.04,
    "ShineEnabled": true,
    "StrokeShine": true,
    "StrokeDark": "#e4acd5",
    "BackgroundTransparency": 0,
    "Shine": {
      "Speed": 0.4,
      "RotationSpeed": 18,
      "ColorSequence": [
        [
          0,
          "#ffb4dc"
        ],
        [
          0.5,
          "#dcb4ff"
        ],
        [
          1,
          "#ffb4dc"
        ]
      ]
    },
    "ButtonGradient": {
      "Background": [
        [
          0,
          "#fac6e8"
        ],
        [
          1,
          "#e8b6fc"
        ]
      ],
      "Stroke": [
        [
          0,
          "#e4acd5"
        ],
        [
          0.5,
          "#fac6e8"
        ],
        [
          1,
          "#e4acd5"
        ]
      ]
    },
    "ThemeAccentColors": [
      "#ff82be",
      "#af8cff"
    ]
  },
  "Cyanic": {
    "AcrylicGradient": [
      [
        0,
        "#0f2d37"
      ],
      [
        0.5,
        "#081920"
      ],
      [
        1,
        "#040c10"
      ]
    ],
    "Name": "Cyanic",
    "Accent": "#39c5bb",
    "AcrylicMain": "#081216",
    "AcrylicBorder": "#28aaa5",
    "AcrylicNoise": 0.92,
    "TitleBarLine": "#239b96",
    "Tab": "#28a5a0",
    "Element": "#0e262e",
    "ElementBorder": "#08161c",
    "InElementBorder": "#28a5a0",
    "ElementTransparency": 0.88,
    "ToggleSlider": "#39c5bb",
    "ToggleToggled": "#000000",
    "SliderRail": "#28a5a0",
    "CheckboxUnchecked": "#28a5a0",
    "CheckboxChecked": "#39c5bb",
    "CheckboxCheck": "#000000",
    "ProgressBarRail": "#28a5a0",
    "ProgressBarFill": "#39c5bb",
    "DropdownFrame": "#208c87",
    "DropdownHolder": "#061216",
    "DropdownBorder": "#28a5a0",
    "DropdownOption": "#39c5bb",
    "Keybind": "#0e262e",
    "Input": "#0a1c23",
    "InputFocused": "#040a0e",
    "InputIndicator": "#50d7cd",
    "InputIndicatorFocus": "#82ebe4",
    "Dialog": "#08161c",
    "DialogHolder": "#050e12",
    "DialogHolderLine": "#239b96",
    "DialogButton": "#0a1a20",
    "DialogButtonBorder": "#28a5a0",
    "DialogBorder": "#1e7873",
    "DialogInput": "#0c2028",
    "DialogInputLine": "#50d7cd",
    "Text": "#82ebe4",
    "SubText": "#39c5bb",
    "IconColor": "#39c5bb",
    "Hover": "#39c5bb",
    "HoverChange": 0.05,
    "ShineEnabled": true,
    "StrokeShine": true,
    "StrokeDark": "#239b96",
    "BackgroundTransparency": 0.12,
    "Shine": {
      "Speed": 0.6,
      "RotationSpeed": 25,
      "ColorSequence": [
        [
          0,
          "#0a2832"
        ],
        [
          0.5,
          "#39c5bb"
        ],
        [
          1,
          "#0a2832"
        ]
      ]
    },
    "ButtonGradient": {
      "Background": [
        [
          0,
          "#123741"
        ],
        [
          1,
          "#08161c"
        ]
      ],
      "Stroke": [
        [
          0,
          "#239b96"
        ],
        [
          0.5,
          "#39c5bb"
        ],
        [
          1,
          "#239b96"
        ]
      ]
    },
    "ThemeAccentColors": [
      "#39c5bb",
      "#239b96"
    ]
  },
  "Amber Glow": {
    "AcrylicGradient": [
      [
        0,
        "#321905"
      ],
      [
        0.5,
        "#1c0e03"
      ],
      [
        1,
        "#0a0501"
      ]
    ],
    "Name": "Amber Glow",
    "Accent": "#ffaa28",
    "AcrylicMain": "#120a04",
    "AcrylicBorder": "#c8821e",
    "AcrylicNoise": 0.9,
    "TitleBarLine": "#b97819",
    "Tab": "#be7d19",
    "Element": "#261405",
    "ElementBorder": "#120a02",
    "InElementBorder": "#c8821e",
    "ElementTransparency": 0.88,
    "ToggleSlider": "#ffaa28",
    "ToggleToggled": "#000000",
    "SliderRail": "#be7d19",
    "CheckboxUnchecked": "#be7d19",
    "CheckboxChecked": "#ffaa28",
    "CheckboxCheck": "#000000",
    "ProgressBarRail": "#be7d19",
    "ProgressBarFill": "#ffaa28",
    "DropdownFrame": "#a56914",
    "DropdownHolder": "#0e0702",
    "DropdownBorder": "#c8821e",
    "DropdownOption": "#ffaa28",
    "Keybind": "#261405",
    "Input": "#1c0e03",
    "InputFocused": "#080401",
    "InputIndicator": "#ffc350",
    "InputIndicatorFocus": "#ffdc82",
    "Dialog": "#120902",
    "DialogHolder": "#0c0601",
    "DialogHolderLine": "#b97819",
    "DialogButton": "#160b03",
    "DialogButtonBorder": "#be7d19",
    "DialogBorder": "#8c5812",
    "DialogInput": "#201004",
    "DialogInputLine": "#ffc350",
    "Text": "#ffdc96",
    "SubText": "#f0af41",
    "IconColor": "#f0af41",
    "Hover": "#ffaa28",
    "HoverChange": 0.05,
    "ShineEnabled": true,
    "StrokeShine": true,
    "StrokeDark": "#b97819",
    "BackgroundTransparency": 0.12,
    "Shine": {
      "Speed": 0.6,
      "RotationSpeed": 25,
      "ColorSequence": [
        [
          0,
          "#321604"
        ],
        [
          0.5,
          "#ffaa28"
        ],
        [
          1,
          "#321604"
        ]
      ]
    },
    "ButtonGradient": {
      "Background": [
        [
          0,
          "#3c1e06"
        ],
        [
          1,
          "#160a02"
        ]
      ],
      "Stroke": [
        [
          0,
          "#b97819"
        ],
        [
          0.5,
          "#ffaa28"
        ],
        [
          1,
          "#b97819"
        ]
      ]
    },
    "ThemeAccentColors": [
      "#ffaa28",
      "#c8821e"
    ]
  },
  "Bloomings": {
    "AcrylicGradient": [
      [
        0,
        "#782355"
      ],
      [
        0.5,
        "#2d5f46"
      ],
      [
        1,
        "#968c91"
      ]
    ],
    "Name": "Bloomings",
    "Accent": "#ff5096",
    "AcrylicMain": "#280f1e",
    "AcrylicBorder": "#c83c78",
    "AcrylicNoise": 0.9,
    "TitleBarLine": "#ff64b4",
    "Tab": "#321226",
    "Element": "#37162a",
    "ElementBorder": "#ff46a0",
    "InElementBorder": "#c85096",
    "ElementTransparency": 0.92,
    "ToggleSlider": "#ffd2e6",
    "ToggleToggled": "#ff328c",
    "SliderRail": "#64284b",
    "CheckboxUnchecked": "#64284b",
    "CheckboxChecked": "#ff5096",
    "CheckboxCheck": "#ff328c",
    "ProgressBarRail": "#64284b",
    "ProgressBarFill": "#ff5096",
    "DropdownFrame": "#2d1223",
    "DropdownHolder": "#230c19",
    "DropdownBorder": "#b43c82",
    "DropdownOption": "#37162a",
    "Keybind": "#2d1223",
    "Input": "#2d1223",
    "InputFocused": "#3c1930",
    "InputIndicator": "#ff50a0",
    "Dialog": "#280f1e",
    "DialogHolder": "#1e0a16",
    "DialogHolderLine": "#c84696",
    "DialogButton": "#37162a",
    "DialogButtonBorder": "#c846a0",
    "DialogBorder": "#b43c82",
    "DialogInput": "#2d1223",
    "DialogInputLine": "#ff50a0",
    "Text": "#ffcde6",
    "SubText": "#f5a0d0",
    "IconColor": "#f5a0d0",
    "Hover": "#ffffff",
    "HoverChange": 0.08,
    "BackgroundTransparency": 0.12,
    "ViewportBackground": "#1e0a16",
    "ViewportBackgroundImages": true,
    "DropdownOutsideWindowBackground": "#230c19",
    "DropdownOutsideWindowBackgroundImages": true,
    "ShineEnabled": true,
    "StrokeShine": true,
    "StrokeDark": "#501e3c",
    "Shine": {
      "Speed": 0.35,
      "RotationSpeed": 15,
      "ColorSequence": [
        [
          0,
          "#ff4696"
        ],
        [
          0.25,
          "#50ff96"
        ],
        [
          0.5,
          "#ffffff"
        ],
        [
          0.75,
          "#ff3282"
        ],
        [
          1,
          "#ff4696"
        ]
      ]
    },
    "ButtonGradient": {
      "Background": [
        [
          0,
          "#dc3c82"
        ],
        [
          1,
          "#50193c"
        ]
      ],
      "Stroke": [
        [
          0,
          "#ffb4dc"
        ],
        [
          0.5,
          "#ff64b4"
        ],
        [
          1,
          "#c84696"
        ]
      ]
    },
    "ThemeAccentColors": [
      "#ff5096",
      "#c83c78"
    ]
  },
  "Crimson": {
    "AcrylicGradient": [
      [
        0,
        "#960f1e"
      ],
      [
        1,
        "#14050a"
      ]
    ],
    "Name": "Crimson",
    "Accent": "#dc1e3c",
    "AcrylicMain": "#1e0609",
    "AcrylicBorder": "#780f23",
    "AcrylicNoise": 0.9,
    "TitleBarLine": "#b4142d",
    "Tab": "#100a10",
    "Element": "#0e080e",
    "ElementBorder": "#640a19",
    "InElementBorder": "#c81937",
    "ElementTransparency": 0.84,
    "ToggleSlider": "#280a12",
    "ToggleToggled": "#dc1e3c",
    "SliderRail": "#280a12",
    "CheckboxUnchecked": "#280a12",
    "CheckboxChecked": "#dc1e3c",
    "CheckboxCheck": "#dc1e3c",
    "ProgressBarRail": "#280a12",
    "ProgressBarFill": "#dc1e3c",
    "DropdownFrame": "#0c060c",
    "DropdownHolder": "#060408",
    "DropdownBorder": "#640a19",
    "DropdownOption": "#120a12",
    "Keybind": "#120a12",
    "Input": "#0a060a",
    "InputFocused": "#060306",
    "InputIndicator": "#c81937",
    "Dialog": "#08050a",
    "DialogHolder": "#050307",
    "DialogHolderLine": "#5a0a16",
    "DialogButton": "#0e080e",
    "DialogButtonBorder": "#640a19",
    "DialogBorder": "#640a19",
    "DialogInput": "#0a060a",
    "DialogInputLine": "#c81937",
    "Text": "#ffc8d2",
    "SubText": "#d75564",
    "IconColor": "#d75564",
    "Hover": "#320c16",
    "HoverChange": 0.05,
    "BackgroundTransparency": 0.15,
    "ViewportBackground": "#0a0508",
    "ViewportBackgroundImages": true,
    "DropdownOutsideWindowBackground": "#080407",
    "DropdownOutsideWindowBackgroundImages": true,
    "ShineEnabled": true,
    "StrokeShine": true,
    "StrokeDark": "#460512",
    "Shine": {
      "Speed": 0.4,
      "RotationSpeed": 20,
      "ColorSequence": [
        [
          0,
          "#500514"
        ],
        [
          0.5,
          "#dc1e3c"
        ],
        [
          1,
          "#500514"
        ]
      ]
    },
    "ButtonGradient": {
      "Background": [
        [
          0,
          "#32050f"
        ],
        [
          1,
          "#120308"
        ]
      ],
      "Stroke": [
        [
          0,
          "#a0142d"
        ],
        [
          0.5,
          "#dc1e3c"
        ],
        [
          1,
          "#a0142d"
        ]
      ]
    },
    "ThemeAccentColors": [
      "#dc1e3c",
      "#780f23"
    ]
  },
  "Gold": {
    "AcrylicGradient": [
      [
        0,
        "#463714"
      ],
      [
        1,
        "#140f05"
      ]
    ],
    "Name": "Gold",
    "Accent": "#ffc85a",
    "AcrylicMain": "#231b0c",
    "AcrylicBorder": "#785a1e",
    "AcrylicNoise": 0.9,
    "TitleBarLine": "#b48c3c",
    "Tab": "#50411e",
    "Element": "#463719",
    "ElementBorder": "#785a1e",
    "InElementBorder": "#503c19",
    "ElementTransparency": 0.9,
    "ToggleSlider": "#ffc85a",
    "ToggleToggled": "#000000",
    "SliderRail": "#785a1e",
    "CheckboxUnchecked": "#785a1e",
    "CheckboxChecked": "#ffc85a",
    "CheckboxCheck": "#000000",
    "ProgressBarRail": "#785a1e",
    "ProgressBarFill": "#ffc85a",
    "DropdownFrame": "#322814",
    "DropdownHolder": "#23190a",
    "DropdownBorder": "#785a1e",
    "DropdownOption": "#ffc85a",
    "Keybind": "#463719",
    "Input": "#2d230f",
    "InputFocused": "#19140a",
    "InputIndicator": "#ffdc8c",
    "Dialog": "#2d230f",
    "DialogHolder": "#1e140a",
    "DialogHolderLine": "#191208",
    "DialogButton": "#2d230f",
    "DialogButtonBorder": "#785a1e",
    "DialogBorder": "#785a1e",
    "DialogInput": "#3c2d14",
    "DialogInputLine": "#ffdc8c",
    "Text": "#ffd764",
    "SubText": "#e6be50",
    "IconColor": "#e6be50",
    "Hover": "#ffc85a",
    "HoverChange": 0.05,
    "ShineEnabled": true,
    "StrokeShine": true,
    "StrokeDark": "#785a1e",
    "Shine": {
      "Speed": 0.5,
      "RotationSpeed": 25,
      "ColorSequence": [
        [
          0,
          "#281e0a"
        ],
        [
          0.5,
          "#ffd278"
        ],
        [
          1,
          "#281e0a"
        ]
      ]
    },
    "ButtonGradient": {
      "Background": [
        [
          0,
          "#ffd278"
        ],
        [
          1,
          "#3c280a"
        ]
      ],
      "Stroke": [
        [
          0,
          "#785a1e"
        ],
        [
          0.5,
          "#ffdc8c"
        ],
        [
          1,
          "#785a1e"
        ]
      ]
    },
    "ThemeAccentColors": [
      "#ffc85a",
      "#785a1e"
    ]
  },
  "Lavender Pink": {
    "AcrylicGradient": [
      [
        0,
        "#ff64a0"
      ],
      [
        1,
        "#280f23"
      ]
    ],
    "Name": "Lavender Pink",
    "Accent": "#ff64b4",
    "AcrylicMain": "#0d0e0e",
    "AcrylicBorder": "#835d5d",
    "AcrylicNoise": 0.9,
    "TitleBarLine": "#ff64b4",
    "Tab": "#140c14",
    "Element": "#190f19",
    "ElementBorder": "#502846",
    "InElementBorder": "#3c1e37",
    "ElementTransparency": 0.9,
    "ElementBorderThickness": 1,
    "ToggleSlider": "#321e32",
    "ToggleToggled": "#ff64b4",
    "SliderRail": "#3c1e37",
    "CheckboxUnchecked": "#281928",
    "CheckboxChecked": "#ff64b4",
    "CheckboxCheck": "#ffc2ec",
    "ProgressBarRail": "#281928",
    "ProgressBarFill": "#ff64b4",
    "DropdownFrame": "#120a12",
    "DropdownHolder": "#160d16",
    "DropdownBorder": "#502846",
    "DropdownOption": "#1c101c",
    "DropdownBorderThickness": 1,
    "Keybind": "#1e121e",
    "Input": "#160d16",
    "InputFocused": "#231423",
    "InputIndicator": "#ff64b4",
    "Dialog": "#120a12",
    "DialogHolder": "#160d16",
    "DialogHolderLine": "#502846",
    "DialogButton": "#ff64b4",
    "DialogButtonBorder": "#c8468c",
    "DialogBorder": "#502846",
    "DialogInput": "#190f19",
    "DialogInputLine": "#ff64b4",
    "Text": "#ff82c8",
    "SubText": "#dc64aa",
    "IconColor": "#dc64aa",
    "Hover": "#ff64b4",
    "HoverChange": 0.08,
    "BackgroundTransparency": 0,
    "ShineEnabled": true,
    "StrokeShine": true,
    "StrokeDark": "#0a050a",
    "DiscordJoinButton": "#5865f2",
    "WarningNotifyColor": "#ffc850",
    "SuccessNotifyColor": "#50dc8c",
    "ErrorNotifyColor": "#ff465a",
    "InfoNotifyColor": "#ff64b4",
    "Shine": {
      "Speed": 2,
      "RotationSpeed": 1.5,
      "ColorSequence": [
        [
          0,
          "#000000"
        ],
        [
          0.5,
          "#ff64b4"
        ],
        [
          1,
          "#000000"
        ]
      ]
    },
    "ButtonGradient": {
      "Background": [
        [
          0,
          "#b43278"
        ],
        [
          1,
          "#ff64b4"
        ]
      ],
      "Stroke": [
        [
          0,
          "#ff64b4"
        ],
        [
          0.5,
          "#c8468c"
        ],
        [
          1,
          "#ff64b4"
        ]
      ]
    },
    "ThemeAccentColors": [
      "#ff64b4",
      "#b43278"
    ]
  }
};
