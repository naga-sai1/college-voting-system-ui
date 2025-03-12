import { createBrowserRouter } from 'react-router-dom'
import { RootLayout } from '@/components/layouts/RootLayout'
import Choose from '@/pages/choose'
import VoterLogin from '@/pages/voter-login'
import VoterPolling from '@/pages/voter-polling'
import AdminLogin from '@/pages/admin-login'
import AdminDashboard from '@/pages/admin-dashboard'
import GeneralError from './pages/errors/general-error'
import NotFoundError from './pages/errors/not-found-error'
import MaintenanceError from './pages/errors/maintenance-error'
import UnauthorisedError from './pages/errors/unauthorised-error.tsx'

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: '/',
        element: <Choose />,
      },
      {
        path: '/voter-login',
        element: <VoterLogin />,
      },
      {
        path: '/voter-polling',
        element: <VoterPolling />,
      },
      {
        path: '/admin-login',
        element: <AdminLogin />,
      },
      {
        path: '/admin-dashboard',
        element: <AdminDashboard />,
      },
      {
        path: '/otp-verification',
        lazy: async () => ({
          Component: (await import('./pages/otp-verfication')).default,
        }),
      },
    ],
  },

  // Auth routes
  {
    path: '/sign-in',
    lazy: async () => ({
      Component: (await import('./pages/auth/sign-in')).default,
    }),
  },
  {
    path: '/sign-in-2',
    lazy: async () => ({
      Component: (await import('./pages/auth/sign-in-2')).default,
    }),
  },
  {
    path: '/sign-up',
    lazy: async () => ({
      Component: (await import('./pages/auth/sign-up')).default,
    }),
  },
  {
    path: '/forgot-password',
    lazy: async () => ({
      Component: (await import('./pages/auth/forgot-password')).default,
    }),
  },
  {
    path: '/otp',
    lazy: async () => ({
      Component: (await import('./pages/auth/otp')).default,
    }),
  },
  {
    path: '/',
    lazy: async () => ({
      Component: (await import('./pages/choose')).default,
    }),
  },
  {
    path: '/create-parties',
    lazy: async () => ({
      Component: (await import('./pages/create-parties/index.tsx')).default,
    }),
  },
  {
    path: '/conduct-poll',
    lazy: async () => ({
      Component: (await import('./pages/conduct-poll')).default,
    }),
  },
  {
    path: '/add-voter',
    lazy: async () => ({
      Component: (await import('./pages/add-voter/index.tsx')).default,
    }),
  },

  // Main routes
  {
    path: '/main',
    lazy: async () => {
      const AppShell = await import('./components/app-shell')
      return { Component: AppShell.default }
    },
    errorElement: <GeneralError />,
    children: [
      {
        index: true,
        lazy: async () => ({
          Component: (await import('./pages/dashboard')).default,
        }),
      },
      {
        path: 'tasks',
        lazy: async () => ({
          Component: (await import('@/pages/tasks')).default,
        }),
      },
      {
        path: 'chats',
        lazy: async () => ({
          Component: (await import('@/pages/chats')).default,
        }),
      },
      {
        path: 'apps',
        lazy: async () => ({
          Component: (await import('@/pages/apps')).default,
        }),
      },
      {
        path: 'users',
        lazy: async () => ({
          Component: (await import('@/components/coming-soon')).default,
        }),
      },
      {
        path: 'analysis',
        lazy: async () => ({
          Component: (await import('@/components/coming-soon')).default,
        }),
      },
      {
        path: 'extra-components',
        lazy: async () => ({
          Component: (await import('@/pages/extra-components')).default,
        }),
      },
      {
        path: 'settings',
        lazy: async () => ({
          Component: (await import('./pages/settings')).default,
        }),
        errorElement: <GeneralError />,
        children: [
          {
            index: true,
            lazy: async () => ({
              Component: (await import('./pages/settings/profile')).default,
            }),
          },
          {
            path: 'account',
            lazy: async () => ({
              Component: (await import('./pages/settings/account')).default,
            }),
          },
          {
            path: 'appearance',
            lazy: async () => ({
              Component: (await import('./pages/settings/appearance')).default,
            }),
          },
          {
            path: 'notifications',
            lazy: async () => ({
              Component: (await import('./pages/settings/notifications'))
                .default,
            }),
          },
          {
            path: 'display',
            lazy: async () => ({
              Component: (await import('./pages/settings/display')).default,
            }),
          },
          {
            path: 'error-example',
            lazy: async () => ({
              Component: (await import('./pages/settings/error-example'))
                .default,
            }),
            errorElement: <GeneralError className='h-[50svh]' minimal />,
          },
        ],
      },
    ],
  },

  // Error routes
  { path: '/500', Component: GeneralError },
  { path: '/404', Component: NotFoundError },
  { path: '/503', Component: MaintenanceError },
  { path: '/401', Component: UnauthorisedError },

  // Fallback 404 route
  { path: '*', Component: NotFoundError },
])

export default router
