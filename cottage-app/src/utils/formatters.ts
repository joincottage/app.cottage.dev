export const formatSubmissionsAPIResponse = (p: any) => ({
    demoImage:
      p["UX Design Images (from Tasks)"] && p["UX Design Images (from Tasks)"].length > 0
        ? p["UX Design Images (from Tasks)"][0].url
        : null,
    name: p["Name"],
    description: p["Status"],
    link: p["Stackblitz Project Link"],
    recordId: p["Record ID"],
  });
  