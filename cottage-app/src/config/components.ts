import CreateTask from "../pages/create-task";
import TaskDetails from "../pages/task-details";
import TaskOverview from "../pages/task-overview";
import ReviewSubmission from "../pages/review-submission";

const components: Record<string, () => JSX.Element | null> = {
  "create-task": CreateTask,
  "review-submission": ReviewSubmission,
  "task-details": TaskDetails,
  "task-overview": TaskOverview,
};

export default components;
