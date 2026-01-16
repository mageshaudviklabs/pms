import React, { useEffect, useState } from 'react';
import Card from '../components/Card';
import { employeeService } from '../api/employeeApi';

const MyProfile = ({ user }) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const response = await employeeService.getEmployeeProfileById(user.id);
        // response.data is the body { success: true, data: {...} }
        const body = response.data;
        setProfile(body.data || body);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[400px]">
        <i className="fa-solid fa-spinner fa-spin text-3xl text-primary"></i>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-20 opacity-50">
        <i className="fa-solid fa-user-slash text-6xl mb-4"></i>
        <p className="text-xl font-bold">Profile not found</p>
      </div>
    );
  }

  const initials = (profile.name || user.name || '?').split(' ').map(n => n[0]).join('');

  return (
    <div className="max-w-4xl mx-auto animate-slideUp">
      <Card>
        <div className="p-8">
          <div className="flex flex-col items-center mb-10">
            <div className="w-24 h-24 bg-primary rounded-3xl flex items-center justify-center text-white text-3xl font-black shadow-lg mb-4">
              {initials}
            </div>
            <h2 className="text-3xl font-black text-textPrimary tracking-tight">{profile.name}</h2>
            <p className="text-primary font-bold text-lg">{profile.designation}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-bgAudvik rounded-2xl border border-borderAudvik hover:border-primary/20 transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-primary shadow-sm">
                  <i className="fa-solid fa-id-badge text-lg"></i>
                </div>
                <p className="text-xs font-bold text-textSecondary uppercase tracking-wider">Employee ID</p>
              </div>
              <p className="text-xl font-black text-textPrimary pl-13">{profile.id}</p>
            </div>

            <div className="p-6 bg-bgAudvik rounded-2xl border border-borderAudvik hover:border-primary/20 transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-primary shadow-sm">
                  <i className="fa-solid fa-building text-lg"></i>
                </div>
                <p className="text-xs font-bold text-textSecondary uppercase tracking-wider">Department</p>
              </div>
              <p className="text-xl font-black text-textPrimary pl-13">{profile.department}</p>
            </div>

            <div className="p-6 bg-bgAudvik rounded-2xl border border-borderAudvik hover:border-primary/20 transition-all md:col-span-2">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-primary shadow-sm">
                  <i className="fa-solid fa-envelope text-lg"></i>
                </div>
                <p className="text-xs font-bold text-textSecondary uppercase tracking-wider">Email Address</p>
              </div>
              <p className="text-xl font-black text-textPrimary pl-13">{profile.email}</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default MyProfile;