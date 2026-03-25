import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  MessageSquare, 
  Share2, 
  Save, 
  Bot, 
  Clock, 
  CheckCircle2,
  Sparkles,
  RefreshCw,
  MoreHorizontal,
  Quote,
  Check,
  X,
  Reply,
  MessageCircle,
  Send
} from 'lucide-react';

interface Paragraph {
  id: string;
  text: string;
  author: string;
  authorType: 'human' | 'agent';
}

interface ChatMessage {
  id: string;
  text: string;
  sender: string;
  senderType: 'human' | 'agent';
  time: string;
}

export default function DocumentEditor() {
  const navigate = useNavigate();
  const [isChatLog, setIsChatLog] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: 'm1', sender: 'Human', senderType: 'human', text: 'Hey Claude, can you help me draft the architecture for Project Alpha?', time: '10:00 AM' },
    { id: 'm2', sender: 'Claude 3.5 Sonnet', senderType: 'agent', text: 'Of course! I\'d be happy to help. What are the main requirements for the system?', time: '10:01 AM' },
    { id: 'm3', sender: 'Human', senderType: 'human', text: 'It needs to be a microservices-based system with an Auth Service, Data Service, and Notification Service.', time: '10:05 AM' },
    { id: 'm4', sender: 'Claude 3.5 Sonnet', senderType: 'agent', text: 'Got it. For the Auth Service, I recommend using OAuth 2.0. The Data Service should probably use PostgreSQL for relational data.', time: '10:07 AM' },
  ]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    // Simple check to simulate different document types
    const params = new URLSearchParams(window.location.search);
    if (params.get('type') === 'chatlog') {
      setIsChatLog(true);
    }
  }, []);

  const [paragraphs, setParagraphs] = useState<Paragraph[]>([
    {
      id: 'p1',
      text: '## Project Alpha Architecture',
      author: 'Human',
      authorType: 'human'
    },
    {
      id: 'p2',
      text: 'This document outlines the core architecture for Project Alpha.',
      author: 'Human',
      authorType: 'human'
    },
    {
      id: 'p3',
      text: '### 1. Overview',
      author: 'Human',
      authorType: 'human'
    },
    {
      id: 'p4',
      text: 'The system is composed of three main microservices:\n- **Auth Service**: Handles user authentication and authorization.\n- **Data Service**: Manages the core business data and database interactions.\n- **Notification Service**: Sends emails and push notifications.',
      author: 'Claude 3.5 Sonnet',
      authorType: 'agent'
    },
    {
      id: 'p5',
      text: '### 2. Database Schema',
      author: 'Human',
      authorType: 'human'
    },
    {
      id: 'p6',
      text: 'We will use PostgreSQL for the primary database. We will use Redis for caching to improve performance. The schema is designed to be highly normalized to ensure data integrity.',
      author: 'Claude 3.5 Sonnet',
      authorType: 'agent'
    },
    {
      id: 'p7',
      text: '### 3. Deployment',
      author: 'Human',
      authorType: 'human'
    },
    {
      id: 'p8',
      text: 'The application will be containerized using Docker and deployed to a Kubernetes cluster. We will use GitHub Actions for CI/CD.',
      author: 'Human',
      authorType: 'human'
    }
  ]);

  const [comments, setComments] = useState([
    {
      id: 1,
      author: 'Claude 3.5 Sonnet',
      text: 'I suggest we use Redis for caching to improve the performance of the Data Service.',
      time: '10 mins ago',
      resolved: false,
      highlight: 'Data Service',
      type: 'modify'
    },
    {
      id: 2,
      author: 'Human',
      text: 'Good idea. Let\'s add that to the next sprint.',
      time: '5 mins ago',
      resolved: true,
      highlight: 'Redis for caching',
      type: 'comment'
    }
  ]);

  const [activeCommentId, setActiveCommentId] = useState<number | null>(null);
  const [selectionMenu, setSelectionMenu] = useState<{ x: number, y: number, text: string } | null>(null);
  const commentRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const editorRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    const newMsg: ChatMessage = {
      id: `m${Date.now()}`,
      sender: 'Human',
      senderType: 'human',
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setChatMessages([...chatMessages, newMsg]);
    setNewMessage('');
  };

  const handleMouseUp = () => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed || !selection.toString().trim()) {
      setSelectionMenu(null);
      return;
    }

    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    
    setSelectionMenu({
      x: rect.left + rect.width / 2,
      y: rect.top - 10,
      text: selection.toString()
    });
  };

  const addNewComment = (type: 'comment' | 'modify' = 'comment') => {
    if (!selectionMenu) return;
    
    const newComment = {
      id: Date.now(),
      author: 'Human',
      text: '',
      time: 'Just now',
      resolved: false,
      highlight: selectionMenu.text,
      type: type
    };
    
    setComments([newComment, ...comments]);
    setActiveCommentId(newComment.id);
    setSelectionMenu(null);
    
    // Clear selection
    window.getSelection()?.removeAllRanges();
  };
  useEffect(() => {
    if (activeCommentId) {
      const card = commentRefs.current.get(activeCommentId);
      if (card) {
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }

      const timer = setTimeout(() => {
        setActiveCommentId(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [activeCommentId]);

  const highlightText = (text: string) => {
    let result: (string | React.ReactNode)[] = [text];
    
    comments.forEach(comment => {
      if (comment.resolved) return;
      
      const newResult: (string | React.ReactNode)[] = [];
      result.forEach(part => {
        if (typeof part === 'string') {
          // Case-insensitive match or exact match? Let's stick to exact for now but ensure it exists
          const segments = part.split(comment.highlight);
          segments.forEach((segment, i) => {
            newResult.push(segment);
            if (i < segments.length - 1) {
              newResult.push(
                <span 
                  key={`${comment.id}-${i}`}
                  className={`comment-highlight ${activeCommentId === comment.id ? 'active' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveCommentId(comment.id);
                  }}
                >
                  {comment.highlight}
                </span>
              );
            }
          });
        } else {
          newResult.push(part);
        }
      });
      result = newResult;
    });
    
    return result;
  };

  return (
    <div className="min-h-screen bg-white text-stone-800 flex flex-col font-sans selection:bg-stone-200">
      {/* Header */}
      <header className="h-14 flex items-center justify-between px-4 border-b border-stone-200 bg-white/80 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 rounded-md hover:bg-stone-100 text-stone-500 transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 rounded bg-stone-100 text-stone-600 text-xs font-medium border border-stone-200">
              {isChatLog ? 'Chat Log' : 'Markdown'}
            </span>
            <h1 className="text-sm font-medium text-stone-900">
              {isChatLog ? 'Claude & Human: Feature Discussion' : 'Project Alpha Architecture'}
            </h1>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs text-stone-500 mr-4">
            <Clock className="w-3 h-3" />
            Last edited 2 mins ago by Claude
          </div>
          
          <div className="flex -space-x-2 mr-4">
            <div className="w-6 h-6 rounded-full bg-stone-100 flex items-center justify-center text-[10px] text-stone-600 border border-white z-10" title="Claude 3.5 Sonnet">
              <Bot className="w-3 h-3" />
            </div>
            <div className="w-6 h-6 rounded-full bg-stone-200 flex items-center justify-center text-[10px] text-stone-700 border border-white z-20" title="Human">
              H
            </div>
          </div>

          <button className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-stone-100 text-sm font-medium text-stone-600 transition-colors">
            <RefreshCw className="w-4 h-4" /> Convert
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-stone-100 text-sm font-medium text-stone-600 transition-colors">
            <Share2 className="w-4 h-4" /> Share
          </button>
          <button className="flex items-center gap-2 bg-stone-900 text-white px-3 py-1.5 rounded-md text-sm font-medium hover:bg-stone-800 transition-colors">
            <Save className="w-4 h-4" /> Save
          </button>
          <button className="p-1.5 rounded-md hover:bg-stone-100 text-stone-500 transition-colors">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Editor & Sidebar */}
      <div className="flex-1 flex overflow-hidden relative" onMouseUp={handleMouseUp}>
        {/* Floating Selection Menu */}
        {selectionMenu && !isChatLog && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            style={{ 
              position: 'fixed', 
              left: selectionMenu.x, 
              top: selectionMenu.y, 
              transform: 'translate(-50%, -100%)',
              zIndex: 50
            }}
            className="flex items-center gap-1 bg-stone-900 text-white p-1 rounded-lg shadow-xl border border-stone-700"
          >
            <button 
              onClick={() => addNewComment('comment')}
              className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-stone-800 rounded-md text-xs font-medium transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              Comment
            </button>
            <div className="w-px h-4 bg-stone-700 mx-1" />
            <button 
              onClick={() => addNewComment('modify')}
              className="flex items-center gap-1.5 px-3 py-1.5 hover:bg-stone-800 rounded-md text-xs font-medium transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Modify
            </button>
            <div className="w-px h-4 bg-stone-700 mx-1" />
            <button className="p-1.5 hover:bg-stone-800 rounded-md transition-colors">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            </button>
          </motion.div>
        )}

        {/* Main Editor */}
        <main className="flex-1 overflow-y-auto p-8 lg:p-12 bg-white" ref={editorRef}>
          <div className="max-w-3xl mx-auto space-y-6">
            {isChatLog ? (
              <div className="space-y-8">
                {chatMessages.map((msg) => (
                  <div key={msg.id} className={`flex flex-col ${msg.senderType === 'human' ? 'items-end' : 'items-start'}`}>
                    <div className="flex items-center gap-2 mb-2 px-1">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border ${
                        msg.senderType === 'agent' 
                          ? 'bg-stone-50 text-stone-500 border-stone-200' 
                          : 'bg-stone-100 text-stone-700 border-stone-300'
                      }`}>
                        {msg.senderType === 'agent' ? <Bot className="w-3 h-3" /> : msg.sender.charAt(0)}
                      </div>
                      <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">{msg.sender}</span>
                      <span className="text-[10px] text-stone-300">{msg.time}</span>
                    </div>
                    <div className={`max-w-[85%] p-4 rounded-2xl shadow-sm border ${
                      msg.senderType === 'human' 
                        ? 'bg-stone-900 text-white border-stone-800 rounded-tr-none' 
                        : 'bg-stone-50 text-stone-800 border-stone-200 rounded-tl-none'
                    }`}>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                    </div>
                  </div>
                ))}
                <div className="pt-12 border-t border-stone-100">
                  <div className="relative">
                    <textarea 
                      placeholder="Type a message to continue the conversation..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      className="w-full bg-stone-50 border border-stone-200 rounded-2xl p-4 pr-14 text-sm focus:outline-none focus:border-stone-400 focus:bg-white transition-all shadow-sm resize-none h-32"
                    />
                    <button 
                      onClick={handleSendMessage}
                      className="absolute right-4 bottom-4 p-2.5 bg-stone-900 text-white rounded-xl hover:bg-stone-800 transition-colors shadow-lg shadow-stone-900/10"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              paragraphs.map((p) => (
                <div key={p.id} className="group relative pl-10">
                  {/* Author Indicator */}
                  <div className="absolute left-0 top-1 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border shadow-sm ${
                      p.authorType === 'agent' 
                        ? 'bg-stone-50 text-stone-500 border-stone-200' 
                        : 'bg-stone-100 text-stone-700 border-stone-300'
                    }`} title={`Written by ${p.author}`}>
                      {p.authorType === 'agent' ? <Bot className="w-3 h-3" /> : p.author.charAt(0)}
                    </div>
                  </div>
                  
                  <div 
                    className="w-full bg-transparent border-none focus:outline-none text-stone-800 font-sans text-lg leading-relaxed whitespace-pre-wrap"
                    contentEditable
                    suppressContentEditableWarning
                    onInput={(e) => {
                      const newText = e.currentTarget.innerText;
                      setParagraphs(prev => prev.map(item => item.id === p.id ? { ...item, text: newText } : item));
                    }}
                  >
                    {highlightText(p.text)}
                  </div>
                </div>
              ))
            )}
          </div>
        </main>

        {/* Comments Sidebar */}
        {!isChatLog && (
          <aside className="w-80 border-l border-stone-200 bg-stone-50 flex flex-col">
          <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-white">
            <h2 className="text-sm font-medium flex items-center gap-2 text-stone-900">
              <MessageSquare className="w-4 h-4 text-stone-500" />
              Comments
            </h2>
            <span className="bg-stone-100 text-xs px-2 py-0.5 rounded-full text-stone-600 font-medium">
              {comments.length}
            </span>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {comments.map((comment) => (
              <motion.div 
                key={comment.id}
                ref={(el) => {
                  if (el) commentRefs.current.set(comment.id, el);
                  else commentRefs.current.delete(comment.id);
                }}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={() => setActiveCommentId(comment.id)}
                className={`p-4 rounded-xl border bg-white shadow-sm cursor-pointer transition-all comment-card ${
                  activeCommentId === comment.id 
                    ? 'active border-stone-400 ring-2 ring-stone-900/5' 
                    : 'border-stone-200'
                } ${
                  comment.resolved 
                    ? 'opacity-60' 
                    : ''
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded ${
                      comment.type === 'modify' 
                        ? 'bg-amber-100 text-amber-700 border border-amber-200' 
                        : 'bg-stone-100 text-stone-600 border border-stone-200'
                    }`}>
                      {comment.type === 'modify' ? 'Suggestion' : 'Comment'}
                    </span>
                    <span className="text-[10px] text-stone-400">•</span>
                    <span className="text-[10px] text-stone-500">{comment.time}</span>
                  </div>
                  {comment.resolved && (
                    <span className="text-[10px] font-medium text-emerald-600 flex items-center gap-1">
                      <Check className="w-3 h-3" /> Resolved
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 mb-3">
                  {comment.author === 'Human' ? (
                    <div className="w-5 h-5 rounded-full bg-stone-200 flex items-center justify-center text-[10px] text-stone-700">
                      H
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-stone-100 flex items-center justify-center text-[10px] text-stone-600">
                      <Bot className="w-3 h-3" />
                    </div>
                  )}
                  <span className="text-xs font-medium text-stone-900">{comment.author}</span>
                </div>
                
                <div className="mb-3">
                  <div className="flex items-start gap-2 mb-2 p-2 bg-stone-50 rounded-lg border-l-2 border-stone-300">
                    <div className="mt-0.5">
                      <Quote className="w-3 h-3 text-stone-400" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-xs text-stone-600 italic line-clamp-2">
                        "{comment.highlight}"
                      </span>
                    </div>
                  </div>
                  {activeCommentId === comment.id && !comment.text ? (
                    <div className="px-1">
                      <textarea
                        autoFocus
                        placeholder="Write a comment..."
                        className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2 text-sm focus:outline-none focus:border-stone-300 transition-colors resize-none"
                        rows={3}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            const val = (e.target as HTMLTextAreaElement).value;
                            if (val.trim()) {
                              setComments(prev => prev.map(c => c.id === comment.id ? { ...c, text: val } : c));
                            }
                          }
                        }}
                      />
                      <div className="flex justify-end gap-2 mt-2">
                        <button 
                          onClick={() => setComments(prev => prev.filter(c => c.id !== comment.id))}
                          className="px-2 py-1 text-[10px] font-medium text-stone-500 hover:text-stone-800 transition-colors"
                        >
                          Cancel
                        </button>
                        <button 
                          onClick={(e) => {
                            const textarea = e.currentTarget.parentElement?.previousElementSibling as HTMLTextAreaElement;
                            if (textarea.value.trim()) {
                              setComments(prev => prev.map(c => c.id === comment.id ? { ...c, text: textarea.value } : c));
                            }
                          }}
                          className="px-2 py-1 bg-stone-900 text-white text-[10px] font-medium rounded hover:bg-stone-800 transition-colors"
                        >
                          Comment
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-stone-700 leading-relaxed px-1">
                      {comment.text || (
                        <span className="text-stone-400 italic">Add your comment...</span>
                      )}
                    </p>
                  )}
                </div>
                
                {!comment.resolved && (
                  <div className="flex flex-col gap-2 mt-3 pt-3 border-t border-stone-100">
                    {comment.type === 'modify' ? (
                      <>
                        <div className="flex items-center gap-2">
                          <button className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded bg-emerald-50 hover:bg-emerald-100 text-xs font-medium text-emerald-700 transition-colors border border-emerald-200">
                            <Check className="w-3 h-3" /> Accept
                          </button>
                          <button className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded bg-rose-50 hover:bg-rose-100 text-xs font-medium text-rose-700 transition-colors border border-rose-200">
                            <X className="w-3 h-3" /> Reject
                          </button>
                        </div>
                        <button className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded bg-stone-50 hover:bg-stone-100 text-xs font-medium text-stone-600 transition-colors border border-stone-200">
                          <Reply className="w-3 h-3" /> Reply
                        </button>
                      </>
                    ) : (
                      <div className="flex items-center gap-2">
                        <button className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded bg-stone-50 hover:bg-stone-100 text-xs font-medium text-stone-600 transition-colors border border-stone-200">
                          <Reply className="w-3 h-3" /> Reply
                        </button>
                        <button className="flex items-center justify-center gap-1 flex-1 py-1.5 rounded bg-stone-900 hover:bg-stone-800 text-xs font-medium text-white transition-colors">
                          <CheckCircle2 className="w-3 h-3" /> Resolve
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
          
          <div className="p-4 border-t border-stone-200 bg-white">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Add a comment..." 
                className="w-full bg-stone-50 border border-stone-200 rounded-lg pl-3 pr-10 py-2 text-sm focus:outline-none focus:border-stone-300 focus:bg-white transition-colors text-stone-800 placeholder:text-stone-400"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded bg-stone-900 text-white hover:bg-stone-800 transition-colors">
                <Sparkles className="w-3 h-3" />
              </button>
            </div>
          </div>
        </aside>
        )}
      </div>
    </div>
  );
}
