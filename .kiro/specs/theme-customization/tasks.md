# Implementation Plan: Theme Customization

## Overview

Implement a light/dark theme system using a `ThemeStore` singleton, `ThemeContext` for token distribution, a floating `ThemeSwitcher` button, and `OperationIcon` SVG components. Theme state is persisted to localStorage with sessionStorage/memory fallbacks. CSS transitions are injected via a single `<style>` tag.

## Tasks

- [ ] 1. Create ThemeStore
  - [ ] 1.1 Implement `src/store/ThemeStore.ts` with `ThemeMode` type, `ThemeStore` class (constructor, `getMode`, `toggle`, `subscribe`, `notify`, `persist`, `load`), and exported `themeStore` singleton
    - `load()` reads from localStorage → sessionStorage → defaults to `'light'`; discards invalid values
    - `persist()` wraps storage writes in try/catch with fallback chain (Req 6.3, 6.4)
    - `toggle()` sets a 300ms `isTransitioning` debounce flag and calls `updateCSSVars()` then `notify()` (Req 7.4)
    - `updateCSSVars()` writes `--cbs-bg-primary`, `--cbs-bg-secondary`, `--cbs-text-primary`, `--cbs-accent-primary` to `document.documentElement.style`
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 6.1, 6.2, 6.3, 6.4, 7.4, 8.1, 8.3, 8.4, 8.5_

  - [ ]* 1.2 Write property test for ThemeStore — Property 1: Theme mode is always binary
    - **Property 1: Theme mode is always binary**
    - **Validates: Requirements 1.1**
    - Use `fc.nat({max: 50})` to drive N toggle calls; assert `getMode()` is always `'light'` or `'dark'`

  - [ ]* 1.3 Write property test for ThemeStore — Property 3: Toggle is an involution
    - **Property 3: Toggle is an involution**
    - **Validates: Requirements 2.3, 8.4**
    - Use `fc.constantFrom('light', 'dark')` as starting mode; toggle twice; assert mode equals original

  - [ ]* 1.4 Write property test for ThemeStore — Property 7: All subscribers notified on toggle
    - **Property 7: All subscribers notified on toggle**
    - **Validates: Requirements 8.2**
    - Use `fc.array(fc.func(fc.constant(undefined)), {minLength:1, maxLength:20})`; subscribe all; toggle once; assert each called exactly once

  - [ ]* 1.5 Write property test for ThemeStore — Property 9: Debounce prevents mid-transition re-toggle
    - **Property 9: Debounce prevents mid-transition re-toggle**
    - **Validates: Requirements 7.4**
    - Use `fc.nat({max: 290})` as delay ms; issue two toggles within window; assert mode changed only once and subscribers notified once

  - [ ]* 1.6 Write unit tests for ThemeStore
    - Default to `'light'` when storage is empty (Req 1.3)
    - localStorage unavailable → sessionStorage used (Req 6.3)
    - Both unavailable → in-memory only (Req 6.4)
    - Invalid stored value (`'purple'`) → defaults to `'light'`
    - `subscribe` and `notify` interface matches MarathonStore pattern (Req 8.1)

- [ ] 2. Create ThemeContext
  - [ ] 2.1 Implement `src/theme/ThemeContext.ts` with `ThemeTokens` interface, `lightTokens`, `darkTokens` objects, `ThemeContext`, and `useTheme` hook
    - Use exact color values from the design document for both palettes
    - `useTheme()` throws a descriptive error when called outside `ThemeContext.Provider`
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 4.1, 4.2, 4.3, 4.4_

  - [ ]* 2.2 Write property test for ThemeContext — Property 4: Mode determines token set
    - **Property 4: Mode determines token set**
    - **Validates: Requirements 3.4, 4.4**
    - Use `fc.constantFrom('light', 'dark')`; assert token resolver returns `lightTokens` for `'light'` and `darkTokens` for `'dark'`

  - [ ]* 2.3 Write property test for ThemeContext — Property 5: Token completeness
    - **Property 5: Token completeness**
    - **Validates: Requirements 3.1, 4.1**
    - Use `fc.constantFrom('light', 'dark')`; assert all 14 required fields are present and non-empty strings

  - [ ]* 2.4 Write property test for ThemeContext — Property 6: WCAG contrast thresholds
    - **Property 6: WCAG contrast thresholds**
    - **Validates: Requirements 10.1, 10.2**
    - Use `fc.constantFrom('light', 'dark')`; compute WCAG relative luminance contrast ratio; assert `textPrimary`/`bgPrimary` ≥ 4.5:1 and `accentPrimary`/`bgPrimary` ≥ 3:1

