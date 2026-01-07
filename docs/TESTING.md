# Testing Guide - Tallify

Comprehensive guide to testing strategies, frameworks, and best practices for Tallify.

**Version:** 0.1.0-beta
**Last Updated:** January 7, 2026

---

## Testing Stack

### Current Testing Tools

- **Playwright** - End-to-end (E2E) testing and accessibility testing
- **Playwright MCP** - Custom accessibility auditing (used by playwright-qa-tester agent)
- **TypeScript** - Type checking as first line of defense

### Planned Testing Tools (Roadmap)

- **Vitest** - Unit testing framework (planned for v0.2.0)
- **React Testing Library** - Component testing (planned for v0.2.0)
- **axe-core** - Automated accessibility testing (planned for v0.1.1)

---

## Test Commands

### End-to-End Tests (Playwright)

```bash
# Run all E2E tests
pnpm test:e2e

# Run with interactive UI
pnpm test:e2e:ui

# Run in headed mode (visible browser)
pnpm test:e2e:headed

# Run mobile-specific tests
pnpm test:e2e:mobile

# Run desktop-specific tests
pnpm test:e2e:desktop
```

### Type Checking

```bash
# Type check entire codebase (no emit)
npx tsc --noEmit

# Watch mode for type checking during development
npx tsc --noEmit --watch
```

### Code Quality

```bash
# Format code with Prettier
npx prettier --write .

# Check formatting without modifying files
npx prettier --check .
```

---

## Test Structure

### Directory Organization

```
gastos/
├── scripts/
│   └── playwright/
│       ├── playwright.config.ts    # Playwright configuration
│       ├── seed-demo-data.ts       # Test data seeding
│       └── capture-screenshots.ts  # Screenshot automation
├── tests/
│   └── e2e/                        # E2E test files (planned)
│       ├── auth.spec.ts
│       ├── expenses.spec.ts
│       └── dashboard.spec.ts
```

**Note:** Test files are currently in development. See roadmap for planned test coverage.

---

## End-to-End Testing with Playwright

### Configuration

Playwright is configured in `scripts/playwright/playwright.config.ts`:

- **Base URL:** `http://localhost:3000`
- **Projects:**
  - Desktop Chrome (1280×720)
  - Mobile Chrome (375×667)
- **Screenshot:** On failure
- **Video:** On first retry

### Writing E2E Tests

Example test structure:

```typescript
// tests/e2e/expenses.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Expense Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login as test user
    await page.goto('/login')
    await page.fill('[name="email"]', 'admin@test.local')
    await page.click('button[type="submit"]')
    await page.waitForURL('/dashboard')
  })

  test('should create new expense', async ({ page }) => {
    await page.click('button:has-text("Nuevo Gasto")')

    // Fill form
    await page.fill('[name="description"]', 'Test Expense')
    await page.fill('[name="amount"]', '100')
    await page.selectOption('[name="categoryId"]', '1')

    // Submit
    await page.click('button[type="submit"]')

    // Verify success
    await expect(page.getByText('Gasto creado')).toBeVisible()
  })

  test('should mark expense as paid', async ({ page }) => {
    await page.goto('/dashboard/gastos')

    // Find pending expense
    const expenseRow = page.locator('[data-status="pendiente"]').first()

    // Mark as paid
    await expenseRow.getByRole('button', { name: /pagar/i }).click()

    // Verify status change
    await expect(expenseRow).toHaveAttribute('data-status', 'pagado')
  })
})
```

### Running Specific Tests

```bash
# Run single test file
pnpm test:e2e tests/e2e/expenses.spec.ts

# Run tests matching pattern
pnpm test:e2e -g "should create"

# Run in debug mode
pnpm test:e2e --debug
```

---

## Accessibility Testing

### Automated Accessibility Checks

The project uses Playwright MCP for accessibility auditing:

```bash
# Run accessibility audit via Claude Code
# Use the playwright-qa-tester agent with accessibility focus
```

**Manual Audit:** See [ACCESSIBILITY-COMPLIANCE.md](./ACCESSIBILITY-COMPLIANCE.md) for current compliance status.

### Accessibility Test Checklist

When adding new features, verify:

- [ ] **Touch Targets:** All interactive elements ≥ 44×44px
- [ ] **Color Contrast:** Text contrast ≥ 4.5:1
- [ ] **ARIA Labels:** All interactive elements have accessible names
- [ ] **Keyboard Navigation:** All functionality accessible via keyboard
- [ ] **Focus Visible:** Focus indicators visible on all elements
- [ ] **Semantic HTML:** Proper use of landmarks and headings

