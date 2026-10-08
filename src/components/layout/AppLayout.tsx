import { Outlet } from "react-router-dom"
import { Header } from "./Header"

export function AppLayout() {
  return (
    <div className="bg-surface-base font-body-md text-on-surface antialiased selection:bg-surface-variant selection:text-text-primary min-h-screen flex flex-col justify-between">
      <Header />
      <main className="w-full pt-20 bg-surface-base flex-1">
        <Outlet />
      </main>
      {/* <Footer /> */}
    </div>
  )
}
