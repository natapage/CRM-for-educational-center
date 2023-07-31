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

export const getPhoto = async (id: number): Promise<Blob> => {
  const photoUrl = `http://localhost:1337/api/upload/files/${id}`;
  try {
    const response = await fetch(photoUrl);
    if (!response.ok) {
      throw new Error("Failed to fetch photo");
    }
    return response.blob();
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error
        ? error.message
        : "Unknown error while fetching photo"
    );
  }
};
