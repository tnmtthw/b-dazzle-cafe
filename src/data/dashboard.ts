// src\data\dashboard.ts

import useSWR from 'swr';

const fetcher = async (url: string | URL | Request) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch data');
  }
  return response.json();
};

export function useDasboard() {
  const { data, error, isLoading, mutate } = useSWR(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/count/dashboard`, fetcher);

  return {
    data,
    error,
    isLoading,
    mutate
  };
}

export function useRecent() {
  const { data, error, isLoading, mutate } = useSWR(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/count/dashboard/recent`, fetcher);

  return {
    data,
    error,
    isLoading,
    mutate
  };
}
