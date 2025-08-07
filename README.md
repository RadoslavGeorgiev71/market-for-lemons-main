# Market for Lemons!
> This repository contains the code for the Market for Lemons project, a collaboration between A, B, C, and D.

## Current To-do
- Implement generic seeded-shuffle method based on UID.
- Randomly push a UID for interaction
- Create a state for each step of the study.
  - Domain (1 - N)
    - Within a domain, completing a task (1 - M)
  - Pre-task
  - Post-task
  - Revoked consent
  - Completion
- Create a nice UI for selecting models.

- Store in the DB what condition a user belongs to:
  - Level of disclosure—`NO, PARTIAL, FULL`
  - Density of lemons—`LOW, MED, HIGH`

- Add modular steps that can happen once a user selects an agent.
  - For now, follow guidelines of docs.

- Add `env.example` file.
## Instructions to Run
We highly recommend using [pnpm](https://pnpm.io/) as your node package manager.

Install all required packages using
```bash
pnpm i
```

And run the application in *development* mode using
```bash
pnpm run dev
```


### Contributor Notes
> To-do