// hooks/useRefreshProjects.ts
import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import useProject from './use-project';

const useRefreshProjects = () => {
  const router = useRouter();
  // Get the whole hook result
  const projectHook = useProject();

  const refreshProjects = useCallback(async () => {
    // Access fetchProjects through projectHook
    await projectHook.fetchProjects();
    router.refresh();
  }, [projectHook.fetchProjects, router]);

  return refreshProjects;
};

export default useRefreshProjects;