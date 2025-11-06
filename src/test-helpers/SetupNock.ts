import assert from "assert";
import nock, { type BackMode } from "nock";
import path from "path";

const StringUtils = {
  slugify: (str: string) => str.toLowerCase().replace(/ /g, "_"),
  isOneOf: <T extends string>(str: string, arr: T[]): str is T =>
    arr.includes(str as T),
};

const allNockModes = [
  "record", // Only record for tests not-yet-recorded. Existing recordings used.
  "lockdown", // Use recorded nocks, disable all http calls when not nocked, no record
  "wild", // all requests go to internet, no replay, no record
  "dryrun", // Default, use recorded nocks, allow http calls, no record, useful for new tests
  "update", // remove recorded nocks, record new nocks
] satisfies BackMode[];

/**
 * Sets up nock for HTTP request recording and replay in tests.
 *
 * This function configures nock to use recorded HTTP request fixtures for the current test.
 * The fixture file is automatically named based on the test name and stored in a
 * `__recordings__` directory adjacent to the test file.
 *
 * @param options - Configuration options for nock setup
 * @param options.mode - The nock mode to use. Only 'lockdown' is allowed as a parameter
 *   (other modes can be set via NOCK_MODE environment variable). In 'lockdown' mode,
 *   nock uses recorded fixtures and blocks all HTTP calls that aren't mocked.
 * @param options.testName - Optional test name to use for the fixture file. If not provided,
 *   the function attempts to automatically detect the test name from Jest's test state.
 *
 * @returns A cleanup function that should be called after the test completes to finalize
 *   recordings and restore nock state. Typically used in `afterEach` hooks.
 *
 * @throws {assert.AssertionError} If the test name cannot be determined automatically
 *   and no testName is provided.
 *
 * @example
 * ```typescript
 * describe('MyService', () => {
 *   let cleanupNock: () => void;
 *
 *   beforeEach(async () => {
 *     cleanupNock = await setupNock();
 *   });
 *
 *   afterEach(() => {
 *     cleanupNock();
 *   });
 *
 *   it('should make HTTP requests', async () => {
 *     // Test code that makes HTTP requests
 *   });
 * });
 * ```
 */
export async function setupNock(
  options: {
    mode?: "lockdown" /* only allow 'lockdown' because we never should check in anything else; overridden by NOCK_MODE env var */;
    testName?: string;
  } = {}
): Promise<() => void> {
  const currentTestName =
    options.testName ?? expect.getState()?.currentTestName;

  assert(
    currentTestName,
    "The test name is not automatically available in this context. Please provide it manually as the testName parameter."
  );

  const fixtureFileName = `${StringUtils.slugify(currentTestName)}.json`;
  const mode =
    process.env.NOCK_MODE ?? options.mode ?? ("lockdown" satisfies BackMode);
  assertValidNockMode(mode);

  const testDirectory = path.dirname(expect.getState().testPath!);
  nock.back.fixtures = `${testDirectory}/__recordings__`;
  nock.back.setMode(mode);
  // We typically shouldn't be active here, but in case we are...
  if (!nock.isActive()) {
    nock.activate();
  }

  const back = await nock.back(fixtureFileName, {});

  return () => {
    back.nockDone();
    nock.restore();
  };
}

function assertValidNockMode(nockMode: string): asserts nockMode is BackMode {
  if (!StringUtils.isOneOf(nockMode, allNockModes)) {
    throw new Error(
      `Invalid NOCK_MODE: '${nockMode}'; valid values: ${allNockModes}`
    );
  }
}
