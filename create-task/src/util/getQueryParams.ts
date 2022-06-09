const params = new Proxy(new URLSearchParams(window.location.search), {
  get: (searchParams, prop: string) => searchParams.get(prop),
}) as unknown as Record<string, string>;

export default params;