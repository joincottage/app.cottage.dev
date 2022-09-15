const queryParams: Record<string, any> = new Proxy(
    new URLSearchParams(window.location.search),
    {
      get: (searchParams, prop) => searchParams.get(prop as string),
    }
  );
  
  export default queryParams;
  
  export const setQueryParam = (prop: string, value: string) => {
    if (window.history.pushState) {
      var newurl =
        window.location.protocol +
        "//" +
        window.location.host +
        window.location.pathname +
        `?${prop}=${value}`;
      window.history.pushState({ path: newurl }, "", newurl);
    }
  };
  