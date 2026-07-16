import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  const subdomain = env.VITE_NHOST_SUBDOMAIN;
  const region = env.VITE_NHOST_REGION;
  const nhostOrigins =
    subdomain && region
      ? ['auth', 'graphql', 'storage', 'functions'].map(
          (service) => `https://${subdomain}.${service}.${region}.nhost.run`,
        )
      : [];
  const realtimeOrigin = nhostOrigins
    .find((origin) => origin.includes('.graphql.'))
    ?.replace(/^https:/, 'wss:');

  return {
    base: '/belavez/',
    plugins: [
      react(),
      {
        name: 'production-content-security-policy',
        transformIndexHtml:
          command === 'build'
            ? () => securityPolicyTag(nhostOrigins, realtimeOrigin)
            : undefined,
      },
    ],
  };
});

function securityPolicyTag(nhostOrigins: string[], realtimeOrigin?: string) {
  const connections = ["'self'", ...nhostOrigins, realtimeOrigin].filter(Boolean).join(' ');

  return [
    {
      tag: 'meta',
      attrs: {
        'http-equiv': 'Content-Security-Policy',
        content: [
          "default-src 'self'",
          "base-uri 'self'",
          "object-src 'none'",
          "script-src 'self'",
          "style-src 'self' 'unsafe-inline'",
          "img-src 'self' data: https:",
          `connect-src ${connections}`,
          "manifest-src 'self'",
          "worker-src 'self'",
          "form-action 'self'",
          "frame-ancestors 'none'",
        ].join('; '),
      },
      injectTo: 'head-prepend' as const,
    },
  ];
}
