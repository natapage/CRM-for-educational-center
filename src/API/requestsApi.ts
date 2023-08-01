export const getEntity = async <R>(url: string): Promise<R> => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch");
    }
    return (await response.json()).data;
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : "unknown error");
  }
};

export const deleteEntity = async <R>(url: string): Promise<R> => {
  try {
    const response = await fetch(url, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete");
    }

    return response.json();
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : "unknown error");
  }
};

export const createEntity = async <R, T>(body: T, url: string): Promise<R> => {
  try {
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify({ data: body }),
      headers: {
        "Content-type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Failed to create");
    }
    return response.json();
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : "unknown error");
  }
};

export const editEntity = async <R, T>(body: T, url: string): Promise<R> => {
  try {
    const response = await fetch(url, {
      method: "PUT",
      body: JSON.stringify({ data: body }),
      headers: {
        "Content-type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to edit");
    }

    return response.json();
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : "unknown error");
  }
};

