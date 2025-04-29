import showAssignmentAction from "@/proxy/assignments/show-assignment-action";
import React from "react";
import AssignmentResult from "@/components/authenticated-content/event/event-layout/show-assignment-result";

export default async function showAssignmentResult({
  params,
}: {
  params: { eventId: string; assignmentId: string };
}) {
  const result: any = await showAssignmentAction(params.assignmentId);

  return <AssignmentResult result={result} />;
}
