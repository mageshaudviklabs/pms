
import { useState, useCallback } from 'react';

export const useNavigation = () => {
  const [activeNav, setActiveNav] = useState('command');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  const handleNavChange = useCallback((id: string) => {
    setActiveNav(id);
    if (id === 'projects') {
      setSelectedProjectId(null);
    }
  }, []);

  const navigateToProject = useCallback((projectId: string) => {
    setSelectedProjectId(projectId);
    setActiveNav('projects');
  }, []);

  const resetNavigation = useCallback(() => {
    setActiveNav('command');
    setSelectedProjectId(null);
  }, []);

  return {
    activeNav,
    selectedProjectId,
    handleNavChange,
    navigateToProject,
    setSelectedProjectId,
    resetNavigation
  };
};
