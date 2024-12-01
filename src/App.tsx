import { Routes, Route } from 'react-router-dom'
import { Header } from './components/header'
import { Home } from './pages/home'
import { Calculator } from './pages/calculator'

function App() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tools/calculator" element={<Calculator />} />
        </Routes>
      </main>
    </div>
  )
}

export default App