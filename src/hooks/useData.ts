import { useEffect, useState } from "react";
import apiClient from "../services/api-client";
import { AxiosRequestConfig } from "axios";

interface FetchResponse<T> {
  count: number;
  results: T[];
}

interface EntityWithId {
  _id: string;
}

const useData = <T extends EntityWithId, TServerExpected>(
  endpoint: string,
  requestConfig?: AxiosRequestConfig,
  deps: readonly unknown[] = []
) => {
  const [data, setData] = useState<T[]>([]);
  const [count, setCount] = useState<number>(0);
  const [error, setError] = useState<string>("");
  const [isLoading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const loadData = async () => {
      setLoading(true);
      try {
        const response = await apiClient.get<FetchResponse<T>>(endpoint, {
          signal: controller.signal,
          ...requestConfig,
        });
        if (isMounted) {
          setData(response.data.results);
          setCount(response.data.count);
          setLoading(false);
        }
      } catch (err) {
        if (err instanceof Error && !controller.signal.aborted) {
          setError(err.message);
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
      controller.abort();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, endpoint]); 

  const create = async (entity: TServerExpected) => {
    try {
      const response = await apiClient.post<T>(endpoint, entity);
      setData((prevData) => [response.data, ...prevData]);
      setCount((prevCount) => prevCount + 1);
    } catch (error) {
      setError("Failed to create entity.");
    }
  };

  const deleteEntity = async (deleteId: string) => {
    try {
      await apiClient.delete(`${endpoint}/${deleteId}`);
      setData((prevData) => prevData.filter((item) => item._id !== deleteId));
      setCount((prevCount) => prevCount - 1);
    } catch (error) {
      setError("Failed to delete entity.");
    }
  };

  return {
    data,
    error,
    isLoading,
    count,
    create,
    deleteEntity,
  };
};

export default useData;
