# Quick Fixes - Priority Issues

Copy-paste these fixes to resolve critical accessibility violations.

---

## Fix #1: Touch Targets (44px minimum)

### Button Component
**File:** `components/ui/button.tsx`

```tsx
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium...",
  {
    variants: {
      variant: { ... },
      size: {
        default: "h-11 px-4 py-2", // Changed from h-10 to h-11 (44px)
        sm: "h-11 rounded-md px-3", // Changed from h-9 to h-11
        lg: "h-12 rounded-md px-8", // Already compliant
        icon: "h-11 w-11", // Changed from h-10 w-10
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)
```

### Navigation Links
**File:** `app/[locale]/dashboard/layout.tsx`

```tsx
<Link
  href={item.href}
  className={cn(
    "flex items-center gap-3 rounded-lg px-3 py-3", // Changed py-2 to py-3
    "min-h-[44px]", // ADD THIS LINE
    "text-muted-foreground transition-all hover:text-primary",
    pathname === item.href && "bg-muted text-primary"
  )}
>
```

### Tabs
**File:** `components/ui/tabs.tsx`

```tsx
const TabsList = React.forwardRef<...>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex h-11 items-center...", // Changed from h-10 to h-11
      className
    )}
    {...props}
  />
))

const TabsTrigger = React.forwardRef<...>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center whitespace-nowrap",
      "rounded-sm px-3 py-1.5",
      "min-h-[44px]", // ADD THIS LINE
      "text-sm font-medium ring-offset-background...",
      className
    )}
    {...props}
  />
))
```

### Dialog Close Button
**File:** `components/ui/dialog.tsx`

```tsx
const DialogClose = React.forwardRef<...>(({ className, ...props }, ref) => (
  <DialogPrimitive.Close
    ref={ref}
    className={cn(
      "rounded-sm opacity-70 ring-offset-background...",
      "min-w-[44px] min-h-[44px]", // ADD THIS LINE
      "p-3", // Increase padding from p-1
      className
    )}
    {...props}
  >
    <X className="h-4 w-4" />
    <span className="sr-only">Close</span>
  </DialogPrimitive.Close>
))
```

### Checkbox
**File:** `components/ui/checkbox.tsx`

```tsx
const Checkbox = React.forwardRef<...>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "peer shrink-0 rounded-sm border border-primary...",
      "h-5 w-5", // Keep visual size small
      "min-h-[44px] min-w-[44px]", // ADD THIS for touch area
      "flex items-center justify-center", // Center the checkmark
      className
    )}
    {...props}
  >
```

---

## Fix #2: Hydration Errors (Radix UI IDs)

### Option A: Suppress (Quick Fix)
**Files:** Components using Dialog/DropdownMenu

```tsx
// Add suppressHydrationWarning to Radix components
<Dialog suppressHydrationWarning>
  <DialogTrigger suppressHydrationWarning>
    {/* content */}
  </DialogTrigger>
</Dialog>

<DropdownMenu suppressHydrationWarning>
  <DropdownMenuTrigger suppressHydrationWarning>
    {/* content */}
  </DropdownMenuTrigger>
</DropdownMenu>
```

### Option B: Stable IDs (Proper Fix)
**File:** `components/mobile-nav.tsx` (and similar)

```tsx
'use client'
import { useId } from 'react'

export function MobileNav() {
  const dialogId = useId() // Generates stable ID

  return (
    <Dialog>
      <DialogTrigger id={`mobile-nav-trigger-${dialogId}`}>
        <Button variant="outline" size="icon">
          <Menu className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent id={`mobile-nav-content-${dialogId}`}>
        {/* content */}
      </DialogContent>
    </Dialog>
  )
}
```

### Option C: Client-Only Rendering (Nuclear Option)
**File:** Any component with persistent errors

```tsx
import dynamic from 'next/dynamic'

// Disable SSR for this component
const ClientOnlyDialog = dynamic(
  () => import('./my-dialog'),
  { ssr: false }
)

export function MyPage() {
  return <ClientOnlyDialog />
}
```

**Recommendation:** Use Option A for quick fix, then migrate to Option B.

---

## Fix #3: Missing ARIA Labels

### Avatar Button
**File:** `app/[locale]/dashboard/layout.tsx`

```tsx
<DropdownMenuTrigger asChild>
  <Button
    variant="outline"
    size="sm"
    className="h-11 px-3 gap-2"
    aria-label="Open user menu" // ADD THIS LINE
  >
    <Avatar className="h-6 w-6">
      <AvatarFallback>
        {user?.email?.charAt(0).toUpperCase()}
      </AvatarFallback>
    </Avatar>
  </Button>
</DropdownMenuTrigger>
```

### Search Button
**File:** `components/global-search.tsx`

```tsx
<Button
  variant="outline"
  className="..."
  aria-label="Open search (Cmd+K)" // ADD THIS LINE
>
  <Search className="h-4 w-4" />
  <span>Buscar...</span>
  <kbd>⌘K</kbd>
</Button>
```

---

## Fix #4: Focus Visible Coverage

### Global CSS
**File:** `app/globals.css`

```css
/* Add to the end of the file */
@layer utilities {
  /* Ensure all interactive elements have visible focus */
  button:focus-visible,
  a:focus-visible,
  input:focus-visible,
  select:focus-visible,
  textarea:focus-visible,
  [role="button"]:focus-visible,
  [role="tab"]:focus-visible,
  [role="menuitem"]:focus-visible {
    @apply ring-2 ring-ring ring-offset-2 ring-offset-background;
  }

  /* Specific overrides for components */
  .focus-ring-primary:focus-visible {
    @apply ring-primary;
  }

  .focus-ring-destructive:focus-visible {
    @apply ring-destructive;
  }
}
```

---

## Testing the Fixes

After applying these changes, test with:

```bash
# 1. Start dev server
pnpm dev

# 2. Open browser DevTools
# 3. Navigate to any page
# 4. Run in Console:

// Check touch targets
document.querySelectorAll('button, a, input').forEach(el => {
  const rect = el.getBoundingClientRect();
  if (rect.width < 44 || rect.height < 44) {
    console.warn('Small target:', el, `${rect.width}×${rect.height}px`);
  }
});

// Check ARIA labels
document.querySelectorAll('button').forEach(btn => {
  if (!btn.textContent?.trim() && !btn.getAttribute('aria-label')) {
    console.warn('Missing label:', btn);
  }
});

// Check focus visible
document.querySelectorAll('button, a, input').forEach(el => {
  if (!el.className.includes('focus-visible') && !el.className.includes('focus:')) {
    console.warn('No focus styles:', el);
  }
});
```

---

## Verification Checklist

After applying fixes:

- [ ] No console errors (hydration fixed)
- [ ] All buttons ≥ 44px height
- [ ] All tabs ≥ 44px height
- [ ] Dialog close button ≥ 44px
- [ ] Checkboxes have 44px touch area
- [ ] Avatar button has aria-label
- [ ] All focusable elements have visible focus ring
- [ ] Tab navigation shows clear focus indicator

**Time to Apply All Fixes:** ~2-3 hours

**Recommended Order:**
1. Touch targets (Button component first)
2. Hydration errors (suppress warnings)
3. ARIA labels (5 minutes)
4. Focus visible (global CSS)

Good luck! 🚀