### Running Accessibility Tests

```typescript
// Example Playwright accessibility test
import { test, expect } from '@playwright/test'
import { injectAxe, checkA11y } from 'axe-playwright' // Planned for v0.1.1

test('dashboard should be accessible', async ({ page }) => {
  await page.goto('/dashboard')
  await injectAxe(page)

  // Check entire page
  await checkA11y(page)

  // Check specific region
  await checkA11y(page, '.dashboard-kpis', {
    detailedReport: true,
    detailedReportOptions: {
      html: true,
    },
  })
})
```

---

## Test Data Management

### Seeding Test Data

Use the seed script for consistent test data:

```bash
# Seed demo data
pnpm screenshots:seed
```

This creates:
- Test user: `admin@test.local`
- Sample categories (10+)
- Sample expenses (20+)
- Sample incomes (5+)
- Sample payment methods (3+)

### Test User Credentials

**Development Only** (configured in `.env.local`):

```env
NEXT_PUBLIC_TEST_USER=admin@test.local
NEXT_PUBLIC_TEST_PASSWORD=your-test-password
```

**IMPORTANT:** These variables are automatically stripped from production builds.

### Cleanup Test Data

```sql
-- Manual cleanup (run in Supabase SQL Editor)
DELETE FROM expenses WHERE user_id = '<test-user-id>';
DELETE FROM incomes WHERE user_id = '<test-user-id>';
DELETE FROM categories WHERE user_id = '<test-user-id>';
DELETE FROM user_profiles WHERE email = 'admin@test.local';
```

---

## Screenshot Testing

### Capturing Screenshots

```bash
# Full screenshot workflow (seed + capture + optimize)
pnpm screenshots

# Individual steps
pnpm screenshots:seed    # Seed demo data
pnpm screenshots:capture # Capture screenshots
```

Screenshots are saved to `/.playwright-mcp/` directory.

### Screenshot Guidelines

- Use **real data** (via seeding)
- Test **both themes** (light/dark)
- Capture **all breakpoints** (mobile, tablet, desktop)
- Verify **loading states** and **empty states**

---

## Testing Best Practices

### 1. Follow the Testing Pyramid

```
        E2E Tests (Fewest)
            ↑
      Integration Tests
            ↑
    Unit Tests (Most)
```

**Current Status:** Primarily E2E tests. Unit/integration tests planned for v0.2.0.

### 2. Test User Workflows, Not Implementation

**Good:**
```typescript
test('user can create and pay an expense', async ({ page }) => {
  // Test the complete user journey
  await createExpense(page, { description: 'Coffee', amount: 5 })
  await markExpenseAsPaid(page, 'Coffee')
  await expect(page.getByText('Balance: $-5')).toBeVisible()
})
```

**Bad:**
```typescript
test('saveExpense function returns success', () => {
  // Testing implementation details
  const result = saveExpense(data)
  expect(result.success).toBe(true)
})
```

### 3. Use Data Attributes for Test Selectors

**Good:**
```typescript
await page.click('[data-testid="create-expense-button"]')
```

**Bad:**
```typescript
await page.click('.bg-primary.rounded-md.px-4') // Brittle, breaks on style changes
```

### 4. Keep Tests Independent

- Each test should run in isolation
- Don't rely on test execution order
- Clean up after each test if needed

### 5. Handle Async Operations Properly

```typescript
// Wait for navigation
await page.waitForURL('/dashboard')

// Wait for element
await page.waitForSelector('[data-testid="expense-table"]')

// Wait for network
await page.waitForResponse(resp => resp.url().includes('/api/expenses'))
```

---

## CI/CD Integration

### GitHub Actions (Planned)

```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: pnpm install

      - name: Type check
        run: npx tsc --noEmit

      - name: Run E2E tests
        run: pnpm test:e2e
        env:
          SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}

      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-results
          path: playwright-report/
```

---

## Test Coverage Goals

### Current Coverage (v0.1.0-beta)

- **E2E Tests:** ~20% (basic workflows)
- **Unit Tests:** 0% (not yet implemented)
- **Integration Tests:** 0% (not yet implemented)
- **Type Coverage:** 100% (TypeScript strict mode)

### Target Coverage (v1.0.0)

