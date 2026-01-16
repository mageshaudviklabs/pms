import { useState, useEffect } from 'react';
import { fetchEmployees } from '../api/employeeApi';

const useEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadEmployees = async () => {
      try {
        setLoading(true);

        const response = await fetchEmployees();

        // backend shape: { success, count, data }
        const rawEmployees = response?.data || [];

        // ✅ Normalize profile-only data
        const normalizedEmployees = rawEmployees.map(emp => ({
          id: emp.id,
          name: emp.name,
          email: emp.email,
          department: emp.department,
          designation: emp.designation,
        }));

        setEmployees(normalizedEmployees);
      } catch (err) {
        console.error('Failed to load employees:', err);
        setError(err?.message || 'Failed to fetch employees');
        setEmployees([]);
      } finally {
        setLoading(false);
      }
    };

    loadEmployees();
  }, []);

  return { employees, loading, error };
};

export default useEmployees;
