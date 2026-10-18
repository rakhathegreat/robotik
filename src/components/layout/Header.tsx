import { Link, useLocation, useNavigate } from "react-router-dom";
import { Cpu, ExternalLink, LogOut, User, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthSession } from "@/hooks/useAuthSession";

export function Header() {
	const location = useLocation();
	const navigate = useNavigate();
	const { email, role, isAdmin, signOut } = useAuthSession();

	const handleSignOut = async () => {
		await signOut();
		navigate("/login", { replace: true });
	};

	return (
		<header className="fixed top-0 left-0 w-full z-50 pointer-events-none py-3.5 px-4 sm:px-6 bg-background border-b">
			<div className="max-w-[1720px] mx-auto flex items-center justify-between gap-4">
				{/* Left: Minimalist Logo Mark & Brand */}
				<div className="pointer-events-auto h-9 flex items-center gap-2.5 bg-[#141416] px-3.5 rounded-lg border border-border-subtle shadow-lg">
					<div className="w-6 h-6 rounded-md bg-white/10 flex items-center justify-center text-primary">
						<Cpu size={15} />
					</div>
					<span className="font-label-md text-text-primary font-bold tracking-tight pr-1">
						Counting Mission
					</span>
				</div>

				{/* Center: Floating Segmented Pill Island (Clean Internal Navigation) */}
				<nav className="pointer-events-auto hidden text-sm md:flex items-center gap-1.5 bg-[#141416] p-1 h-9 rounded-lg border border-border-subtle shadow-lg">
					<Link
						to="/participants"
						className={`px-4 h-full rounded-md font-label-md font-semibold transition-all flex items-center gap-1.5 ${location.pathname.startsWith("/participants") ? "bg-white text-on-primary shadow-sm" : "text-text-muted hover:text-text-primary hover:bg-surface-container-high/40"}`}>
						<span>Manajemen Peserta</span>
					</Link>
					<Link
						to="/leaderboard"
						className={`px-4 h-full rounded-md font-label-md transition-all flex items-center gap-1.5 ${location.pathname.startsWith("/leaderboard") ? "bg-white text-on-primary font-semibold shadow-sm" : "text-text-muted hover:text-text-primary hover:bg-surface-container-high/40"}`}>
						<span>Leaderboard</span>
					</Link>
				</nav>

				{/* Right: Separated Public View Button + Status Indicator + User Profile */}
				<div className="pointer-events-auto flex items-center gap-2.5">
					<Link
						to="/public-view"
						className="h-9 flex text-xs font-semibold items-center gap-1.5 bg-[#141416] hover:bg-surface-container-high/50 px-3.5 rounded-lg border border-border-subtle hover:border-border-strong text-text-secondary hover:text-text-primary font-label-md transition-all shadow-lg group"
						title="Buka Public View">
						<ExternalLink
							size={14}
							className="text-text-muted group-hover:text-text-primary transition-colors"
						/>
						<span>Public View</span>
					</Link>
					<div className="h-9 flex items-center gap-2 bg-[#141416] px-3.5 rounded-lg border border-border-subtle shadow-lg">
						<span className="w-2 h-2 rounded-full bg-status-success animate-pulse"></span>
						<span className="font-label-mono-stat text-xs text-text-primary font-medium tracking-wide">
							Arena 01
						</span>
						<span className="text-text-muted text-[10px]">•</span>
						<span className="font-label-mono-stat text-xs text-status-success font-semibold tracking-wider uppercase">
							Live
						</span>
					</div>

					<DropdownMenu>
						<DropdownMenuTrigger
							render={
								<Button
									variant="outline"
									size="icon"
									className="w-9 h-9 rounded-lg bg-[#141416] border-border-subtle hover:border-border-strong text-text-secondary hover:text-text-primary shadow-lg"
									title="Menu Operator">
									<User size={16} />
								</Button>
							}
						/>
						<DropdownMenuContent
							align="end"
							sideOffset={6}
							className="min-w-56">
							<DropdownMenuLabel className="font-label-mono-stat text-[10px] text-text-muted uppercase tracking-widest">
								{email ?? "Sesi tidak aktif"}
							</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<div className="flex items-center gap-2 px-2 py-1.5">
								<ShieldCheck
									size={13}
									className={
										isAdmin ? "text-status-success" : "text-status-warning"
									}
								/>
								<span className="font-label-mono-stat text-[11px] text-text-primary uppercase">
									{role ?? "Tanpa Peran"}
								</span>
							</div>
							<DropdownMenuSeparator />
							<DropdownMenuItem onClick={handleSignOut}>
								<LogOut size={14} className="mr-1.5" />
								Keluar dari Konsol
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</div>
		</header>
	);
}
