# Nightwatch / Bug Repellent

Nightwatch is a browser-based sound-frequency exploration tool for learning about insects, rodents, bats, and other wildlife. Select a subject to view short field notes, habitat information, seasonal context, protection guidance, and an experimental frequency starting point.

## Run Locally

Requirements:

- Node.js 24 or newer
- pnpm 10 or newer

Install dependencies from the repository root:

```bash
pnpm install
```

Start the development server:

```bash
pnpm run dev
```

Open [http://localhost:5173](http://localhost:5173).

The root `dev` script supplies local defaults for `PORT` and `BASE_PATH`, which are required by the Vite configuration. To use another port:

```bash
PORT=5174 pnpm run dev
```

## Useful Commands

```bash
pnpm run typecheck
PORT=5173 BASE_PATH=/ pnpm --filter @workspace/ultrasonic-bug-repellent run build
```

The frontend package lives in `artifacts/ultrasonic-bug-repellent`. It uses React, Vite, TypeScript, Tailwind CSS, and the Web Audio API.

## What It Does

- Provides frequency and signal-strength controls.
- Offers presets for flying insects, crawling insects, garden pests, and wildlife.
- Shows dynamic educational notes for each preset, sourced from Wikipedia overviews.
- Uses distinct Icons8 and Noun Project pest illustrations with active/inactive states.
- Includes practical prevention guidance, such as reducing standing water, sealing entry points, and protecting food or plants.

## Important Limitations

The frequency values are research and exploration starting points, not proven pest-control settings. There is no single ultrasonic frequency that reliably repels every insect, rodent, or wild animal. Browser audio and built-in speakers may also be unable to reproduce true ultrasonic frequencies accurately.

Do not use the app as a substitute for medical, wildlife, or licensed pest-control advice. Take extra care around stinging insects, bats, rodents, and suspected disease exposure.

## Attribution

- Pest icons are provided through [Icons8](https://icons8.com/).
- The cricket insect illustration is from [The Noun Project](https://thenounproject.com/icon/cricket-insect-1976090/), created by ProSymbols.
- Educational links point to relevant [Wikipedia](https://www.wikipedia.org/) articles for further reading.

## Project Structure

```text
artifacts/ultrasonic-bug-repellent/  Main React/Vite application
attached_assets/                    Local project assets
lib/                                Shared API, database, and schema packages
scripts/                            Workspace scripts
```
