import { useState, useEffect } from 'react';
import { Upload } from './components/Upload';
import { Reader } from './components/Reader';
import { Home } from './components/Home';
import { Leaderboard } from './components/Leaderboard';
import { useBook } from './hooks/useBook';
import { Auth } from './components/Auth';
import { Landing } from './components/Landing';

type View = 'home' | 'reader' | 'leaderboard';

function App() {
  const [session, setSession] = useState<boolean>(false);
  const [showAuth, setShowAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [view, setView] = useState<View>('home');
  const { books, currentBook, loadBook, selectBook, clearBook, progress, status } = useBook();
  const handleSignOut = () => {
    setSession(false);
  };

  if (!session && !showAuth) {
    return <Landing onGetStarted={() => setShowAuth(true)} />;
  }

  if (!session && showAuth) {
    return <Auth onSuccess={() => setSession(true)} onBack={() => setShowAuth(false)} />;
  }

  return (
    <div className="h-screen bg-black">
      {view === 'home' && (
        <Home books={books} onSelectBook={(book) => {
          selectBook(book);
          setView('reader');
        }} 
        onUpload={loadBook}
        progress={progress}
        status={status}
        isLoading={isLoading}
        onSignOut={handleSignOut}
        />
      )}
      {view === 'reader' && currentBook && (
        <Reader 
          book={currentBook} 
          onClear={() => {
            clearBook();
            setView('home');
          }}
          onLeaderboard={() => setView('leaderboard')}
        />
      )}
      {view === 'leaderboard' && (
        <Leaderboard onBack={() => setView('reader')} />
      )}
    </div>
  );
}

export default App