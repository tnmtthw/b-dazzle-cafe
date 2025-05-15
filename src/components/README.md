# Components Organization

This directory contains all React components used throughout the B-Dazzle Cafe application. Components are organized into the following categories for better maintainability and discoverability:

## Structure

### `/common`
Reusable components that are used across multiple features or pages.
- `CancelOrderModal.tsx` - Modal for cancelling orders with confirmation
- `EspressoSpinner.tsx` - Coffee-themed loading spinner used throughout the application
- `ErrorBoundary.tsx` - Handles React errors gracefully

### `/layout`
Components that define the structure of the application.
- `Navbar.tsx` - Main navigation component
- `MainNavbar.tsx` - Primary navigation implementation
- `AdminNavbar.tsx` - Admin-specific navigation

### `/ui`
Primitive UI components that form the building blocks of the interface.
- `Button.tsx` - Various button styles
- `Card.tsx` - Card component for displaying content

### `/features`
Feature-specific components that are tied to particular functionality.

## Best Practices

1. **Component Placement**: Place components in the appropriate directory based on their usage.
2. **Naming**: Use PascalCase for component files and component names.
3. **Organization**: Group related components together in feature-specific directories when appropriate.
4. **Exports**: Use named exports for utility components and default exports for main components.
5. **Props Interface**: Define TypeScript interfaces for component props at the top of your file.

## Examples

```tsx
// Common component example
import React from 'react';

interface ButtonProps {
  variant: 'primary' | 'secondary';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ variant, children }) => {
  return <button className={`btn-${variant}`}>{children}</button>;
};
``` 