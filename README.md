# inspire-vo-design-library

`inspire-vo-design-library` is a UI component library built using React, TypeScript, Vite, and Tailwind CSS.  It's structured as a Yarn workspace, making development and testing straightforward.  It depends on the private `one-x-ui` library for some underlying components.

## Project Structure

The workspace is organized as follows:

*   **`examples/`**: Contains example projects demonstrating how to use the `vo-ui` library.
    *   **`next-project/`**:  A Next.js project for testing.
    *   **`react-project/`**: A standard React project for testing.
*   **`packages/`**: Contains the core library code.
    *   **`vo-ui/`**: The main UI library package.
        *   **`src/`**:  Source code for the library.
            *   **`components/`**:  Individual UI components (each in its own folder).
            *   **`stories/`**: Storybook files for each component.
        *   **`playground/`**: A development playground for rapidly testing components during development. `App.tsx` is the main entry point.
    * **`external-packages`**: Contains dependencies of one-x-ui which helps managing them during install process.
* **Root Level**:
    *   **`package.json`**: The workspace's root `package.json` file, managing dependencies and scripts for the entire workspace.

## Getting Started (for Contributors)

These instructions are for developers who want to contribute to the `inspire-vo-design-library`.

1.  **Clone the Repository:**

    ```bash
    git clone <your-repository-url>
    cd inspire-vo-design-library
    ```

2.  **Install Dependencies (Important: Read Carefully!)**

    Because of the private `one-x-ui` dependency, the installation process has specific steps:

    *   **Step 1: Install Regular Dependencies (VPN OFF):**
        *   Temporarily remove `one-x-ui` from the `dependencies` section of `packages/vo-ui/package.json`.  **Do not commit this change.**
        *   Turn OFF your VPN.
        *   Run:
            ```bash
            yarn install
            ```
        This installs all publicly available packages.

    *   **Step 2: Install `one-x-ui` (VPN ON):**
        *   Turn ON your VPN.
        *   Make sure your packages/vo-ui/package.json is reverted to its original state, with one-x-ui listed.
        *   Run:
            ```bash
            yarn install_internal
            ```
            This command uses a proxy to access and install the private `one-x-ui` package. Because `packages/external-packages` lists the dependencies of one-x-ui, there is no need for additional installs.

3.  **Running the Development Playground:**

    To develop and preview components, use the playground:
    *   Navigate into the `vo-ui` directory.
    *   Start dev server:
        ```bash
        cd packages/vo-ui
        yarn dev
        ```
    This will launch a local development server (usually on `http://localhost:5173` or similar, check your console output) that renders the `vo-ui/playground/App.tsx` file.  You can modify this file to test your components.

## Creating a New Component

Follow these steps to add a new component to the library:

1.  **Component Folder:**
    *   Inside `packages/vo-ui/src/components/`, create a new folder with the name of your component (e.g., `Button`).  Use PascalCase for component names.

2.  **Component Files:**
    *   Inside your component folder (e.g., `packages/vo-ui/src/components/Button/`), create the following files:
        *   `index.ts`: This file should contain your component's code and export it as a *named* export.
            ```typescript
            // packages/vo-ui/src/components/Button/index.ts
            import React from 'react';

            interface ButtonProps {
              children: React.ReactNode;
              onClick?: () => void;
              // ... other props
            }

            // component should be named export
            export const Button: React.FC<ButtonProps> = ({ children, onClick, ...props }) => {
              return (
                <button {...props} onClick={onClick}>
                  {children}
                </button>
              );
            };
            ```
        *   `[ComponentName].stories.tsx` (e.g., `Button.stories.tsx`): Create a Storybook file for your component inside `packages/vo-ui/src/stories/`.  This allows you to visually test and document your component in isolation.
            ```typescript
            // packages/vo-ui/src/stories/Button.stories.tsx
            import React from 'react';
            import { Button } from '../components/Button'; // Import from the component's folder
            import type { Meta, StoryObj } from '@storybook/react';

            const meta: Meta<typeof Button> = {
              title: 'Components/Button',
              component: Button,
            };

            export default meta;
            type Story = StoryObj<typeof Button>;

            export const Primary: Story = {
              args: {
                children: 'Click Me',
                onClick: () => alert('Clicked!'),
              },
            };

            // ... more stories
            ```
        *  `[ComponentName].test.tsx` (e.g., `Button.test.tsx`): Create a test file for your component within the component's folder.  Write unit tests to ensure your component functions as expected.
            ```typescript
            // packages/vo-ui/src/components/Button/Button.test.tsx
            import React from 'react';
            import { render, screen, fireEvent } from '@testing-library/react';
            import { Button } from './index';

            describe('Button', () => {
              it('renders with children', () => {
                render(<Button>Click Me</Button>);
                expect(screen.getByText('Click Me')).toBeInTheDocument();
              });

              it('calls onClick when clicked', () => {
                const onClickMock = jest.fn();
                render(<Button onClick={onClickMock}>Click Me</Button>);
                fireEvent.click(screen.getByText('Click Me'));
                expect(onClickMock).toHaveBeenCalledTimes(1);
              });
            });
            ```

