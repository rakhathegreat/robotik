import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "@/components/LoginPage";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { AppLayout } from "@/components/layout/AppLayout";

const ParticipantsPage = lazy(() =>
	import("@/pages/ParticipantsPage").then((m) => ({
		default: m.ParticipantsPage,
	})),
);
const LeaderboardPage = lazy(() =>
	import("@/pages/LeaderboardPage").then((m) => ({
		default: m.LeaderboardPage,
	})),
);
const MatchControlPage = lazy(() =>
	import("@/pages/MatchControlPage").then((m) => ({
		default: m.MatchControlPage,
	})),
);
const PublicViewPage = lazy(() =>
	import("@/pages/PublicViewPage").then((m) => ({ default: m.PublicViewPage })),
);

function RouteFallback() {
	return (
		<div className="min-h-screen bg-surface-base flex items-center justify-center">
			<span className="font-label-mono-stat text-[11px] text-text-muted uppercase tracking-widest">
				Memuat...
			</span>
		</div>
	);
}

function App() {
	return (
		<BrowserRouter>
			<Suspense fallback={<RouteFallback />}>
				<Routes>
					<Route path="/login" element={<LoginPage />} />
					<Route path="/public-view" element={<PublicViewPage />} />
					<Route
						element={
							<RequireAuth>
								<AppLayout />
							</RequireAuth>
						}>
						<Route path="/participants" element={<ParticipantsPage />} />
						<Route path="/leaderboard" element={<LeaderboardPage />} />
						<Route path="/match-control" element={<MatchControlPage />} />
						<Route path="/" element={<Navigate to="/participants" replace />} />
					</Route>
				</Routes>
			</Suspense>
		</BrowserRouter>
	);
}

export default App;
