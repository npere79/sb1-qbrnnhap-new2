import { useState, useCallback, useRef, useEffect } from 'react';
import ePub from 'epubjs';
import type { Book } from '../types';

const CURRENT_BOOK_KEY = 'current_book';
const POSITION_KEY = 'reading_position';

const MAX_CHUNK_SIZE = 475; // maximum characters per chunk

function splitIntoSentences(text: string): string[] {
  // Match sentence endings: .!? followed by space or end of string
  // Also handles common abbreviations and ellipsis
  const sentences = text
    .replace(/([.!?])\s+/g, '$1|')
    .replace(/([.!?])$/, '$1|')
    .split('|')
    .map(s => s.trim())
    .filter(s => s.length > 0);
  
  // Ensure each sentence ends with a period
  return sentences.map(sentence => {
    if (!sentence.endsWith('.') && !sentence.endsWith('!') && !sentence.endsWith('?')) {
      return sentence + '.';
    }
    return sentence;
  });
}

export const useBook = () => {
  const [books, setBooks] = useState<Book[]>(() => {
    const stored = localStorage.getItem('books');
    return stored ? JSON.parse(stored) : [];
  });
  
  const [currentBook, setCurrentBook] = useState<Book | null>(() => {
    const stored = localStorage.getItem(CURRENT_BOOK_KEY);
    return stored ? JSON.parse(stored) : null;
  });
  
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<string>('');
  const totalSections = useRef(0);
  const processedSections = useRef(0);
  const [isLoading, setIsLoading] = useState(false);

  // Save current book to localStorage whenever it changes
  useEffect(() => {
    if (currentBook) {
      localStorage.setItem(CURRENT_BOOK_KEY, JSON.stringify(currentBook));
    } else {
      localStorage.removeItem(CURRENT_BOOK_KEY);
    }
  }, [currentBook]);

  const loadBook = useCallback(async (file: File) => {
    setIsLoading(true);
    const reader = new FileReader();
    setProgress(1); // Start with 1% to show progress
    setStatus('Reading file...');
    
    reader.onload = async (e) => {
      const arrayBuffer = e.target?.result as ArrayBuffer;
      
      const epub = ePub(arrayBuffer);
      setStatus('Loading ebook...');
      await epub.ready;

      const metadata = await epub.loaded.metadata;
      const spine = await epub.loaded.spine;
      totalSections.current = spine.items.length;
      processedSections.current = 0;
      
      let chunks: { id: number; content: string; }[] = [];
      let chunkId = 1;
      let rendition;
      const container = document.createElement('div');
      const iframeRefs: HTMLIFrameElement[] = [];
      
      // Create a unique ID for the container
      const containerId = `epub-container-${Date.now()}`;
      container.id = containerId;
      container.style.cssText = 'position: absolute; visibility: hidden; pointer-events: none; width: 100px; height: 100px;';
      document.body.appendChild(container);
      
      try {
        setStatus('Preparing reader...');
        rendition = epub.renderTo(container, {
          width: 100,
          height: 100,
          hidden: true
        });

        await rendition.display();

        for (const section of spine.items) {
          processedSections.current++;
          setProgress((processedSections.current / totalSections.current) * 100);
          setStatus(`Processing section ${processedSections.current} of ${totalSections.current}...`);

          try {
            await rendition.display(section.href);
            
            const iframe = container.querySelector('iframe');
            if (iframe && !iframeRefs.includes(iframe)) {
              iframeRefs.push(iframe);
            }
            
            const doc = iframe.contentDocument;
            if (!doc) continue;
          
            // Get text content and clean it
            const textContent = doc.body.textContent || '';
            const cleanedContent = textContent.trim();

            // Split into sentences first
            const sentences = splitIntoSentences(cleanedContent);
          
            // Combine sentences into chunks
            let currentChunk = '';
          
            for (const sentence of sentences) {
              // If adding this sentence would exceed the limit, save current chunk
              if (currentChunk && (currentChunk + ' ' + sentence).length > MAX_CHUNK_SIZE) {
                // Ensure the chunk ends with a period
                const finalChunk = currentChunk.trim();
                chunks.push({
                  id: chunkId++,
                  content: finalChunk.endsWith('.') || finalChunk.endsWith('!') || finalChunk.endsWith('?')
                    ? finalChunk 
                    : finalChunk + '.'
                });
                currentChunk = sentence;
              } else {
                // Add sentence to current chunk
                currentChunk += (currentChunk ? ' ' : '') + sentence;
              }
            }
          
            // Don't forget the last chunk
            if (currentChunk) {
              const finalChunk = currentChunk.trim();
              chunks.push({
                id: chunkId++,
                content: finalChunk.endsWith('.') || finalChunk.endsWith('!') || finalChunk.endsWith('?')
                  ? finalChunk
                  : finalChunk + '.'
              });
            }
          } catch (error) {
            console.error('Error loading section:', error);
            continue;
          }
        }

        // Filter chunks before cleanup
        chunks = chunks.filter(chunk => chunk.content.trim().length > 0);

      } finally {
        try {
          // First, clean up all tracked iframes
          iframeRefs.forEach(iframe => {
            try {
              if (iframe.contentWindow) {
                // Clean up any event listeners
                iframe.contentWindow.removeEventListener('unload', () => {});
                iframe.contentWindow.removeEventListener('beforeunload', () => {});
              }
              
              // Remove the iframe content
              if (iframe.contentDocument) {
                iframe.contentDocument.documentElement.innerHTML = '';
              }
              
              // Detach from parent
              if (iframe.parentNode) {
                iframe.parentNode.removeChild(iframe);
              }
            } catch (error) {
              console.warn('Non-critical iframe cleanup error:', error);
            }
          });

          // Clean up the rendition
          if (rendition) {
            try {
              // Destroy all views first
              if (rendition.manager?.views) {
                rendition.manager.views.forEach(view => {
                  try {
                    view.destroy();
                  } catch (error) {
                    console.warn('Non-critical view cleanup error:', error);
                  }
                });
              }
              
              // Then destroy the rendition
              rendition.destroy();
            } catch (error) {
              console.warn('Non-critical rendition cleanup error:', error);
            }
          }
          
          // Finally, remove the container
          const containerElement = document.getElementById(containerId);
          if (containerElement && containerElement.parentNode) {
            // Clear all content first
            while (containerElement.firstChild) {
              containerElement.removeChild(containerElement.firstChild);
            }
            // Then remove the container itself
            containerElement.parentNode.removeChild(containerElement);
          }
        } catch (error) {
          console.warn('Non-critical cleanup error:', error);
        }
      }

      // Ensure we have valid content
      const newBook = {
        id: crypto.randomUUID(),
        title: metadata.title,
        author: metadata.creator || 'Unknown Author',
        last_read: new Date().toISOString(),
        chunks: chunks.length > 0 ? chunks : [{
          id: 1,
          content: 'Could not extract content from this EPUB. Please try another file.'
        }]
      };

      setBooks(prev => [newBook, ...prev]);
      setCurrentBook(newBook);

      // Save books to localStorage
      localStorage.setItem('books', JSON.stringify([newBook, ...books]));

      setProgress(100); 
      setStatus('Book added successfully!');
      setIsLoading(false);
      
      // Reset progress and status after a delay
      setTimeout(() => {
        setProgress(0);
        setStatus('');
      }, 2000);
    };

    reader.onerror = (error) => {
      console.error('Error reading file:', error);
      setStatus('Error: Failed to read file');
      setProgress(100);
      setIsLoading(false);
      
      // Reset progress and status after a delay
      setTimeout(() => {
        setProgress(0);
        setStatus('');
      }, 2000);
    };

    reader.readAsArrayBuffer(file);
  }, []);

  const selectBook = useCallback(async (book: Book) => {
    const updatedBook = { ...book, last_read: new Date().toISOString() };
    setCurrentBook(updatedBook);
    const updatedBooks = books.map(b => b.id === book.id ? updatedBook : b);
    setBooks(updatedBooks);
    localStorage.setItem('books', JSON.stringify(updatedBooks));
  }, []);

  const clearBook = useCallback(() => {
    setCurrentBook(null);
    localStorage.removeItem(CURRENT_BOOK_KEY);
    localStorage.removeItem(POSITION_KEY);
  }, []);

  return { books, currentBook, loadBook, selectBook, clearBook, progress, status, isLoading };
};