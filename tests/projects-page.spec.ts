import { LoginPage } from "./login-page.js";
import { test, expect } from "@playwright/test";
import { ColumnName, Project, ProjectsPage } from "./projects-page.js";

let app: ProjectsPage;
const testCases = {
    webApplication: {
        [ColumnName.ToDo]: [
            {
                title: "Implement user authentication",
                tags: ["Feature", "High Priority"]
            },
            {
                title: "Fix navigation bug",
                tags: ["Bug"]
            }
        ],
        [ColumnName.InProgress]: [
            {
                title: "Design system updates",
                tags: ["Design"]
            }
        ]
    },
    mobileApplication: {
        [ColumnName.ToDo]: [
            {
                title: "Push notification system",
                tags: ["Feature"]
            }
        ],
        [ColumnName.InProgress]: [
            {
                title: "Offline mode",
                tags: ["Feature", "High Priority"]
            }
        ],
        [ColumnName.Done]: [
            {
                title: "App icon design",
                tags: ["Design"]
            }
        ]
    }
};
test.describe('Web Application', () => {
    test.beforeEach(async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.goToLogin();
        app = await loginPage.signIn(process.env.LOGINNAME ?? '', process.env.PASSWORD ?? '');
        await app.goToProject(Project.WebApplication);
    });

    Object.keys(testCases.webApplication).forEach(columnName => {
        test.describe(`${columnName} column`, () => {
            testCases.webApplication[columnName].forEach(testCase => {
                test(`Verify "${testCase.title}" card in the ${columnName} column`, async () => {
                    const column = app.Columns.find(column => column.name === columnName);
                    expect(column).not.toBeUndefined();
                    expect(column.items).not.toBeNull();
                    expect(column.items.length).toBeGreaterThan(0);

                    const card = column.items.find(card => card.title === testCase.title);
                    expect(card).toBeTruthy();
                    testCase.tags.forEach((tag: string) => {
                        expect(card.tags).toContain(tag);
                    });
                });
            });
        });
    });
});

test.describe('Mobile Application', () => {
    test.beforeEach(async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.goToLogin();
        app = await loginPage.signIn(process.env.LOGINNAME ?? '', process.env.PASSWORD ?? '');
        await app.goToProject(Project.MobileApplication);
        await app.updateColumns();
    });

    Object.keys(testCases.mobileApplication).forEach(columnName => {
        test.describe(`${columnName} column`, () => {
            testCases.mobileApplication[columnName].forEach(testCase => {
                test(`Verify "${testCase.title}" card in the ${columnName} column`, async () => {
                    const column = app.Columns.find(column => column.name === columnName);
                    expect(column).not.toBeUndefined();
                    expect(column.items).not.toBeNull();
                    expect(column.items.length).toBeGreaterThan(0);

                    const card = column.items.find(card => card.title === testCase.title);
                    expect(card).toBeTruthy();
                    testCase.tags.forEach(tag => {
                        expect(card.tags).toContain(tag);
                    });
                });
            });
        });
    });
});