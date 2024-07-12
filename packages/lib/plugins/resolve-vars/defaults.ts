export const sizes = ['xxs', 'xs', 'sm', 'md', 'lg', 'xl', 'xxl'] as const
type AppSizes = (typeof sizes)[number]
export const DefaultSizes: Record<string, Record<AppSizes, number>> = {
  padding: {
    xxs: 4,
    xs: 8,
    sm: 12,
    md: 16,
    lg: 20,
    xl: 24,
    xxl: 28
  },
  component: {
    xxs: 24,
    xs: 32,
    sm: 40,
    md: 48,
    lg: 56,
    xl: 64,
    xxl: 72
  },
  size: {
    xxs: 24,
    xs: 36,
    sm: 48,
    md: 60,
    lg: 72,
    xl: 84,
    xxl: 96
  },
  font: {
    xxs: 10,
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 22
  },
  icon: {
    xxs: 8,
    xs: 12,
    sm: 16,
    md: 24,
    lg: 28,
    xl: 32,
    xxl: 36
  }
}

export const DefaultColors: Record<string, string> = {
  primary: '#1a73e8',
  secondary: '#ffbe0d',
  error: '#f01c00',
  mono: '#000000'
}

export const DefaultElementSizes: Record<string, AppSizes> = {
  navbar: 'xl',
  header: 'md',
  fab: 'md'
}
