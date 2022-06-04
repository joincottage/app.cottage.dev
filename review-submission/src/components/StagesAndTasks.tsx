import { Box, Stack, Typography } from "@mui/material";
import React, { useContext, useEffect, useMemo, useState } from "react";
import setSelectedTasks from "../actions/setSelectedTasks";
import { AppDataContext } from "../AppContext";
import useAirtable from "../hooks/useAirtable";
import StageAndTasksCard from "./StageAndTasksCard";

interface OwnProps {
  taskLists: string[];
}

export default function StagesAndTasks({ taskLists }: OwnProps) {
  const { data, loading, error } = useAirtable({
    tableName: "Task List Templates",
    filterByFormula: `SEARCH(Type, '${taskLists.join(",")}') > 0`,
    watch: taskLists.join(","),
  });

  const { dispatch } = useContext(AppDataContext);

  const [stages, setStages] = useState<any[] | null>(null);
  useMemo(() => {
    if (data) {
      const tasksAsStages = Object.values(
        data.reduce((acc: any, curr: any) => {
          if (acc[curr["Stage"]]) {
            acc[curr["Stage"]].push(curr);
          } else {
            acc[curr["Stage"]] = [curr];
          }

          return acc;
        }, {}) as Record<string, any>
      ).sort((a, b) =>
        a[0]["Stage Ordinal"][0] < b[0]["Stage Ordinal"][0] ? -1 : 1
      );

      setStages(tasksAsStages);
      dispatch(setSelectedTasks(tasksAsStages));
    }
  }, [data, taskLists.join(",")]);

  return (
    <Box mt={1}>
      <Typography variant="h5" gutterBottom>
        {"Stages & Tasks"}
      </Typography>
      <Stack direction="row" spacing={2}>
        {stages &&
          stages.map((s: any) => (
            <StageAndTasksCard
              taskList={s}
              ordinal={s[0]["Stage Ordinal"][0]}
            />
          ))}
      </Stack>
    </Box>
  );
}
