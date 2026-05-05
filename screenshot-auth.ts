// Shared between playwright.config.ts (no, it doesn't import this — see
// note below) and screenshots.spec.ts: the path of the tmpfile that
// globalSetup writes the minted Keycloak access token into.
//
// Why a tmpfile and not process.env: globalSetup runs in the main
// Playwright process; spec module-load runs in worker subprocesses.
// process.env mutations in globalSetup don't propagate to workers.
// A tmpfile written before workers spawn does.
import { tmpdir } from 'os';
import { join } from 'path';

export const TOKEN_FILE = join(tmpdir(), 'craft-screenshot-token.txt');
