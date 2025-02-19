interface User {
  id: string;
  email: string;
  name: string;
}

interface StorageUser {
  user: User | null;
  session: boolean;
}

const STORAGE_KEY = 'bookswipe_auth';
const TEST_USER: User = {
  id: '1',
  email: 'admin@bookswipe.net',
  name: 'Test User'
};

export const storage = {
  getUser: (): StorageUser => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    return { user: null, session: false };
  },

  setUser: (user: User | null, session: boolean) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ user, session }));
  },

  login: (email: string, password: string): Promise<User> => {
    return new Promise((resolve, reject) => {
      if (email === 'admin@bookswipe.net' && password === 'password') {
        storage.setUser(TEST_USER, true);
        resolve(TEST_USER);
      } else {
        reject(new Error('Invalid credentials'));
      }
    });
  },

  logout: () => {
    storage.setUser(null, false);
  }
};