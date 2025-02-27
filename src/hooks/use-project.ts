
import React, { useState, useEffect } from "react";

import { useLocalStorage } from 'usehooks-ts';

export interface Project {
  id: string;
  name: string;
  githubUrl: string;

}

const useProject = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectId, setProjectId] = useLocalStorage('projectId', '');

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects/projectlist');
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const project = projects.find((project) => project.id === projectId);

  return { projects, project, projectId, setProjectId, fetchProjects };
};

export default useProject;