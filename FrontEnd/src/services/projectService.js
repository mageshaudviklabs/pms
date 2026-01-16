export const PROJECTS_LIST = [
  { id: 'PROJ-001', name: 'ElitePMS Core', status: 'Active', category: 'Internal' },
  { id: 'PROJ-002', name: 'Client Portal', status: 'Active', category: 'Client' },
  { id: 'PROJ-003', name: 'Mobile App', status: 'Active', category: 'Product' },
  { id: 'PROJ-004', name: 'Analytics Dashboard', status: 'Active', category: 'Internal' },
  { id: 'PROJ-005', name: 'API Gateway', status: 'Active', category: 'Infrastructure' },
  { id: 'PROJ-006', name: 'Marketing Website', status: 'Active', category: 'Marketing' },
  { id: 'PROJ-007', name: 'Payment Integration', status: 'Planning', category: 'Product' },
  { id: 'PROJ-008', name: 'Security Audit', status: 'Active', category: 'Security' },
  { id: 'PROJ-009', name: 'Performance Optimization', status: 'Active', category: 'Internal' },
  { id: 'PROJ-010', name: 'New Project Track', status: 'New', category: 'General' }
];

export const getActiveProjects = () => {
  return PROJECTS_LIST.filter(p => p.status === 'Active' || p.status === 'New');
};

export const getProjectById = (id) => {
  return PROJECTS_LIST.find(p => p.id === id);
};