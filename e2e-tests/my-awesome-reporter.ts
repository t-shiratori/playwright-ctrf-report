import type {
  Reporter,
  FullConfig,
  Suite,
  TestCase,
  TestResult,
  FullResult,
  TestError,
} from '@playwright/test/reporter';

class MyReporter implements Reporter {
  constructor(options: { customOption?: string } = {}) {
    console.log(
      `[my-awesome-reporter] setup with customOption set to ${options.customOption}`
    );
  }

  onBegin(config: FullConfig, suite: Suite) {
    console.log(
      `[my-awesome-reporter] Starting the run with ${
        suite.allTests().length
      } tests`
    );
  }

  onTestBegin(test: TestCase) {
    console.log(`[my-awesome-reporter] Starting test ${test.title}`);
  }

  onTestEnd(test: TestCase, result: TestResult) {
    console.log(
      `[my-awesome-reporter] Finished test ${test.title}: ${result.status}`
    );
    console.log(`[my-awesome-reporter] Snippet : ${result?.error?.snippet}`);
    console.log(`[my-awesome-reporter] Message : ${result?.error?.message}`);
  }

  onStdErr(chunk: Buffer, test: TestCase, result: TestResult) {
    console.log(`[my-awesome-reporter] onStdErr chunk : ${chunk}`);
    console.log(`[my-awesome-reporter] onStdErr test : ${test}`);
    console.log(`[my-awesome-reporter] onStdErr result : ${result}`);
  }

  onStdOut(chunk: Buffer, test: TestCase, result: TestResult) {
    console.log(`[my-awesome-reporter] onStdOut chunk : ${chunk}`);
    console.log(`[my-awesome-reporter] onStdOut test : ${test}`);
    console.log(`[my-awesome-reporter] onStdOut result : ${result}`);
  }

  onError(error: TestError) {
    console.log(`[my-awesome-reporter] onError error : ${error}`);
  }

  onEnd(result: FullResult) {
    console.log(`[my-awesome-reporter] Finished the run: ${result.status}`);
  }
}
export default MyReporter;
