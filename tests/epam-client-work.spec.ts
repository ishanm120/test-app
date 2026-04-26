import { test, expect } from '@playwright/test';

test('EPAM - navigate to Services → Explore Our Client Work and verify Client Work text', async ({ page }) => {
  // Navigate to EPAM home
  await page.goto('https://www.epam.com/', { waitUntil: 'domcontentloaded' });

  // Optional: accept cookies if banner is present
  const acceptBtn = page.locator('button:has-text("Accept"), button:has-text("I agree"), button:has-text("Agree")');
  if (await acceptBtn.count() > 0) {
    await acceptBtn.first().click().catch(() => {});
  }

  // Click "Services"
  await page.getByRole('link', { name: /^Services$/i }).click({ timeout: 10000 }).catch(async () => {
    // fallback to text selector
    await page.locator('a:has-text("Services")').first().click();
  });

  // Wait for the Services page or menu to be ready
  await page.waitForLoadState('domcontentloaded');

  // Click "Explore Our Client Work"
  const exploreLink = page.getByRole('link', { name: /Explore our client work/i });
  if (await exploreLink.count() > 0) {
    await exploreLink.first().click();
  } else {
    // fallback selectors: exact text or button variations
    const alt = page.locator('a:has-text("Explore Our Client Work"), button:has-text("Explore Our Client Work"), text="Explore Our Client Work"');
    if (await alt.count() > 0) await alt.first().click();
    else {
      // last resort: search for partial text then click first matching link
      const partial = page.locator('a:has-text("Explore"), a:has-text("Client Work")');
      if (await partial.count() > 0) await partial.first().click();
    }
  }

  // Ensure page loads
  await page.waitForLoadState('networkidle');

  // Verify "Client Work" text is visible
  const clientWork = page.getByText('Client Work', { exact: false });
  await expect(clientWork).toBeVisible();
});
