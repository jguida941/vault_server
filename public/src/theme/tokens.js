/**
 * Design Tokens - Material Design 3 inspired token system
 * @module theme/tokens
 *
 * Token Hierarchy:
 * 1. Reference Tokens - Raw color palette values
 * 2. System Tokens - Semantic role-based tokens
 * 3. Component Tokens - Component-specific tokens
 */

// ============= Reference Tokens (Color Palette) =============

/**
 * Material Design 3 tonal palette generator
 * Creates a 13-tone palette from a base color
 */
const TONAL_PALETTE = {
    // Primary Purple
    primary: {
        0: '#000000',
        10: '#21005D',
        20: '#381E72',
        30: '#4F378B',
        40: '#6750A4',
        50: '#7F67BE',
        60: '#9A82DB',
        70: '#B69DF8',
        80: '#D0BCFF',
        90: '#EADDFF',
        95: '#F6EDFF',
        99: '#FFFBFE',
        100: '#FFFFFF'
    },
    // Secondary Teal
    secondary: {
        0: '#000000',
        10: '#001F24',
        20: '#00363D',
        30: '#004F58',
        40: '#006874',
        50: '#008391',
        60: '#00A0B0',
        70: '#00BCD4',
        80: '#4DD0E1',
        90: '#B2EBF2',
        95: '#E0F7FA',
        99: '#F5FDFE',
        100: '#FFFFFF'
    },
    // Tertiary Orange
    tertiary: {
        0: '#000000',
        10: '#370B00',
        20: '#591C00',
        30: '#7E2E00',
        40: '#A64100',
        50: '#C95B14',
        60: '#E87837',
        70: '#FF9A5A',
        80: '#FFB68A',
        90: '#FFDCC8',
        95: '#FFEDE4',
        99: '#FFFBFF',
        100: '#FFFFFF'
    },
    // Error Red
    error: {
        0: '#000000',
        10: '#410002',
        20: '#690005',
        30: '#93000A',
        40: '#BA1A1A',
        50: '#DE3730',
        60: '#FF5449',
        70: '#FF897D',
        80: '#FFB4AB',
        90: '#FFDAD6',
        95: '#FFEDEA',
        99: '#FFFBFF',
        100: '#FFFFFF'
    },
    // Neutral Gray
    neutral: {
        0: '#000000',
        10: '#1C1B1F',
        20: '#313033',
        30: '#484649',
        40: '#605D62',
        50: '#787579',
        60: '#939094',
        70: '#AEAAAE',
        80: '#C9C5CA',
        90: '#E6E1E5',
        95: '#F4EFF4',
        99: '#FFFBFE',
        100: '#FFFFFF'
    },
    // Neutral Variant
    neutralVariant: {
        0: '#000000',
        10: '#1D1A22',
        20: '#322F37',
        30: '#49454F',
        40: '#605D66',
        50: '#79747E',
        60: '#938F99',
        70: '#AEA9B4',
        80: '#CAC4D0',
        90: '#E7E0EC',
        95: '#F5EEFA',
        99: '#FFFBFE',
        100: '#FFFFFF'
    }
};

// ============= System Tokens =============

/**
 * Light theme system tokens
 */
const LIGHT_TOKENS = {
    // Surface colors
    surface: TONAL_PALETTE.neutral[99],
    surfaceDim: TONAL_PALETTE.neutral[90],
    surfaceBright: TONAL_PALETTE.neutral[99],
    surfaceContainerLowest: TONAL_PALETTE.neutral[100],
    surfaceContainerLow: TONAL_PALETTE.neutral[95],
    surfaceContainer: TONAL_PALETTE.neutral[90],
    surfaceContainerHigh: TONAL_PALETTE.neutral[90],
    surfaceContainerHighest: TONAL_PALETTE.neutral[80],

    // On-surface colors (text)
    onSurface: TONAL_PALETTE.neutral[10],
    onSurfaceVariant: TONAL_PALETTE.neutralVariant[30],

    // Primary colors
    primary: TONAL_PALETTE.primary[40],
    onPrimary: TONAL_PALETTE.primary[100],
    primaryContainer: TONAL_PALETTE.primary[90],
    onPrimaryContainer: TONAL_PALETTE.primary[10],

    // Secondary colors
    secondary: TONAL_PALETTE.secondary[40],
    onSecondary: TONAL_PALETTE.secondary[100],
    secondaryContainer: TONAL_PALETTE.secondary[90],
    onSecondaryContainer: TONAL_PALETTE.secondary[10],

    // Tertiary colors
    tertiary: TONAL_PALETTE.tertiary[40],
    onTertiary: TONAL_PALETTE.tertiary[100],
    tertiaryContainer: TONAL_PALETTE.tertiary[90],
    onTertiaryContainer: TONAL_PALETTE.tertiary[10],

    // Error colors
    error: TONAL_PALETTE.error[40],
    onError: TONAL_PALETTE.error[100],
    errorContainer: TONAL_PALETTE.error[90],
    onErrorContainer: TONAL_PALETTE.error[10],

    // Outline colors
    outline: TONAL_PALETTE.neutralVariant[50],
    outlineVariant: TONAL_PALETTE.neutralVariant[80],

    // Inverse colors
    inverseSurface: TONAL_PALETTE.neutral[20],
    inverseOnSurface: TONAL_PALETTE.neutral[95],
    inversePrimary: TONAL_PALETTE.primary[80],

    // Shadow
    shadow: TONAL_PALETTE.neutral[0],
    scrim: TONAL_PALETTE.neutral[0]
};

