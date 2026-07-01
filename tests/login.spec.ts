import { test, expect } from '@playwright/test'

// Login tests - Email & Password
test.describe('Login - Email & Password', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the login page before each test
    await page.goto('http://localhost:3000/login')
  })

  test('should show validation error when password is less than 8 characters', async ({ page }) => {
    await page.fill('input[name="email"]', 'user@example.com')
    await page.fill('input[name="password"]', 'short')
    await page.click('button[type="submit"]')

    // Expect an inline validation message or a toast
    const error = page.locator('text=Password must be at least 8 characters')
    await expect(error).toBeVisible()
  })

  test('should login successfully with valid email and password', async ({ page }) => {
    await page.fill('input[name="email"]', 'user@example.com')
    await page.fill('input[name="password"]', 'correcthorsebattery')
    await page.click('button[type="submit"]')

    // After successful login, expect to be redirected to dashboard or see logout
    await expect(page).toHaveURL(/dashboard|home|app/)
    await expect(page.locator('text=Logout')).toBeVisible()
  })
})
