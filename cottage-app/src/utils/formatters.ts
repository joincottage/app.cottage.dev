export const formatProjectAPIResponse = (p: any) => ({
    demoImage:
      p["Cover Image"] && p["Cover Image"].length > 0
        ? p["Cover Image"][0].url
        : null,
    name: p["Project Title"],
    description: p["Project Description"],
    link: p["Link"],
    recordId: p["Record ID"],
  });
  