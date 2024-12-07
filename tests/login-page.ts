import { Locator, Page } from "@playwright/test";
import { ProjectsPage } from "./projects-page.js";

/**
 * Represents the login page of the application.
 * Provides methods to interact with the login form and navigate to the login page.
 */
export class LoginPage {
    /**
     * The Playwright Page object.
     */
    public readonly page: Page;

    /**
     * The locator for the username input field.
     */
    public readonly UsernameField: Locator;

    /**
     * The locator for the password input field.
     */
    public readonly PasswordField: Locator;

    /**
     * The locator for the sign-in button.
     */
    public readonly SignInButton: Locator;

    /**
     * Initializes a new instance of the LoginPage class.
     * @param page - The Playwright Page object.
     */
    constructor(page: Page) {
        this.page = page;
        this.UsernameField = page.locator('input[id="username"]');
        this.PasswordField = page.locator('input[id="password"]');
        this.SignInButton = page.locator('button[type="submit"]');
    }

    /**
     * Navigates to the login page.
     */
    public async goToLogin() {
        await this.page.goto('/');
    }

    /**
     * Fills in the username and password fields and clicks the sign-in button.
     * @param username - The username to enter.
     * @param password - The password to enter.
     * @returns A promise that resolves to an instance of the ProjectsPage class.
     */
    public async signIn(username: string, password: string): Promise<ProjectsPage> {
        await this.UsernameField.fill(username);
        await this.PasswordField.fill(password);
        await this.SignInButton.click();
        return new ProjectsPage(this.page);
    }
}
