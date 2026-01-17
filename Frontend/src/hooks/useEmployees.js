import { useState, useEffect } from 'react';
import { DUMMY_EXCEL_DATA } from '../services/employeeService';

const useEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadEmployees = async () => {
      try {
        setLoading(true);
        // simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        setEmployees(DUMMY_EXCEL_DATA);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadEmployees();
  }, []);

  return { employees, loading, error };
};

export default useEmployees;