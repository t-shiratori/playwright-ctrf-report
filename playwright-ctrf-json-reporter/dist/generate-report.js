"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
class GenerateCtrfReport {
    constructor(config) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t;
        this.reporterName = 'playwright-ctrf-json-reporter';
        this.defaultOutputFile = 'ctrf-report.json';
        this.defaultOutputDir = 'ctrf';
        this.reporterConfigOptions = {
            outputFile: (_a = config === null || config === void 0 ? void 0 : config.outputFile) !== null && _a !== void 0 ? _a : this.defaultOutputFile,
            outputDir: (_b = config === null || config === void 0 ? void 0 : config.outputDir) !== null && _b !== void 0 ? _b : this.defaultOutputDir,
            minimal: (_c = config === null || config === void 0 ? void 0 : config.minimal) !== null && _c !== void 0 ? _c : false,
            screenshot: (_d = config === null || config === void 0 ? void 0 : config.screenshot) !== null && _d !== void 0 ? _d : false,
            annotations: (_e = config === null || config === void 0 ? void 0 : config.annotations) !== null && _e !== void 0 ? _e : false,
            testType: (_f = config === null || config === void 0 ? void 0 : config.testType) !== null && _f !== void 0 ? _f : 'e2e',
            appName: (_g = config === null || config === void 0 ? void 0 : config.appName) !== null && _g !== void 0 ? _g : undefined,
            appVersion: (_h = config === null || config === void 0 ? void 0 : config.appVersion) !== null && _h !== void 0 ? _h : undefined,
            osPlatform: (_j = config === null || config === void 0 ? void 0 : config.osPlatform) !== null && _j !== void 0 ? _j : undefined,
            osRelease: (_k = config === null || config === void 0 ? void 0 : config.osRelease) !== null && _k !== void 0 ? _k : undefined,
            osVersion: (_l = config === null || config === void 0 ? void 0 : config.osVersion) !== null && _l !== void 0 ? _l : undefined,
            buildName: (_m = config === null || config === void 0 ? void 0 : config.buildName) !== null && _m !== void 0 ? _m : undefined,
            buildNumber: (_o = config === null || config === void 0 ? void 0 : config.buildNumber) !== null && _o !== void 0 ? _o : undefined,
            buildUrl: (_p = config === null || config === void 0 ? void 0 : config.buildUrl) !== null && _p !== void 0 ? _p : undefined,
            repositoryName: (_q = config === null || config === void 0 ? void 0 : config.repositoryName) !== null && _q !== void 0 ? _q : undefined,
            repositoryUrl: (_r = config === null || config === void 0 ? void 0 : config.repositoryUrl) !== null && _r !== void 0 ? _r : undefined,
            branchName: (_s = config === null || config === void 0 ? void 0 : config.branchName) !== null && _s !== void 0 ? _s : undefined,
            testEnvironment: (_t = config === null || config === void 0 ? void 0 : config.testEnvironment) !== null && _t !== void 0 ? _t : undefined,
        };
        this.ctrfReport = {
            results: {
                tool: {
                    name: 'playwright',
                },
                summary: {
                    tests: 0,
                    passed: 0,
                    failed: 0,
                    pending: 0,
                    skipped: 0,
                    other: 0,
                    start: 0,
                    stop: 0,
                },
                tests: [],
            },
        };
        this.ctrfEnvironment = {};
    }
    onBegin(_config, suite) {
        var _a, _b, _c;
        this.suite = suite;
        this.startTime = Date.now();
        this.ctrfReport.results.summary.start = this.startTime;
        if (!fs_1.default.existsSync((_a = this.reporterConfigOptions.outputDir) !== null && _a !== void 0 ? _a : this.defaultOutputDir)) {
            fs_1.default.mkdirSync((_b = this.reporterConfigOptions.outputDir) !== null && _b !== void 0 ? _b : this.defaultOutputDir, { recursive: true });
        }
        this.setEnvironmentDetails(this.reporterConfigOptions);
        if (this.hasEnvironmentDetails(this.ctrfEnvironment)) {
            this.ctrfReport.results.environment = this.ctrfEnvironment;
        }
        this.setFilename((_c = this.reporterConfigOptions.outputFile) !== null && _c !== void 0 ? _c : this.defaultOutputFile);
    }
    onEnd() {
        this.ctrfReport.results.summary.stop = Date.now();
        if (this.suite !== undefined) {
            if (this.suite.allTests().length > 0) {
                this.processSuite(this.suite);
                this.ctrfReport.results.summary.suites = this.countSuites(this.suite);
            }
        }
        this.writeReportToFile(this.ctrfReport);
    }
    processSuite(suite) {
        for (const test of suite.tests) {
            this.processTest(test);
        }
        for (const childSuite of suite.suites) {
            this.processSuite(childSuite);
        }
    }
    processTest(testCase) {
        if (testCase.results.length === 0) {
            return;
        }
        const latestResult = testCase.results[testCase.results.length - 1];
        if (latestResult !== undefined) {
            this.updateCtrfTestResultsFromTestResult(testCase, latestResult, this.ctrfReport);
            this.updateSummaryFromTestResult(latestResult, this.ctrfReport);
        }
    }
    setFilename(filename) {
        if (filename.endsWith('.json')) {
            this.reporterConfigOptions.outputFile = filename;
        }
        else {
            this.reporterConfigOptions.outputFile = `${filename}.json`;
        }
    }
    updateCtrfTestResultsFromTestResult(testCase, testResult, ctrfReport) {
        var _a, _b, _c, _d, _e;
        const test = {
            name: testCase.title,
            status: this.mapPlaywrightStatusToCtrf(testResult.status),
            duration: testResult.duration,
        };
        if (this.reporterConfigOptions.minimal === false) {
            test.start = this.updateStart(testResult.startTime);
            test.stop = this.calculateStopTime(testResult.startTime, testResult.duration);
            test.message = this.extractFailureDetails(testResult).message;
            test.trace = this.extractFailureDetails(testResult).trace;
            test.rawStatus = testResult.status;
            test.tags = this.extractTagsFromTitle(testCase.title);
            test.type = (_a = this.reporterConfigOptions.testType) !== null && _a !== void 0 ? _a : 'e2e';
            test.filePath = testCase.location.file;
            test.retries = testResult.retry;
            test.flaky = testResult.status === 'passed' && testResult.retry > 0;
            test.steps = [];
            if (testResult.steps.length > 0) {
                testResult.steps.forEach((step) => {
                    this.processStep(test, step);
                });
            }
            if (this.reporterConfigOptions.screenshot === true) {
                test.screenshot = this.extractScreenshotBase64(testResult);
            }
            test.suite = this.buildSuitePath(testCase);
            if (((_b = this.extractMetadata(testResult)) === null || _b === void 0 ? void 0 : _b.name) !== undefined ||
                ((_c = this.extractMetadata(testResult)) === null || _c === void 0 ? void 0 : _c.version) !== undefined)
                test.browser = `${(_d = this.extractMetadata(testResult)) === null || _d === void 0 ? void 0 : _d.name} ${(_e = this.extractMetadata(testResult)) === null || _e === void 0 ? void 0 : _e.version}`;
            if (this.reporterConfigOptions.annotations !== undefined) {
                test.extra = { annotations: testCase.annotations };
            }
        }
        ctrfReport.results.tests.push(test);
    }
    updateSummaryFromTestResult(testResult, ctrfReport) {
        ctrfReport.results.summary.tests++;
        const ctrfStatus = this.mapPlaywrightStatusToCtrf(testResult.status);
        if (ctrfStatus in ctrfReport.results.summary) {
            ctrfReport.results.summary[ctrfStatus]++;
        }
        else {
            ctrfReport.results.summary.other++;
        }
    }
    mapPlaywrightStatusToCtrf(testStatus) {
        switch (testStatus) {
            case 'passed':
                return 'passed';
            case 'failed':
            case 'timedOut':
            case 'interrupted':
                return 'failed';
            case 'skipped':
                return 'skipped';
            case 'pending':
                return 'pending';
            default:
                return 'other';
        }
    }
    setEnvironmentDetails(reporterConfigOptions) {
        if (reporterConfigOptions.appName !== undefined) {
            this.ctrfEnvironment.appName = reporterConfigOptions.appName;
        }
        if (reporterConfigOptions.appVersion !== undefined) {
            this.ctrfEnvironment.appVersion = reporterConfigOptions.appVersion;
        }
        if (reporterConfigOptions.osPlatform !== undefined) {
            this.ctrfEnvironment.osPlatform = reporterConfigOptions.osPlatform;
        }
        if (reporterConfigOptions.osRelease !== undefined) {
            this.ctrfEnvironment.osRelease = reporterConfigOptions.osRelease;
        }
        if (reporterConfigOptions.osVersion !== undefined) {
            this.ctrfEnvironment.osVersion = reporterConfigOptions.osVersion;
        }
        if (reporterConfigOptions.buildName !== undefined) {
            this.ctrfEnvironment.buildName = reporterConfigOptions.buildName;
        }
        if (reporterConfigOptions.buildNumber !== undefined) {
            this.ctrfEnvironment.buildNumber = reporterConfigOptions.buildNumber;
        }
        if (reporterConfigOptions.buildUrl !== undefined) {
            this.ctrfEnvironment.buildUrl = reporterConfigOptions.buildUrl;
        }
        if (reporterConfigOptions.repositoryName !== undefined) {
            this.ctrfEnvironment.repositoryName = reporterConfigOptions.repositoryName;
        }
        if (reporterConfigOptions.repositoryUrl !== undefined) {
            this.ctrfEnvironment.repositoryUrl = reporterConfigOptions.repositoryUrl;
        }
        if (reporterConfigOptions.branchName !== undefined) {
            this.ctrfEnvironment.branchName = reporterConfigOptions.branchName;
        }
        if (reporterConfigOptions.testEnvironment !== undefined) {
            this.ctrfEnvironment.testEnvironment =
                reporterConfigOptions.testEnvironment;
        }
    }
    hasEnvironmentDetails(environment) {
        return Object.keys(environment).length > 0;
    }
    extractMetadata(testResult) {
        const metadataAttachment = testResult.attachments.find((attachment) => attachment.name === 'metadata.json');
        if ((metadataAttachment === null || metadataAttachment === void 0 ? void 0 : metadataAttachment.body) !== null &&
            (metadataAttachment === null || metadataAttachment === void 0 ? void 0 : metadataAttachment.body) !== undefined) {
            try {
                const metadataRaw = metadataAttachment.body.toString('utf-8');
                return JSON.parse(metadataRaw);
            }
            catch (e) {
                if (e instanceof Error) {
                    console.error(`Error parsing browser metadata: ${e.message}`);
                }
                else {
                    console.error('An unknown error occurred in parsing browser metadata');
                }
            }
        }
        return null;
    }
    updateStart(startTime) {
        const date = new Date(startTime);
        const unixEpochTime = Math.floor(date.getTime() / 1000);
        return unixEpochTime;
    }
    calculateStopTime(startTime, duration) {
        const startDate = new Date(startTime);
        const stopDate = new Date(startDate.getTime() + duration);
        return Math.floor(stopDate.getTime() / 1000);
    }
    buildSuitePath(test) {
        const pathComponents = [];
        let currentSuite = test.parent;
        while (currentSuite !== undefined) {
            if (currentSuite.title !== '') {
                pathComponents.unshift(currentSuite.title);
            }
            currentSuite = currentSuite.parent;
        }
        return pathComponents.join(' > ');
    }
    extractTagsFromTitle(title) {
        const tagPattern = /@\w+/g;
        const tags = title.match(tagPattern);
        return tags !== null && tags !== void 0 ? tags : [];
    }
    extractScreenshotBase64(testResult) {
        var _a;
        const screenshotAttachment = testResult.attachments.find((attachment) => attachment.name === 'screenshot' &&
            (attachment.contentType === 'image/jpeg' ||
                attachment.contentType === 'image/png'));
        return (_a = screenshotAttachment === null || screenshotAttachment === void 0 ? void 0 : screenshotAttachment.body) === null || _a === void 0 ? void 0 : _a.toString('base64');
    }
    extractFailureDetails(testResult) {
        if ((testResult.status === 'failed' ||
            testResult.status === 'timedOut' ||
            testResult.status === 'interrupted') &&
            testResult.error !== undefined) {
            const failureDetails = {};
            if (testResult.error.message !== undefined) {
                failureDetails.message = testResult.error.message;
                if (testResult.error.snippet !== undefined) {
                    failureDetails.message += testResult.error.snippet;
                }
            }
            if (testResult.error.stack !== undefined) {
                failureDetails.trace = testResult.error.stack;
            }
            return failureDetails;
        }
        return {};
    }
    countSuites(suite) {
        let count = 0;
        suite.suites.forEach((childSuite) => {
            count += this.countSuites(childSuite);
        });
        return count;
    }
    writeReportToFile(data) {
        var _a, _b;
        const filePath = path_1.default.join((_a = this.reporterConfigOptions.outputDir) !== null && _a !== void 0 ? _a : this.defaultOutputDir, (_b = this.reporterConfigOptions.outputFile) !== null && _b !== void 0 ? _b : this.defaultOutputFile);
        const str = JSON.stringify(data, null, 2);
        try {
            fs_1.default.writeFileSync(filePath, str + '\n');
            console.log(`${this.reporterName}: successfully written ctrf json to %s/%s`, this.reporterConfigOptions.outputDir, this.reporterConfigOptions.outputFile);
        }
        catch (error) {
            console.error(`Error writing ctrf json report:, ${String(error)}`);
        }
    }
    processStep(test, step) {
        var _a;
        if (step.category === 'test.step') {
            const stepStatus = step.error === undefined
                ? this.mapPlaywrightStatusToCtrf('passed')
                : this.mapPlaywrightStatusToCtrf('failed');
            const currentStep = {
                name: step.title,
                status: stepStatus,
            };
            (_a = test.steps) === null || _a === void 0 ? void 0 : _a.push(currentStep);
        }
        const childSteps = step.steps;
        if (childSteps.length > 0) {
            childSteps.forEach((cStep) => {
                this.processStep(test, cStep);
            });
        }
    }
}
exports.default = GenerateCtrfReport;
