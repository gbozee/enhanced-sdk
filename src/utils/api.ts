type FetchOptions = {
  raw?: boolean;
  headers?: any;
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
};
export async function getFetcher(path: string, options?: FetchOptions) {
  const {
    raw,
    headers,
    method = "GET",
  } = options || {
    raw: false,
    headers: {},
  };
  try {
    let response = await fetch(`${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    });
    if (raw) {
      return response;
    }
    if (response.status === 404) {
      throw new Error("Not found! Url is not correct");
    }
    if (response.status < 400) {
      return await response.json();
    }
  } catch (error) {
    throw error;
  }
}
export async function postFetcher(
  path: string,
  body: any,
  options?: FetchOptions
) {
  const {
    raw,
    headers,
    method = "POST",
  } = options || {
    raw: false,
    headers: {},
  };
  try {
    let response = await fetch(`${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: JSON.stringify(body),
    });
    if (raw) {
      return response;
    }
    if (response.status < 400) {
      return await response.json();
    }
  } catch (error) {
    throw error;
  }
  return;
}

export async function validateResponse(response: Response) {
  if (response.status === 401) {
    throw new Error(
      "Unauthorized. Please call updateAuthToken method with your credentials first"
    );
  }
  if (response.status === 400) {
    const result = await response.json();
    throw new Error(result.message);
  }
  const result = await response.json();
  if (response.status < 400) {
    if (!result.status) {
      throw new Error(result.message);
    }
  }
  return result.data;
}
