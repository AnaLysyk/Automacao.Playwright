import { test as base, expect } from '@playwright/test';
import { EnvConfig, loadEnv } from '../config/env';

type Fixtures = {
  env: EnvConfig;
};

export const test = base.extend<Fixtures>({
  env: async ({}, use) => {
    await use(loadEnv());
  },
});

export { expect };
