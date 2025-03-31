# iQueryYou

## Overview
I Query You is a web-based, UI-focused dummy query execution application designed to simplify database interactions. The application provides an intuitive interface for writing, executing, and managing SQL queries with powerful data visualization capabilities.

## Key Features
- **Query Writing & Execution**
    - Syntax highlighting for SQL keywords
    - Query formatting
    - Query history management

- **Data Management**
    - Save and retrieve queries
    - Import new CSV data sources
    - Export query results as CSV

- **Visualization & Analysis**
    - Interactive table visualization
    - Efficient pagination for large datasets
    - Advanced table search and filtering

## Tech Stack
- **Framework**: Next.js with TypeScript
- **Package Manager**: pnpm
- **Key Packages**:
    - **Frontend**:
        - Zustand for global state management

    - **Data & Formatting**:
        - SQL-formatter for query formatting
        - Highlight.js for SQL syntax highlighting
        - Papaparse for CSV parsing

    - **User Experience**:
        - Sonner for toast notifications

## Project Resources
- **Documentation**:
    - [ER Diagram](https://drive.google.com/file/d/1Dntm7PZX20KT5GmBi0l96AF1ZRGHIrtS/view?usp=drive_link)
    - [Architecture Diagram](https://drive.google.com/file/d/11z09T1vCLxcsitnWityw0KfF5T8GWEIP/view?usp=drive_link)
    - [Explanation Document](https://drive.google.com/file/d/1lhZkn2mUjExU3ZfnTh0UU1nPX6VqEtMt/view?usp=drive_link)
- **Demo**:
    - [Demo Video](https://drive.google.com/file/d/127b0ZNaAoMDWSPAwxGb4AKaYkAZTbePl/view?usp=drive_link)

## Performance Metrics
The application has been tested across multiple geographic locations using Lighthouse in Chrome DevTools:

| Location | Performance Score | FCP | SI | LCP | TBT | CLS | Page Size |
|----------|------------------|-----|-----|-----|-----|-----|----------|
| London | 100 | 0.2 s | 0.2 s | 0.5 s | 10 ms | 0.014 | 524 KB |
| San Francisco | 100 | 0.2 s | 0.2 s | 0.5 s | 20 ms | 0.014 | 524 KB |
| Mumbai | 100 | 0.3 s | 0.3 s | 0.6 s | 70 ms | 0.014 | 524 KB |

*FCP: First Contentful Paint, SI: Speed Index, LCP: Largest Contentful Paint, TBT: Total Blocking Time, CLS: Cumulative Layout Shift*

This test has been performed on www.dotcom-tools.com and here's the [test result link](https://www.dotcom-tools.com/website-speed-test?type=summary-report&id=fd01a6eaef9a4680a7056fad18fcca38&share=1)

## Performance Optimizations
- Implemented code splitting using Next.js dynamic imports.
- Used pagination for query results to minimize DOM size.
- Used global state management to avoid unnecessary drilling.

## Getting Started
```bash
# Clone the repository
git clone https://github.com/tanmayagrwl/I-query-you.git

# Navigate to project directory
cd I-query-you

# Install dependencies
pnpm install

# Start the development server
pnpm dev
```

## License
[MIT](LICENSE)