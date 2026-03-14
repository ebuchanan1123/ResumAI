import AsyncStorage from '@react-native-async-storage/async-storage';

const RATE_LIMIT_STORAGE_KEY = 'resumai_daily_rate_limits';

export type RateLimitKey = 'resume_generation' | 'bullet_generation';

type StoredRateLimit = {
  count: number;
  date: string;
};

type RateLimitStore = Partial<Record<RateLimitKey, StoredRateLimit>>;

export const DAILY_LIMIT = 5;

const getLocalDateKey = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = `${now.getMonth() + 1}`.padStart(2, '0');
  const day = `${now.getDate()}`.padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const loadRateLimitStore = async (): Promise<RateLimitStore> => {
  const raw = await AsyncStorage.getItem(RATE_LIMIT_STORAGE_KEY);

  if (!raw) {
    return {};
  }

  try {
    return JSON.parse(raw) as RateLimitStore;
  } catch {
    return {};
  }
};

const saveRateLimitStore = async (store: RateLimitStore) => {
  await AsyncStorage.setItem(RATE_LIMIT_STORAGE_KEY, JSON.stringify(store));
};

const getEntryForToday = (store: RateLimitStore, key: RateLimitKey): StoredRateLimit => {
  const today = getLocalDateKey();
  const entry = store[key];

  if (!entry || entry.date !== today) {
    return { count: 0, date: today };
  }

  return entry;
};

export const getDailyUsage = async (key: RateLimitKey) => {
  const store = await loadRateLimitStore();
  const entry = getEntryForToday(store, key);

  return {
    count: entry.count,
    remaining: Math.max(DAILY_LIMIT - entry.count, 0),
    limit: DAILY_LIMIT,
  };
};

export const consumeDailyUsage = async (key: RateLimitKey) => {
  const store = await loadRateLimitStore();
  const entry = getEntryForToday(store, key);
  const nextCount = entry.count + 1;

  store[key] = {
    date: entry.date,
    count: nextCount,
  };

  await saveRateLimitStore(store);

  return {
    count: nextCount,
    remaining: Math.max(DAILY_LIMIT - nextCount, 0),
    limit: DAILY_LIMIT,
  };
};

export const releaseDailyUsage = async (key: RateLimitKey) => {
  const store = await loadRateLimitStore();
  const entry = getEntryForToday(store, key);
  const nextCount = Math.max(entry.count - 1, 0);

  store[key] = {
    date: entry.date,
    count: nextCount,
  };

  await saveRateLimitStore(store);

  return {
    count: nextCount,
    remaining: Math.max(DAILY_LIMIT - nextCount, 0),
    limit: DAILY_LIMIT,
  };
};

export const getLimitReachedMessage = (label: string) =>
  `You've reached today's ${DAILY_LIMIT} ${label} limit on this device. Try again tomorrow.`;