- [ ] 3. Create ThemeSwitcher component
  - [ ] 3.1 Implement `src/components/ThemeSwitcher.tsx` accepting `{ mode, onToggle }` props
    - Fixed position: `top: 16px, right: 16px`; minimum 44×44px touch target (Req 2.2)
    - Displays ☀️ in dark mode and 🌙 in light mode
    - `aria-label="Switch to {opposite} mode"`, `aria-pressed={mode === 'dark'}` (Req 10.3, 10.4)
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 10.3, 10.4_

  - [ ]* 3.2 Write property test for ThemeSwitcher — Property 11: ARIA reflects current mode
    - **Property 11: ThemeSwitcher ARIA reflects current mode**
    - **Validates: Requirements 10.4**
    - Use `fc.constantFrom('light', 'dark')`; render component; assert `aria-pressed` and `aria-label` match expected values for each mode

  - [ ]* 3.3 Write unit tests for ThemeSwitcher
    - Renders as a `<button>` element (Req 10.3)
    - Has minimum 44×44px touch target (Req 2.2)

- [ ] 4. Create OperationIcon component
  - [ ] 4.1 Implement `src/components/OperationIcon.tsx` accepting `{ operation, color?, size? }` props
    - Renders an SVG circle with the operation symbol centered inside
    - `operation` accepts `'addition' | 'subtraction' | 'multiplication' | 'division'`
    - `size` defaults to 28, minimum enforced at 24 (Req 5.7)
    - `color` defaults to `useTheme().accentPrimary` when not provided (Req 5.6)
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.6, 5.7, 9.5_

  - [ ]* 4.2 Write property test for OperationIcon — Property 10: Icon color follows theme
    - **Property 10: OperationIcon color follows theme**
    - **Validates: Requirements 5.6**
    - Use `fc.constantFrom('light', 'dark')` × `fc.constantFrom('addition', 'subtraction', 'multiplication', 'division')`; render without explicit `color`; assert SVG fill equals `accentPrimary` of active theme

  - [ ]* 4.3 Write unit tests for OperationIcon
    - Renders for all four operations without error (Req 5.1–5.4)
    - Has minimum size of 24px (Req 5.7)

- [ ] 5. Checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 6. Update App.tsx
  - [ ] 6.1 Subscribe `App` to `themeStore`; resolve tokens via `lightTokens`/`darkTokens`; wrap children in `ThemeContext.Provider`; render `ThemeSwitcher` and an ARIA live region (`aria-live="polite"`) that announces `"Dark mode enabled"` / `"Light mode enabled"` on toggle
    - Inject the CSS transition `<style>` tag once on mount; add `no-transition` class to `<html>` on init and remove it after first paint (Req 7.1, 7.2, 7.3)
    - _Requirements: 1.4, 1.5, 2.1, 7.1, 7.2, 7.3, 8.2, 10.5_

  - [ ]* 6.2 Write property test for App — Property 2: Storage round-trip
    - **Property 2: Storage round-trip**
    - **Validates: Requirements 1.2, 6.1, 6.2**
    - Use `fc.constantFrom('light', 'dark')`; toggle to mode, construct new `ThemeStore`; assert `getMode()` returns same mode

  - [ ]* 6.3 Write property test for App — Property 8: Theme state is independent of marathon state
    - **Property 8: Theme state is independent of marathon state**
    - **Validates: Requirements 8.5**
    - Assert that any `themeStore.toggle()` call leaves `marathonStore.getState()` unchanged, and any marathon mutation leaves `themeStore.getMode()` unchanged

  - [ ]* 6.4 Write property test for App — Property 12: Screen reader announcement on toggle
    - **Property 12: Screen reader announcement on toggle**
    - **Validates: Requirements 10.5**
    - Use `fc.constantFrom('light', 'dark')`; simulate toggle; assert ARIA live region text equals `"Dark mode enabled"` or `"Light mode enabled"`

  - [ ]* 6.5 Write unit tests for App integration
    - CSS transition `<style>` tag injected with 250ms duration (Req 7.1, 7.2)
    - `no-transition` class present on init, removed after first paint (Req 7.3)

- [ ] 7. Update ConfigurationSuite, MarathonInterface, and ResultGenerator
  - [ ] 7.1 Update `ConfigurationSuite.tsx` to consume `useTheme()` tokens for all inline styles and render `OperationIcon` alongside each subject button
    - Replace hardcoded color values with theme tokens
    - _Requirements: 1.5, 3.4, 4.4, 5.5, 9.1, 9.2, 9.3_

  - [ ] 7.2 Update `MarathonInterface.tsx` to consume `useTheme()` tokens for all inline styles
    - Replace hardcoded color values with theme tokens
    - _Requirements: 1.5, 3.4, 4.4, 9.1, 9.2, 9.3_

  - [ ] 7.3 Update `ResultGenerator.tsx` to consume `useTheme()` tokens for all inline styles
    - Replace hardcoded color values with theme tokens
    - _Requirements: 1.5, 3.4, 4.4, 9.1, 9.2, 9.3_

  - [ ]* 7.4 Write unit tests for themed screens
    - ThemeSwitcher visible when ConfigurationSuite, MarathonInterface, and ResultGenerator are rendered (Req 2.1)

- [ ] 8. Final checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP
- Each task references specific requirements for traceability
- Property tests use `fast-check` — install with `npm install --save-dev fast-check`
- Each property test should run a minimum of 100 iterations
- Tag format for traceability: `// Feature: theme-customization, Property N: <property text>`
