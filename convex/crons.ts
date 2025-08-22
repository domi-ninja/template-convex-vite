import { cronJobs } from "convex/server";

const crons = cronJobs();

// Check all monitors every 2 minutes for faster detection
// crons.interval(
//   "check monitors",
//   { seconds: 30 },
//   internal.monitor.httpCheckerActions.checkAllMonitorsGlobal,
//   {}
// );

export default crons;
