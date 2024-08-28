export type ColorEngineVars = {
  primary: string
  secondary: string
  tertiary: string
  error: string

  onPrimary: string
  onSecondary: string
  onTertiary: string
  onError: string

  primaryContainer: string
  secondaryContainer: string
  tertiaryContainer: string
  errorContainer: string

  onPrimaryContainer: string
  onSecondaryContainer: string
  onTertiaryContainer: string
  onErrorContainer: string

  primaryFixed: string
  secondaryFixed: string
  tertiaryFixed: string

  primaryFixedDim: string
  secondaryFixedDim: string
  tertiaryFixedDim: string

  onPrimaryFixed: string
  onSecondaryFixed: string
  onTertiaryFixed: string

  onPrimaryFixedVariant: string
  onSecondaryFixedVariant: string
  onTertiaryFixedVariant: string

  surface: string
  surfaceDim: string
  surfaceBright: string

  surfaceContainerLowest: string
  surfaceContainerLow: string
  surfaceContainer: string
  surfaceContainerHigh: string
  surfaceContainerHighest: string

  onSurface: string
  onSurfaceVariant: string

  inverseSurface: string
  inverseOnSurface: string
  inversePrimary: string

  outline: string
  outlineVariant: string

  scrim: string
  shadow: string
  [key: string]: string
}
