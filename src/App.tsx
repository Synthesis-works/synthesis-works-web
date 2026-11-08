import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom';
import { ExperienceProvider, useExperience } from '@/core/ExperienceController';
import { PublicLayout } from '@/layouts/PublicLayout';
import { Component, lazy, Suspense, type ErrorInfo, type ReactNode } from 'react';
import { PageLoader } from '@/components/layout/PageLoader';
import { MultiStepLoader } from '@/components/ui/multi-step-loader';

/* Marketing pages (lazy-loaded for perf) */
const Landing = lazy(() => import('@/pages/Landing'));
const Platform = lazy(() => import('@/pages/Platform'));
const Benchmarks = lazy(() => import('@/pages/Benchmarks'));
const Research = lazy(() => import('@/pages/Research'));
const Documentation = lazy(() => import('@/pages/Documentation'));
const OpenSource = lazy(() => import('@/pages/OpenSource'));
const Cli = lazy(() => import('@/pages/Cli'));
const CliInstall = lazy(() => import('@/pages/CliInstall'));
const Sandbox = lazy(() => import('@/components/ui/draggable-card-demo-2'));

class AppErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean; error: Error | null }> {
  state: { hasError: boolean; error: Error | null } = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): { hasError: boolean; error: Error } {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Synthesis Works route failed to render', error, info);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="relative min-h-screen w-full overflow-hidden flex items-center justify-center bg-black font-sans p-6">
        <div className="relative z-10 max-w-md w-full bg-zinc-900/90 border border-red-500/30 rounded-xl p-6 text-center space-y-4 shadow-2xl backdrop-blur-xl">
          <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto text-red-400 font-bold">
            !
          </div>
          <h2 className="text-lg font-semibold text-white">Synthesis Works View Render Error</h2>
          <p className="text-xs text-white/60 font-mono bg-black/40 p-3 rounded border border-white/5 break-all text-left">
            {this.state.error?.message || 'An unexpected rendering exception occurred inside this page.'}
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="w-full py-2.5 px-4 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-medium text-xs transition-colors"
          >
            Reload
          </button>
        </div>
      </div>
    );
  }
}

function AppRoutes() {
  return (
    <Routes>
      {/* Marketing site — PublicLayout with cinematic Fabric */}
      <Route element={<PublicLayout />}>
        <Route index element={<Suspense fallback={<PageLoader />}><Landing /></Suspense>} />
        <Route path="platform" element={<Suspense fallback={<PageLoader />}><Platform /></Suspense>} />
        <Route path="benchmarks" element={<Suspense fallback={<PageLoader />}><Benchmarks /></Suspense>} />
        <Route path="research" element={<Suspense fallback={<PageLoader />}><Research /></Suspense>} />
        <Route path="documentation" element={<Suspense fallback={<PageLoader />}><Documentation /></Suspense>} />
        <Route path="cli" element={<Suspense fallback={<PageLoader />}><Cli /></Suspense>} />
        <Route path="cli/install" element={<Suspense fallback={<PageLoader />}><CliInstall /></Suspense>} />
        <Route path="open-source" element={<Suspense fallback={<PageLoader />}><OpenSource /></Suspense>} />
        <Route path="sandbox" element={<Suspense fallback={<PageLoader />}><Sandbox /></Suspense>} />
      </Route>

      {/* Unknown paths on this site belong on its home page. Atlas owns its own routes. */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function AppContainer() {
  const { loaderActive, loaderStates, loaderDuration, handleLoaderComplete } = useExperience();

  return (
    <>
      <AppErrorBoundary>
        <AppRoutes />
      </AppErrorBoundary>
      <MultiStepLoader
        loadingStates={loaderStates}
        loading={loaderActive}
        duration={loaderDuration}
        loop={false}
        onComplete={handleLoaderComplete}
      />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ExperienceProvider>
        <AppContainer />
      </ExperienceProvider>
    </BrowserRouter>
  );
}

export default App;
