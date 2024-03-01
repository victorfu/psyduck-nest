import localForage from "localforage";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export async function authenticatedFetch<T = unknown>(
  endpoint: string,
  method: HttpMethod = "GET",
  body: object | null = null,
  applicationJson = true,
): Promise<T> {
  const access_token: string | null = await localForage.getItem("access_token");
  if (!access_token) {
    throw new Error("Access token not found. User is not authenticated.");
  }

  const options: RequestInit = {
    method,
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  };

  if (applicationJson) {
    options.headers = {
      ...options.headers,
      "Content-Type": "application/json",
    };
  }

  if (body && applicationJson) {
    options.body = JSON.stringify(body);
  } else if (body) {
    options.body = body as unknown as BodyInit;
  }

  const response = await fetch(endpoint, options);

  if (!response.ok) {
    if (!response.ok) {
      const contentType = response.headers.get("Content-Type");
      let errorDetails;

      if (contentType && contentType.includes("application/json")) {
        const errorJson = await response.json();
        errorDetails = JSON.stringify(errorJson);
      } else {
        const errorText = await response.text();
        errorDetails = errorText;
      }

      throw new Error(
        `Request failed with status ${response.status}: ${errorDetails}`,
      );
    }
  }

  const contentType = response.headers.get("Content-Type");
  if (contentType && contentType.includes("application/json")) {
    return response.json();
  } else {
    const textResponse = await response.text();
    return textResponse as unknown as T;
  }
}
