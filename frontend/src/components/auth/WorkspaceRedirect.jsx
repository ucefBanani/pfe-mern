import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import workspaceService from '../../services/workspaceService';

const WorkspaceRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAndRedirect = async () => {
      try {
        const list = await workspaceService.list();
        if (list.length > 0) {
          navigate(`/workspace/${list[0].id}`, { replace: true });
        } else {
          navigate('/profile', { replace: true });
        }
      } catch (err) {
        console.error('Failed to redirect to workspace:', err);
        navigate('/login', { replace: true });
      }
    };
    fetchAndRedirect();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0b0f19] text-slate-200">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-t-accentPurple border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-medium tracking-wide">Resolving workspace...</p>
      </div>
    </div>
  );
};

export default WorkspaceRedirect;
