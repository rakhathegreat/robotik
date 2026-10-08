import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { LoginPage } from '@/components/LoginPage'
import { AppLayout } from '@/components/layout/AppLayout'
import { ParticipantsPage } from '@/pages/ParticipantsPage'
import { LeaderboardPage } from '@/pages/LeaderboardPage'
import { MatchControlPage } from '@/pages/MatchControlPage'
import { QuestionsPage } from '@/pages/QuestionsPage'
import { PublicViewPage } from '@/pages/PublicViewPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/public-view" element={<PublicViewPage />} />
        <Route element={<AppLayout />}>
          <Route path="/participants" element={<ParticipantsPage />} />
          <Route path="/questions" element={<QuestionsPage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/match-control" element={<MatchControlPage />} />
          <Route path="/" element={<Navigate to="/participants" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
