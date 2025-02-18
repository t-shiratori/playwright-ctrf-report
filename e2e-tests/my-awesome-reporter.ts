import type {
    Reporter,
    FullConfig,
    Suite,
    TestCase,
    TestResult,
    FullResult,
  } from "@playwright/test/reporter";
  
  class MyReporter implements Reporter {
    constructor(options: { customOption?: string } = {}) {
      console.log(
        `my-awesome-reporter setup with customOption set to ${options.customOption}`
      );
    }
  
    onBegin(config: FullConfig, suite: Suite) {
      console.log(`Starting the run with ${suite.allTests().length} tests`);
    }
  
    onTestBegin(test: TestCase) {
      console.log(`Starting test ${test.title}`);
    }
  
    onTestEnd(test: TestCase, result: TestResult) {
      console.log(`Finished test ${test.title}: ${result.status}`);
      console.log(`Snippet : ${result?.error?.snippet}`);
    }
  
    onStdErr(chunk: Buffer, test: TestCase, result: TestResult) {
      console.log(`onStdErr chunk : ${chunk}`);
      console.log(`onStdErr test : ${test}`);
      console.log(`onStdErr result : ${result}`);
    }
  
    onEnd(result: FullResult) {
      console.log(`Finished the run: ${result.status}`);
    }
  }
  export default MyReporter;
  