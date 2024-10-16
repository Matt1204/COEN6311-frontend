import { useState, useCallback, useContext } from 'react';
import axios, { AxiosError } from 'axios'; // Import AxiosError for type checking

// Define the types for the function parameters
type ReqType = 'GET' | 'POST' | 'DELETE' | 'PATCH';

interface Headers {
  [key: string]: string;
}

type ErrorResponse = {
  message: string;
};

function useHttpHook() {
  const [loading, setLoading] = useState<boolean>(false);
  const [commuError, setCommuError] = useState<string>('');

  const handleCloseCommuError = useCallback(() => {
    setCommuError('');
  }, []);

  const httpRequest = useCallback(
    async (url: string, data: any, reqType: ReqType, headers: Headers) => {
      setLoading(true);
      try {
        // append header
        const axiosConfig = {
          withCredentials: true,
          headers: {
            ...headers,
          },
        };

        let response;
        switch (reqType) {
          case 'GET':
          case 'DELETE':
            response = await axios[reqType.toLowerCase() as 'get' | 'delete'](
              url,
              axiosConfig
            );
            break;
          case 'POST':
          case 'PATCH':
            response = await axios[reqType.toLowerCase() as 'post' | 'patch'](
              url,
              data,
              axiosConfig
            );
            break;
          default:
            throw new Error(
              'Invalid HTTP method provided. Use GET, POST, PATCH, or DELETE.'
            );
        }
        setLoading(false);
        return response.data;
      } catch (error: unknown) {
        // Catching error as unknown type
        setLoading(false);

        if (axios.isAxiosError(error)) {
          // error realted to http request
          const serverError = error as AxiosError<ErrorResponse>;
          const errorMessage =
            serverError.response?.data?.message || 'Network or server error';
          setCommuError(errorMessage);
          throw new Error('error in useHttpHook: ' + errorMessage);
        } else {
          // generic error
          const errorMessage = 'An unexpected error occurred';
          setCommuError(errorMessage);
          throw new Error('error in useHttpHook: ' + errorMessage);
        }
      }
    },
    []
  );

  //   return [loading, commuError, handleCloseCommuError, httpRequest] as const;
  return { loading, commuError, handleCloseCommuError, httpRequest };
}

export default useHttpHook;
