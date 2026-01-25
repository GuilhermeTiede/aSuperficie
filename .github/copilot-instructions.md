# Copilot Instructions: Wallpaper Catalog Page

## Project Overview

Next.js 16 app showcasing a wallpaper catalog (Coleção Maré Mansa) with product browsing, filtering, and a gallery showcase. Built with TypeScript, React 19, and shadcn/ui components.

## Architecture & Structure

### Page Architecture

- **[app/page.tsx](app/page.tsx)**: Main catalog with client-side filtering, product cards with image carousels, and modal details
- **[app/gallery/page.tsx](app/gallery/page.tsx)**: Gallery showcase for collection overview images
- **[app/layout.tsx](app/layout.tsx)**: Root layout with analytics integration and theme-aware favicons

### Component System

All UI components live in `components/ui/` and follow **shadcn/ui patterns**:

- Built on Radix UI primitives with CVA (class-variance-authority) for variants
- Use `cn()` utility from `lib/utils.ts` for className merging (clsx + tailwind-merge)
- Configured via `components.json` with "new-york" style and "stone" base color

**Example pattern** (see [components/ui/button.tsx](components/ui/button.tsx)):

```tsx
const buttonVariants = cva("base-classes", { variants: {...}, defaultVariants: {...} })
function Button({ variant, size, asChild, ...props }: VariantProps<typeof buttonVariants> & {...}) {
  const Comp = asChild ? Slot : 'button'
  return <Comp className={cn(buttonVariants({ variant, size }), className)} {...props} />
}
```

### Data & State Management

- **Product data**: Hardcoded `PRODUCTS` array in `app/page.tsx` with structured typing
- **Filtering**: Client-side with `useMemo` - categories, colors, search text
- **No external API/database**: Static data approach for this catalog prototype

## Key Development Patterns

### Image Handling

- **Next.js Image**: Always use `<Image>` component with `fill` prop for dynamic sizing
- **Image sources**: Stored in `public/images/` directory
- **Config**: `next.config.mjs` has `images.unoptimized: true` (for static export compatibility)

### Client/Server Components

- **Client components**: Use `"use client"` for interactive features (filtering, carousels, dialogs)
- **Server by default**: Layout and static pages unless state/hooks needed

### Styling Conventions

- **Tailwind v4**: Uses `@import "tailwindcss"` and `@theme` directive (see [app/globals.css](app/globals.css))
- **Path alias**: `@/*` maps to project root (configured in [tsconfig.json](tsconfig.json))
- **Responsive**: Mobile-first with `md:` breakpoints throughout
- **Custom utilities**: `.scrollbar-hide` class in globals.css for hidden scrollbars

### TypeScript Configuration

- **Strict mode**: Enabled with `ignoreBuildErrors: true` in Next.js config (legacy constraint)
- **Module resolution**: "bundler" strategy for Next.js 16
- **Path mappings**: `@/*` for clean imports

## Development Workflow

### Scripts (package.json)

```bash
pnpm dev        # Start dev server (default Next.js behavior)
pnpm build      # Production build
pnpm start      # Serve production build
pnpm lint       # ESLint check
```

### Adding New UI Components

1. Use shadcn CLI or manually add to `components/ui/`
2. Follow existing patterns: CVA variants + forwardRef + asChild support
3. Export component and its variant types
4. Import via `@/components/ui/*` alias

### Adding New Products

Update `PRODUCTS` array in `app/page.tsx`:

- Required fields: `id`, `number`, `name`, `category[]`, `colors[]`, images (room/sheet/detail)
- Update `CATEGORIES` constant if adding new category tags
- Images must exist in `public/images/`

## Component-Specific Guidance

### ProductCard Pattern

- **Image carousel**: Uses state to track `currentImageIndex` across 3 images (room/sheet/detail)
- **Touch gestures**: Implements swipe detection (`onTouchStart/Move/End`) for mobile
- **Hover states**: Desktop navigation arrows shown on hover, always visible on mobile

### GalleryShowcase ([components/gallery-showcase.tsx](components/gallery-showcase.tsx))

- Simple image viewer with thumbnail navigation
- Uses `aspect-video` wrapper with Next.js Image `fill` prop
- State: `selectedIndex` for current image

### Filter System

Main page uses multiple `useMemo` hooks:

1. Filter products by selected category
2. Filter by selected colors (intersection logic)
3. Filter by search text (name/category/description)
4. Final filtered list displayed in grid

## Dependencies & Tooling

### Core Stack

- **Next.js 16** (App Router, React 19)
- **TypeScript 5** with strict mode
- **pnpm** for package management

### UI Libraries

- **shadcn/ui**: Component library built on Radix UI
- **lucide-react**: Icon system (preferred over other icon libraries)
- **Tailwind CSS v4**: Utility-first styling with `@theme` syntax

### Key Utilities

- **class-variance-authority**: Component variant management
- **tailwind-merge + clsx**: Smart className merging via `cn()`
- **date-fns**: Date manipulation (installed but not actively used)
- **zod + react-hook-form**: Form validation (installed for future use)

## Important Constraints

1. **No TypeScript errors enforced**: `ignoreBuildErrors: true` means TS warnings won't block builds
2. **Static image optimization disabled**: Configured for potential static export
3. **No backend/API**: Pure frontend application with hardcoded data
4. **Portuguese content**: UI text and product descriptions in Brazilian Portuguese

## Quick Reference

- **Component imports**: `@/components/*` or `@/components/ui/*`
- **Utils**: `@/lib/utils` for `cn()` helper
- **Styling pattern**: Tailwind classes + responsive modifiers + dark mode variants
- **Client interaction**: Prefer shadcn dialogs/sheets over native modals
