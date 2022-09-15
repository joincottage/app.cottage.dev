const queryParams: Record<string, any> = new Proxy(
    new URLSearchParams(window.location.search),
    {
      get: (searchParams, prop) => searchParams.get(prop as string),
    }
  );
  
  export default queryParams;
  