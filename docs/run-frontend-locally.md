The local environement relies on Bun as a package manager, but still uses Node.js to run the code as Bun runtime is still unstable with the React and Next.js ecosystems.

To get the frontend running locally, you need to:
1. Ensure Node.js is installed on your machine ([download page](https://nodejs.org/en/download))
2. Ensure Bun is installed on your machine ([installation page](https://bun.sh/docs/installation))
3. Install dependencies with `bun i`
4. Run the frontend with `bun dev`