import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  isAdmin: boolean;
  createdAt: string;
  referralCode?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  initialized: boolean;
  referralStats: {
    [code: string]: {
      registrations: number;
      users: Array<{
        id: string;
        name: string;
        email: string;
        registrationDate: string;
        plan: string;
        monthlyPayment: number;
        status: 'active' | 'inactive';
      }>;
    };
  };
  
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, firstName?: string, lastName?: string, referralCode?: string) => Promise<void>;
  logout: () => void;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  isLoggedIn: () => boolean;
  isAdmin: () => boolean;
  generateReferralCode: (name: string) => string;
  addReferralRegistration: (code: string, user: { id: string; name: string; email: string; plan: string; monthlyPayment: number }) => void;
}

const generateReferralCode = (name: string): string => {
  const transliterate = (text: string) => {
    const ru = 'а б в г д е ё ж з и й к л м н о п р с т у ф х ц ч ш щ ъ ы ь э ю я'.split(' ');
    const en = 'a b v g d e e zh z i y k l m n o p r s t u f h ts ch sh sch _ y _ e yu ya'.split(' ');
    const chars = text.toLowerCase().split('');
    return chars.map(char => {
      const index = ru.indexOf(char);
      return index >= 0 ? en[index].toUpperCase() : char.toUpperCase();
    }).join('');
  };

  const nameCode = transliterate(name.split(' ')[0]);
  const randomNum = Math.floor(Math.random() * 9000 + 1000);
  return `${nameCode}${randomNum}`;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      initialized: false,
      referralStats: {},
      
      login: async (email: string, password: string) => {
        await new Promise(resolve => setTimeout(resolve, 800));
        
        if (email === 'admin@example.com' && password === 'password') {
          const user: User = {
            id: '1',
            email: 'admin@example.com',
            firstName: 'Админ',
            lastName: 'Администраторов',
            isAdmin: true,
            createdAt: new Date().toISOString(),
            referralCode: generateReferralCode('Админ Администраторов')
          };
          set({ user, token: 'fake-jwt-token', initialized: true });
        } else if (email === 'klim.belanov@icloud.com' && password === 'ioasduey@36ysdh@#485') {
          const user: User = {
            id: '5',
            email: 'klim.belanov@icloud.com',
            firstName: 'Klim',
            lastName: 'Belanov',
            isAdmin: true,
            createdAt: new Date().toISOString(),
            referralCode: generateReferralCode('Klim Belanov')
          };
          set({ user, token: 'fake-jwt-token', initialized: true });
        } else if (email === 'jojez10c@mail.com' && password === 'Postal123654') {
          const user: User = {
            id: '3',
            email: 'jojez10c@mail.com',
            firstName: 'Admin',
            lastName: 'User',
            isAdmin: true,
            createdAt: new Date().toISOString(),
            referralCode: generateReferralCode('Admin User')
          };
          set({ user, token: 'fake-jwt-token', initialized: true });
        } else if (email === 'zxcvb@gmail.com' && password === 'Postal123654') {
          const user: User = {
            id: '4',
            email: 'zxcvb@gmail.com',
            firstName: 'Admin',
            lastName: 'User',
            isAdmin: true,
            createdAt: new Date().toISOString(),
            referralCode: generateReferralCode('Admin User')
          };
          set({ user, token: 'fake-jwt-token', initialized: true });
        } else if (email === 'user@example.com' && password === 'password') {
          const user: User = {
            id: '2',
            email: 'user@example.com',
            firstName: 'Иван',
            lastName: 'Петров',
            isAdmin: false,
            createdAt: new Date().toISOString(),
            referralCode: generateReferralCode('Иван Петров')
          };
          set({ user, token: 'fake-jwt-token', initialized: true });
        } else {
          throw new Error('Неверный email или пароль');
        }
      },
      
      register: async (email: string, password: string, firstName?: string, lastName?: string, referralCode?: string) => {
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const user: User = {
          id: Math.random().toString(36).substring(2, 9),
          email,
          firstName,
          lastName,
          isAdmin: false,
          createdAt: new Date().toISOString(),
          referralCode: generateReferralCode(`${firstName} ${lastName}`)
        };
        
        // If referral code was provided, record the registration
        if (referralCode && get().referralStats[referralCode]) {
          get().addReferralRegistration(referralCode, {
            id: user.id,
            name: `${firstName} ${lastName}`,
            email: email,
            plan: 'free',
            monthlyPayment: 0
          });
        }
        
        set({ user, token: 'fake-jwt-token', initialized: true });
      },
      
      logout: () => {
        set({ user: null, token: null });
      },
      
      resetPassword: async (email: string) => {
        await new Promise(resolve => setTimeout(resolve, 800));
      },
      
      updateProfile: async (data: Partial<User>) => {
        const { user } = get();
        if (!user) throw new Error('Пользователь не авторизован');
        
        await new Promise(resolve => setTimeout(resolve, 800));
        
        set({ user: { ...user, ...data } });
      },
      
      isLoggedIn: () => {
        const { user, token } = get();
        return !!user && !!token;
      },
      
      isAdmin: () => {
        const { user } = get();
        return !!user && user.isAdmin;
      },

      generateReferralCode,

      addReferralRegistration: (code: string, user) => {
        const { referralStats } = get();
        
        set({
          referralStats: {
            ...referralStats,
            [code]: {
              registrations: (referralStats[code]?.registrations || 0) + 1,
              users: [
                ...(referralStats[code]?.users || []),
                {
                  ...user,
                  registrationDate: new Date().toISOString(),
                  status: 'active'
                }
              ]
            }
          }
        });
      }
    }),
    {
      name: 'auth-storage',
      onRehydrateStorage: () => (state) => {
        if (state) state.initialized = true;
      },
    }
  )
);