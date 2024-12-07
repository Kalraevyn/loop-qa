import { test, expect } from '@playwright/test';
import { LoginPage } from './login-page.js';

test.describe('LoginPage', () => {
    let loginPage: LoginPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        await loginPage.goToLogin();
    });

    test('should navigate to the login page', async ({ page }) => {
        await expect(page).toHaveURL('/');
    });

    test('should fill in username and password fields', async ({ page }) => {
        await loginPage.UsernameField.fill('testuser');
        await loginPage.PasswordField.fill('password123');
        await expect(loginPage.UsernameField).toHaveValue('testuser');
        await expect(loginPage.PasswordField).toHaveValue('password123');
    });


});