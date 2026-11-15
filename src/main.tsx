import React, { Component, type ErrorInfo, type ReactNode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles.css'

class RenderErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null }

  static getDerivedStateFromError(error: Error) {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Axiom AI failed to render:', error, info.componentStack)
  }

  render() {
    if (this.state.error) {
      return <main className="render-error"><div className="render-error-card"><div className="brand-mark">!</div><p className="eyebrow">STARTUP ERROR</p><h1>Axiom AI couldn’t load</h1><p className="render-error-copy">The app hit an error while rendering. The message below can help identify the problem.</p><pre>{this.state.error.message}</pre><button onClick={() => window.location.reload()}>Reload app</button></div></main>
    }
    return this.props.children
  }
}

createRoot(document.getElementById('root')!).render(<React.StrictMode><RenderErrorBoundary><App /></RenderErrorBoundary></React.StrictMode>)
