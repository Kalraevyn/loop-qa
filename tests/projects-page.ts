
import { Locator, Page } from '@playwright/test';

/**
 * Enum representing the names of columns in the project management board.
 */
export enum ColumnName {
    ToDo = 'To Do',
    InProgress = 'In Progress',
    Done = 'Done',
    Review = 'Review'
}

/**
 * Enum representing the different types of projects.
 */
export enum Project {
    WebApplication = 'Web Application',
    MobileApplication = 'Mobile Application',
    MarketingCampaign = 'Marketing Campaign'
}

/**
 * Interface representing the content of a card.
 */
export interface CardContent {
    /**
     * The title of the card.
     */
    title: string;

    /**
     * The locator for the card container.
     */
    container: Locator;

    /**
     * The description of the card.
     */
    description: string;

    /**
     * The tags associated with the card.
     */
    tags: string[];

    /**
     * The assignee of the card.
     */
    assignee: string;

    /**
     * The due date of the card.
     */
    dueDate: string;
}

/**
 * Interface representing a column in the project management board.
 */
export interface Column {
    /**
     * The name of the column.
     */
    name: string;

    /**
     * The items (cards) in the column.
     */
    items: CardContent[];

    /**
     * The locator for the column.
     */
    locator: Locator;
}

/**
 * Class representing the Projects Page.
 */
export class ProjectsPage {
    /**
     * The Playwright page object.
     */
    public readonly page: Page;

    /**
     * The locator for the Web Application project button.
     */
    private readonly webApplicationElement: Locator;

    /**
     * The locator for the Mobile Application project button.
     */
    private readonly mobileApplicationElement: Locator;

    /**
     * The locator for the Marketing Campaign project button.
     */
    private readonly marketingCampaignElement: Locator;

    /**
     * The locator for the Logout button.
     */
    public readonly logoutButton: Locator;

    /**
     * The columns in the project management board.
     */
    public readonly Columns: Array<Column> = [];

    /**
     * Constructs a new instance of the ProjectsPage class.
     * @param page - The Playwright page object.
     */
    constructor(page: Page) {
        this.page = page;
        this.webApplicationElement = page.locator('button:has-text("Web Application")');
        this.mobileApplicationElement = page.locator('button:has-text("Mobile Application")');
        this.marketingCampaignElement = page.locator('button:has-text("Marketing Campaign")');
        this.logoutButton = page.locator('button:has-text("Logout")');

        this.Columns = [
            {
                name: ColumnName.ToDo,
                items: [],
                locator: page.locator(`h2:has-text("${ColumnName.ToDo}")`).locator('..')
            },
            {
                name: ColumnName.InProgress,
                items: [],
                locator: page.locator(`h2:has-text("${ColumnName.InProgress}")`).locator('..')
            },
            {
                name: ColumnName.Done,
                items: [],
                locator: page.locator(`h2:has-text("${ColumnName.Done}")`).locator('..')
            },
            {
                name: ColumnName.Review,
                items: [],
                locator: page.locator(`h2:has-text("${ColumnName.Review}")`).locator('..')
            }
        ];
    }

    /**
     * Navigates to the specified project.
     * @param application - The project to navigate to.
     */
    public async goToProject(application: Project): Promise<void> {
        switch (application) {
            case Project.WebApplication:
                await this.webApplicationElement.click();
                break;
            case Project.MobileApplication:
                await this.mobileApplicationElement.click();
                break;
            case Project.MarketingCampaign:
                await this.marketingCampaignElement.click();
                break;
        }
        await this.updateColumns();
    }

    /**
     * Updates the columns with the latest card items.
     */
    public async updateColumns(): Promise<void> {
        for (const column of this.Columns) {
            column.items = await this.getItemsFromColumnLocator(column.locator);
        }
    }

    /**
     * Retrieves the card items from the specified column locator.
     * @param column - The locator for the column.
     * @returns A promise that resolves to an array of CardContent.
     */
    private async getItemsFromColumnLocator(column: Locator): Promise<CardContent[]> {
        const cards: CardContent[] = [];
        const cardContainers = column.locator('div.bg-white.p-4');

        const cardCount = await cardContainers.count();

        for (let i = 0; i < cardCount; i++) {
            const cardContent: CardContent = {
                title: '',
                container: cardContainers.nth(i),
                description: '',
                tags: [],
                assignee: '',
                dueDate: '',
            };

            try {
                const container = cardContent.container;

                // Extract title
                const titleElement = container.locator('h3:first-child');
                await titleElement.waitFor({ state: 'visible' });
                const title = (await titleElement.textContent()) || '';
                cardContent.title = title.trim();

                // Extract description
                const descriptionElement = container.locator('h3 + p');
                await descriptionElement.waitFor({ state: 'visible' });
                const description = (await descriptionElement.textContent()) || '';
                cardContent.description = description.trim();

                // Extract tags
                const tagsElements = container.locator('div.flex-wrap > span');
                const tagsCount = await tagsElements.count();
                for (let j = 0; j < tagsCount; j++) {
                    const tagText = await tagsElements.nth(j).textContent();
                    if (tagText) {
                        cardContent.tags.push(tagText.trim());
                    }
                }

                // Extract assignee
                const assigneeElement = container.locator('svg.lucide-user + span');
                if (await assigneeElement.count() > 0) {
                    const assignee = (await assigneeElement.textContent()) || '';
                    cardContent.assignee = assignee.trim();
                }

                // Extract due date
                const dueDateElement = container.locator('svg.lucide-calendar + span');
                if (await dueDateElement.count() > 0) {
                    const dueDate = (await dueDateElement.textContent()) || '';
                    cardContent.dueDate = dueDate.trim();
                }

                // Add card to the list
                cards.push(cardContent);
            } catch (error) {
                console.error(`Error processing card ${i}: ${error}`);
            }
        }
        return cards;
    }
}