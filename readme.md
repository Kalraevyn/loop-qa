# README

## Running Tests

### Using npx Playwright

To run the tests using Playwright, use the following command:

```sh
npx playwright test
```

This command will execute all the tests defined in your project.

### Using Docker Compose

To run the tests using Docker Compose, follow these steps:

1. Ensure Docker and Docker Compose are installed on your machine.
2. Navigate to the directory containing your `docker-compose.yml` file.
3. Run the following command to start the services:

```sh
docker-compose up
```

This command will start all the services defined in the `docker-compose.yml` file and print test output to the shell.

```sh
docker-compose up -d
```

This command will start all the services defined in the `docker-compose.yml` file and run detached in the background.

### Reading Docker Logs

To read the logs of a specific service after detaching from a container, use the following command:

```sh
docker-compose logs <service_name>
```

Replace `<service_name>` with the name of the service you want to view logs for.

## Using the Page Object Model (POM)

### Instantiating a New POM

To instantiate a new Page Object Model (POM), you need to inject the `page` object from Playwright. Here is an example using the `ProjectsPage` class:

```typescript
import { ProjectsPage } from './projects-page';

const projectsPage = new ProjectsPage(page);
```

### Using Navigation Methods

The `ProjectsPage` class provides methods to navigate to different projects. Here is an example of how to use these methods:

```typescript
// Navigate to the Web Application project
await projectsPage.goToProject(Project.WebApplication);
```

For more detailed examples, refer to the provided files: [projects-page.ts](#file:projects-page.ts-context) and [projects-page.spec.ts](#file:projects-page.spec.ts-context).