/**
 * Dark theme system tokens
 */
const DARK_TOKENS = {
    // Surface colors
    surface: TONAL_PALETTE.neutral[10],
    surfaceDim: TONAL_PALETTE.neutral[10],
    surfaceBright: TONAL_PALETTE.neutral[30],
    surfaceContainerLowest: TONAL_PALETTE.neutral[0],
    surfaceContainerLow: TONAL_PALETTE.neutral[10],
    surfaceContainer: TONAL_PALETTE.neutral[20],
    surfaceContainerHigh: TONAL_PALETTE.neutral[20],
    surfaceContainerHighest: TONAL_PALETTE.neutral[30],

    // On-surface colors (text)
    onSurface: TONAL_PALETTE.neutral[90],
    onSurfaceVariant: TONAL_PALETTE.neutralVariant[80],

    // Primary colors
    primary: TONAL_PALETTE.primary[80],
    onPrimary: TONAL_PALETTE.primary[20],
    primaryContainer: TONAL_PALETTE.primary[30],
    onPrimaryContainer: TONAL_PALETTE.primary[90],

    // Secondary colors
    secondary: TONAL_PALETTE.secondary[80],
    onSecondary: TONAL_PALETTE.secondary[20],
    secondaryContainer: TONAL_PALETTE.secondary[30],
    onSecondaryContainer: TONAL_PALETTE.secondary[90],

    // Tertiary colors
    tertiary: TONAL_PALETTE.tertiary[80],
    onTertiary: TONAL_PALETTE.tertiary[20],
    tertiaryContainer: TONAL_PALETTE.tertiary[30],
    onTertiaryContainer: TONAL_PALETTE.tertiary[90],

    // Error colors
    error: TONAL_PALETTE.error[80],
    onError: TONAL_PALETTE.error[20],
    errorContainer: TONAL_PALETTE.error[30],
    onErrorContainer: TONAL_PALETTE.error[90],

    // Outline colors
    outline: TONAL_PALETTE.neutralVariant[60],
    outlineVariant: TONAL_PALETTE.neutralVariant[30],

    // Inverse colors
    inverseSurface: TONAL_PALETTE.neutral[90],
    inverseOnSurface: TONAL_PALETTE.neutral[20],
    inversePrimary: TONAL_PALETTE.primary[40],

    // Shadow
    shadow: TONAL_PALETTE.neutral[0],
    scrim: TONAL_PALETTE.neutral[0]
};

// ============= Typography Tokens =============

