
import { UserProfile, UserRole } from '../types';
import { LEADS } from '../constants';

export const AuthService = {
  async login(username: string, password: string, role: UserRole): Promise<UserProfile> {
    // Simulated API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const inputUser = username.toLowerCase().trim();
        const inputPass = password.toLowerCase().trim();

        if (role === 'Manager') {
          if (inputUser === 'admin' && inputPass === 'admin') {
            resolve({
              name: 'Alex Rivera',
              role: 'Manager',
              avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop'
            });
            return;
          }
        } else {
          const matchedLead = LEADS.find(lead => {
            const firstName = lead.name.split(' ')[0].toLowerCase();
            return inputUser === firstName && inputPass === firstName;
          });

          if (matchedLead) {
            resolve({
              name: matchedLead.name,
              role: 'Employee',
              avatar: matchedLead.avatar
            });
            return;
          }
        }
        reject(new Error('Invalid credentials'));
      }, 1000);
    });
  },

  async logout(): Promise<void> {
    // Handle session cleanup
    return Promise.resolve();
  }
};