3.  **Export from `components/index.ts`:**
    *   Open `packages/vo-ui/src/components/index.ts` and add a named export for your new component:

        ```typescript
        // packages/vo-ui/src/components/index.ts
        export * from './Button'; // Add this line
        // ... other component exports
        ```

4.  **Update `package.json` Exports:**
    *   Open `packages/vo-ui/package.json` and add an entry to the `exports` field.  This makes your component importable from the library.

        ```json
        // packages/vo-ui/package.json
        {
          "name": "vo-ui",
          "exports": {
            ".": {
              "import": "./dist/index.js",
              "types": "./dist/index.d.ts"
            },
            "./button": {  // Add this section for your new component
              "import": "./dist/components/Button/index.js",
              "types": "./dist/components/Button/index.d.ts"
            },
            // ... other component exports
          },
          // ... rest of the package.json
        }
        ```

5. **Test Your Component:**
   *  Import in `examples/next-project` or `examples/react-project`.
        ```typescript
          import { Button } from 'vo-ui/button';
        ```
   * Use yarn build in vo-ui, then start examples project to see if component is working.

6.  **Run Storybook (Optional, but Recommended):**
    * From the `vo-ui` package directory, run:
        ```bash
        yarn storybook
        ```
     This starts the storybook to verify the component.

## Updating `one-x-ui`

When updating the `one-x-ui` library, follow these steps carefully:

1.  **Update `one-x-ui` Version:**
    *   In `packages/vo-ui/package.json`, update the version number of `one-x-ui` in the `dependencies` section.

2.  **Update `external-packages`:**
    *   Identify any new dependencies or version changes in `one-x-ui`.
    *   Update the `packages/external-packages/package.json` file to reflect these changes.  This ensures that all necessary dependencies are available during the `yarn install` process.

3.  **Reinstall Dependencies:**
    *   Follow the full installation process described in the "Install Dependencies" section above (including turning the VPN on and off).

## Usage in Other Projects
When using inspire-vo-design-library in another project, ensure that you also create a similar `external-packages` directory in that project. This external package should include the dependencies of both `one-x-ui` and `vo-ui`. This mirrors the dependency management strategy within the library itself and helps avoid installation issues related to the private npm registry and VPN usage. Any updates to dependencies in inspire-vo-design-library should be synchronized with the external-packages in consumer projects.

## Scripts

The root `package.json` contains the following useful scripts:

*   `yarn install`: Installs dependencies for the entire workspace (excluding `one-x-ui`).  Remember to turn off your VPN.
*   `yarn install_internal`: Installs the private `one-x-ui` package. Remember to turn on your VPN.
*   `yarn build`: (Run from within `packages/vo-ui`) Builds the `vo-ui` library.
*   `yarn dev`: (Run from within `packages/vo-ui`) Starts the development playground.
*   `yarn storybook`: (Run from within `packages/vo-ui`) Starts the Storybook server.
*  Other scripts may be present for linting, testing, etc. Check the `package.json` files for details.