const TYPOGRAPHY = {
    // Font families
    fontFamily: {
        brand: "'Google Sans', 'Roboto', sans-serif",
        plain: "'Roboto', 'Helvetica', sans-serif",
        code: "'Roboto Mono', 'Consolas', monospace"
    },

    // Type scale
    displayLarge: {
        fontFamily: 'var(--md-sys-typescale-brand)',
        fontSize: '57px',
        fontWeight: 400,
        lineHeight: '64px',
        letterSpacing: '-0.25px'
    },
    displayMedium: {
        fontFamily: 'var(--md-sys-typescale-brand)',
        fontSize: '45px',
        fontWeight: 400,
        lineHeight: '52px',
        letterSpacing: '0px'
    },
    displaySmall: {
        fontFamily: 'var(--md-sys-typescale-brand)',
        fontSize: '36px',
        fontWeight: 400,
        lineHeight: '44px',
        letterSpacing: '0px'
    },
    headlineLarge: {
        fontFamily: 'var(--md-sys-typescale-brand)',
        fontSize: '32px',
        fontWeight: 400,
        lineHeight: '40px',
        letterSpacing: '0px'
    },
    headlineMedium: {
        fontFamily: 'var(--md-sys-typescale-brand)',
        fontSize: '28px',
        fontWeight: 400,
        lineHeight: '36px',
        letterSpacing: '0px'
    },
    headlineSmall: {
        fontFamily: 'var(--md-sys-typescale-brand)',
        fontSize: '24px',
        fontWeight: 400,
        lineHeight: '32px',
        letterSpacing: '0px'
    },
    titleLarge: {
        fontFamily: 'var(--md-sys-typescale-brand)',
        fontSize: '22px',
        fontWeight: 400,
        lineHeight: '28px',
        letterSpacing: '0px'
    },
    titleMedium: {
        fontFamily: 'var(--md-sys-typescale-plain)',
        fontSize: '16px',
        fontWeight: 500,
        lineHeight: '24px',
        letterSpacing: '0.15px'
    },
    titleSmall: {
        fontFamily: 'var(--md-sys-typescale-plain)',
        fontSize: '14px',
        fontWeight: 500,
        lineHeight: '20px',
        letterSpacing: '0.1px'
    },
    bodyLarge: {
        fontFamily: 'var(--md-sys-typescale-plain)',
        fontSize: '16px',
        fontWeight: 400,
        lineHeight: '24px',
        letterSpacing: '0.5px'
    },
    bodyMedium: {
        fontFamily: 'var(--md-sys-typescale-plain)',
        fontSize: '14px',
        fontWeight: 400,
        lineHeight: '20px',
        letterSpacing: '0.25px'
    },
    bodySmall: {
        fontFamily: 'var(--md-sys-typescale-plain)',
        fontSize: '12px',
        fontWeight: 400,
        lineHeight: '16px',
        letterSpacing: '0.4px'
    },
    labelLarge: {
        fontFamily: 'var(--md-sys-typescale-plain)',
        fontSize: '14px',
        fontWeight: 500,
        lineHeight: '20px',
        letterSpacing: '0.1px'
    },
    labelMedium: {
        fontFamily: 'var(--md-sys-typescale-plain)',
        fontSize: '12px',
        fontWeight: 500,
        lineHeight: '16px',
        letterSpacing: '0.5px'
    },
    labelSmall: {
        fontFamily: 'var(--md-sys-typescale-plain)',
        fontSize: '11px',
        fontWeight: 500,
        lineHeight: '16px',
        letterSpacing: '0.5px'
    }
};

// ============= Elevation Tokens =============

const ELEVATION = {
    level0: 'none',
    level1: '0px 1px 3px 1px rgba(0,0,0,0.15), 0px 1px 2px 0px rgba(0,0,0,0.3)',
    level2: '0px 2px 6px 2px rgba(0,0,0,0.15), 0px 1px 2px 0px rgba(0,0,0,0.3)',
    level3: '0px 4px 8px 3px rgba(0,0,0,0.15), 0px 1px 3px 0px rgba(0,0,0,0.3)',
    level4: '0px 6px 10px 4px rgba(0,0,0,0.15), 0px 2px 3px 0px rgba(0,0,0,0.3)',
    level5: '0px 8px 12px 6px rgba(0,0,0,0.15), 0px 4px 4px 0px rgba(0,0,0,0.3)'
};

// ============= Shape Tokens =============

const SHAPE = {
    cornerNone: '0px',
    cornerExtraSmall: '4px',
    cornerSmall: '8px',
    cornerMedium: '12px',
    cornerLarge: '16px',
    cornerExtraLarge: '28px',
    cornerFull: '9999px'
};

// ============= Motion Tokens =============

const MOTION = {
    durationShort1: '50ms',
    durationShort2: '100ms',
    durationShort3: '150ms',
    durationShort4: '200ms',
    durationMedium1: '250ms',
    durationMedium2: '300ms',
    durationMedium3: '350ms',
    durationMedium4: '400ms',
    durationLong1: '450ms',
    durationLong2: '500ms',
    durationLong3: '550ms',
    durationLong4: '600ms',
    durationExtraLong1: '700ms',
    durationExtraLong2: '800ms',
    durationExtraLong3: '900ms',
    durationExtraLong4: '1000ms',
    easingStandard: 'cubic-bezier(0.2, 0, 0, 1)',
    easingStandardDecelerate: 'cubic-bezier(0, 0, 0, 1)',
    easingStandardAccelerate: 'cubic-bezier(0.3, 0, 1, 1)',
    easingEmphasized: 'cubic-bezier(0.2, 0, 0, 1)',
    easingEmphasizedDecelerate: 'cubic-bezier(0.05, 0.7, 0.1, 1)',
    easingEmphasizedAccelerate: 'cubic-bezier(0.3, 0, 0.8, 0.15)'
};

// ============= State Tokens =============

const STATE = {
    hoverStateLayerOpacity: 0.08,
    focusStateLayerOpacity: 0.12,
    pressedStateLayerOpacity: 0.12,
    draggedStateLayerOpacity: 0.16,
    disabledContainerOpacity: 0.12,
    disabledContentOpacity: 0.38
};

// ============= Spacing Tokens =============

const SPACING = {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px'
};

export {
    TONAL_PALETTE,
    LIGHT_TOKENS,
    DARK_TOKENS,
    TYPOGRAPHY,
    ELEVATION,
    SHAPE,
    MOTION,
    STATE,
    SPACING
};