- **E2E Tests:** 60% (critical user flows)
- **Unit Tests:** 80% (utility functions, helpers)
- **Integration Tests:** 70% (server actions, API routes)
- **Type Coverage:** 100% (maintained)

---

## Manual Testing Checklist

### Before Each Release

#### Authentication
- [ ] Magic Link login works
- [ ] Magic Link expires after use
- [ ] Session persists across page reloads
- [ ] Logout works correctly
- [ ] Onboarding flow completes without errors

#### Expenses
- [ ] Create one-time expense
- [ ] Create recurring expense
- [ ] Mark expense as paid
- [ ] Mark expense as pending
- [ ] Overdue expenses show red indicator
- [ ] Edit expense updates correctly
- [ ] Delete expense removes from list

#### Incomes
- [ ] Create one-time income
- [ ] Create recurring income
- [ ] Edit income updates correctly
- [ ] Delete income removes from list

#### Categories
- [ ] Create expense category with custom color/icon
- [ ] Create income category
- [ ] Edit category updates everywhere
- [ ] Delete category prompts for reassignment

#### Payment Methods
- [ ] Create payment method
- [ ] Set default payment method
- [ ] Edit payment method
- [ ] Delete payment method

#### Dashboard
- [ ] KPIs display correct values
- [ ] Monthly comparison shows trends
- [ ] Upcoming expenses widget shows next 7 expenses
- [ ] Top categories chart displays correctly
- [ ] Quick actions work (Pagar, Posponer)

#### Multi-Currency
- [ ] Currency selection in onboarding
- [ ] Currency inference from timezone
- [ ] Currency display in configuración
- [ ] All amounts format with correct currency

#### Accessibility
- [ ] Tab navigation works through entire page
- [ ] Screen reader announces all interactive elements
- [ ] Keyboard shortcuts work (Cmd+K for search)
- [ ] Focus indicators visible
- [ ] High contrast mode renders correctly

#### Responsive Design
- [ ] Mobile (375px): Navigation bottom bar visible
- [ ] Tablet (768px): Layout adapts correctly
- [ ] Desktop (1440px+): Full sidebar navigation
- [ ] Touch targets ≥ 44px on mobile

---

## Troubleshooting Tests

### Issue: Tests fail with "Page timeout"

**Solution:** Increase timeout in `playwright.config.ts`:
```typescript
timeout: 60000, // 60 seconds
```

### Issue: "Element not found" errors

**Solution:** Add explicit waits:
```typescript
await page.waitForSelector('[data-testid="element"]', { timeout: 10000 })
```

### Issue: Flaky tests (pass/fail inconsistently)

**Causes:**
- Race conditions in async operations
- Network latency
- Animation timing

**Solutions:**
- Use `waitForSelector` instead of `sleep`
- Disable animations in test mode
- Add retry logic for network requests

### Issue: Database conflicts between tests

**Solution:** Use transactions or separate test databases:
```typescript
test.beforeEach(async () => {
  // Start transaction
  await db.raw('BEGIN')
})

test.afterEach(async () => {
  // Rollback transaction
  await db.raw('ROLLBACK')
})
```

---

## Contributing Tests

### When to Write Tests

- **Always:** For new features and bug fixes
- **Consider:** For refactoring existing features
- **Optional:** For UI styling changes

### Test PR Checklist

- [ ] Tests pass locally (`pnpm test:e2e`)
- [ ] Type check passes (`npx tsc --noEmit`)
- [ ] Tests cover happy path and edge cases
- [ ] Test names clearly describe what they test
- [ ] No hardcoded test data (use seeding)
- [ ] Tests are independent (can run in any order)

---

## Resources

### Documentation
- [Playwright Docs](https://playwright.dev/)
- [TypeScript Testing](https://www.typescriptlang.org/docs/handbook/testing.html)
- [WCAG 2.1 Testing Guide](https://www.w3.org/WAI/test-evaluate/)

### Internal Docs
- [ACCESSIBILITY-COMPLIANCE.md](./ACCESSIBILITY-COMPLIANCE.md) - Current accessibility status
- [COMPONENT_GUIDE.md](./COMPONENT_GUIDE.md) - Component testing guidelines
- [CLAUDE.md](../CLAUDE.md) - Development patterns

---

**Next Steps:**
- Add unit tests for utility functions (v0.2.0)
- Implement integration tests for server actions (v0.2.0)
- Add visual regression testing (v0.3.0)
- Set up CI/CD pipeline with automated testing (v1.0.0)

**Last Updated:** January 7, 2026
