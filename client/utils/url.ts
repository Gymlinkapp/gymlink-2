export let URL =
  process.env.NODE_ENV === 'development'
    ? 'http://10.0.1.198:3000/trpc'
    : // 'https://localhost:3000/trpc'
      'https://gymlink-service.onrender.com';
// export let URL = 'https://gymlink-service.onrender.com';
