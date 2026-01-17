export const DUMMY_EXCEL_DATA = [
  { id: '1', name: 'Harsha S', role: 'Full Stack Eng', projects: 2, workload: 85, performance: '↑ Stable', department: 'Tech', tenureDays: 450 },
  { id: '2', name: 'Priya K', role: 'UI/UX Designer', projects: 1, workload: 40, performance: '→ Consistent', department: 'Design', tenureDays: 320 },
  { id: '3', name: 'Anil R', role: 'Backend Lead', projects: 4, workload: 110, performance: '↓ At Risk', department: 'Tech', tenureDays: 900 },
  { id: '4', name: 'Sonia M', role: 'QA Analyst', projects: 2, workload: 65, performance: 'New Joiner', department: 'QA', tenureDays: 15 },
  { id: '5', name: 'Rahul V', role: 'Data Scientist', projects: 3, workload: 95, performance: '↑ Stable', department: 'Analytics', tenureDays: 520 },
  { id: '6', name: 'Jessica L', role: 'Product Manager', projects: 2, workload: 70, performance: '→ Consistent', department: 'Product', tenureDays: 610 },
  { id: '7', name: 'Mark T', role: 'DevOps Engineer', projects: 5, workload: 120, performance: '↓ Critical', department: 'Tech', tenureDays: 800 },
  { id: '8', name: 'Aman P', role: 'Front End Dev', projects: 2, workload: 55, performance: '↑ Stable', department: 'Tech', tenureDays: 200 },
  ...Array.from({ length: 42 }).map((_, i) => ({
    id: `${i + 9}`,
    name: ['James', 'Emma', 'Oliver', 'Sophia', 'Liam', 'Mia', 'Noah', 'Ava', 'Lucas', 'Isabella'][i % 10] + ' ' + String.fromCharCode(65 + (i % 26)),
    role: ['Developer', 'Designer', 'QA', 'Manager', 'Analyst'][i % 5],
    projects: (i % 4) + 1,
    workload: 40 + (i * 2) % 70,
    performance: i % 3 === 0 ? '↑ Stable' : '→ Consistent',
    department: ['Tech', 'Design', 'QA', 'Product', 'Analytics', 'Ops'][i % 6],
    tenureDays: 10 + (i * 20)
  }))
];

export const getAvailableResources = () => {
  return DUMMY_EXCEL_DATA.filter(e => e.workload < 80);
};

export const getDepartmentStats = () => {
  const stats = {};
  DUMMY_EXCEL_DATA.forEach(emp => {
    stats[emp.department] = (stats[emp.department] || 0) + 1;
  });
  return Object.entries(stats).map(([name, value]) => ({ name, value }));
};
