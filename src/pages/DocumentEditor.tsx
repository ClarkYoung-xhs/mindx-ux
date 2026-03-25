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
  Sparkles,
  RefreshCw,
  MoreHorizontal,
  Quote,
  Check,
  X,
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

type CommentThreadType = 'comment' | 'modify';

interface CommentMessage {
  id: string;
  author: string;
  authorType: 'human' | 'agent';
  text: string;
  time: string;
}

interface CommentThread {
  id: number;
  highlight: string;
  type: CommentThreadType;
  resolved: boolean;
  createdAtLabel: string;
  messages: CommentMessage[];
  draftText: string;
  isDraft: boolean;
  isReplying: boolean;
  replyDraftText: string;
  isAwaitingReply: boolean;
}

function formatThreadHighlight(highlight: string) {
  const normalized = highlight.replace(/\s+/g, ' ').trim();
  return normalized.length > 60 ? `${normalized.slice(0, 57)}...` : normalized;
}

function formatCommentRequest(commentText: string) {
  const normalized = commentText.replace(/\s+/g, ' ').trim();
  return normalized.length > 90 ? `${normalized.slice(0, 87)}...` : normalized;
}

function buildModifyFollowUp(highlight: string, commentText: string) {
  const focusedHighlight = formatThreadHighlight(highlight);
  const lowerComment = commentText.toLowerCase();
  const lowerHighlight = highlight.toLowerCase();

  if ((lowerComment.includes('sharp') || lowerComment.includes('product')) && lowerHighlight.includes('core architecture')) {
    return 'Proposed rewrite: "Project Alpha needs a production-ready architecture that keeps Auth, Data, and Notification services easy to scale independently."';
  }

  if (lowerComment.includes('clear') || lowerComment.includes('clarify')) {
    return `I'll rewrite the passage around "${focusedHighlight}" so the decision and next step are explicit in one pass.`;
  }

  return `I'll revise the passage around "${focusedHighlight}" so the requested tone shift lands without breaking the surrounding flow.`;
}

function buildCommentFollowUp(highlight: string, commentText: string) {
  const focusedHighlight = formatThreadHighlight(highlight);
  const lowerComment = commentText.toLowerCase();
  const lowerHighlight = highlight.toLowerCase();

  if ((lowerComment.includes('sharp') || lowerComment.includes('product')) && lowerHighlight.includes('core architecture')) {
    return 'Planned update: reframe the opening so it reads less like a note and more like a product-facing positioning line.';
  }

  if (lowerComment.includes('staging') || lowerHighlight.includes('deployment')) {
    return 'Planned update: add a staging approval checkpoint, name the owner, and make the release sequence easier to scan.';
  }

  if (lowerComment.includes('owner') || lowerComment.includes('responsibility')) {
    return `Planned update: clarify who owns "${focusedHighlight}" and call out the handoff point directly in the paragraph.`;
  }

  return `Planned update: address the note on "${focusedHighlight}" and tighten the nearby wording so the intent is clearer.`;
}

function buildAgentReply(type: CommentThreadType, highlight: string, commentText: string) {
  const focusedHighlight = formatThreadHighlight(highlight);
  const summarizedRequest = formatCommentRequest(commentText);

  if (type === 'modify') {
    return [
      `Understood. I'll update "${focusedHighlight}" based on your note: "${summarizedRequest}".`,
      buildModifyFollowUp(highlight, commentText)
    ];
  }

  return [
    `Makes sense. I'll address the note on "${focusedHighlight}" without changing the overall structure of the section.`,
    buildCommentFollowUp(highlight, commentText)
  ];
}

export default function DocumentEditor() {
  const navigate = useNavigate();
  const currentUserName = 'You';
  const externalCollaboratorName = 'Maya Chen';
  const [isChatLog, setIsChatLog] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: 'm1', sender: externalCollaboratorName, senderType: 'human', text: 'Hey Claude, can you help me draft the architecture for Project Alpha?', time: '10:00 AM' },
    { id: 'm2', sender: 'Claude 3.5 Sonnet', senderType: 'agent', text: 'Of course! I\'d be happy to help. What are the main requirements for the system?', time: '10:01 AM' },
    { id: 'm3', sender: externalCollaboratorName, senderType: 'human', text: 'It needs to be a microservices-based system with an Auth Service, Data Service, and Notification Service.', time: '10:05 AM' },
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
      author: currentUserName,
      authorType: 'human'
    },
    {
      id: 'p2',
      text: 'This document outlines the core architecture for Project Alpha.',
      author: currentUserName,
      authorType: 'human'
    },
    {
      id: 'p3',
      text: '### 1. Overview',
      author: currentUserName,
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
      author: currentUserName,
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
      author: currentUserName,
      authorType: 'human'
    },
    {
      id: 'p8',
      text: 'The application will be containerized using Docker and deployed to a Kubernetes cluster. Maya also wants staging approval checkpoints called out before the release section.',
      author: externalCollaboratorName,
      authorType: 'human'
    }
  ]);

  const [comments, setComments] = useState<CommentThread[]>(() => [
    {
      id: 1,
      highlight: 'Data Service',
      type: 'modify',
      resolved: false,
      createdAtLabel: '10 mins ago',
      draftText: '',
      isDraft: false,
      isReplying: false,
      replyDraftText: '',
      isAwaitingReply: false,
      messages: [
        {
          id: '1-agent-initial',
          author: 'Claude 3.5 Sonnet',
          authorType: 'agent',
          text: 'I suggest we use Redis for caching to improve the performance of the Data Service.',
          time: '10 mins ago'
        }
      ]
    },
    {
      id: 2,
      highlight: '### 3. Deployment',
      type: 'comment',
      resolved: true,
      createdAtLabel: '5 mins ago',
      draftText: '',
      isDraft: false,
      isReplying: false,
      replyDraftText: '',
      isAwaitingReply: false,
      messages: [
        {
          id: '2-human-initial',
          author: externalCollaboratorName,
          authorType: 'human',
          text: 'Please also mention the staging approval step before deployment so our review flow is clear.',
          time: '5 mins ago'
        },
        {
          id: '2-agent-initial',
          author: 'Claude 3.5 Sonnet',
          authorType: 'agent',
          text: 'Makes sense. I can add a staging approval checkpoint before release so the rollout path is explicit.',
          time: '4 mins ago'
        }
      ]
    }
  ]);

  const [selectedCommentId, setSelectedCommentId] = useState<number | null>(null);
  const [selectionMenu, setSelectionMenu] = useState<{ x: number, y: number, text: string } | null>(null);
  const commentRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const replyTimeoutsRef = useRef<Array<ReturnType<typeof window.setTimeout>>>([]);
  const editorRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    const newMsg: ChatMessage = {
      id: `m${Date.now()}`,
      sender: currentUserName,
      senderType: 'human',
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setChatMessages([...chatMessages, newMsg]);
    setNewMessage('');
  };

  const createTimeLabel = () =>
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

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

  const addNewComment = (type: CommentThreadType = 'comment') => {
    if (!selectionMenu) return;

    const newComment: CommentThread = {
      id: Date.now(),
      highlight: selectionMenu.text,
      resolved: false,
      type,
      createdAtLabel: 'Just now',
      messages: [],
      draftText: '',
      isDraft: true,
      isReplying: false,
      replyDraftText: '',
      isAwaitingReply: false
    };

    setComments(prev => [newComment, ...prev]);
    setSelectedCommentId(newComment.id);
    setSelectionMenu(null);

    // Clear selection
    window.getSelection()?.removeAllRanges();
  };

  useEffect(() => {
    if (selectedCommentId) {
      const card = commentRefs.current.get(selectedCommentId);
      if (card) {
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [selectedCommentId, comments]);

  useEffect(() => {
    return () => {
      replyTimeoutsRef.current.forEach(timeoutId => window.clearTimeout(timeoutId));
    };
  }, []);

  const updateDraftText = (commentId: number, draftText: string) => {
    setComments(prev =>
      prev.map(comment =>
        comment.id === commentId ? { ...comment, draftText } : comment
      )
    );
  };

  const cancelDraftComment = (commentId: number) => {
    setComments(prev =>
      prev.filter(comment => !(comment.id === commentId && comment.isDraft))
    );
    setSelectedCommentId(prev => (prev === commentId ? null : prev));
  };

  const markCommentResolved = (commentId: number) => {
    setComments(prev =>
      prev.map(comment =>
        comment.id === commentId
          ? { ...comment, resolved: true, isAwaitingReply: false, isReplying: false, replyDraftText: '' }
          : comment
      )
    );
  };

  const openReplyComposer = (commentId: number) => {
    setComments(prev =>
      prev.map(comment =>
        comment.id === commentId
          ? { ...comment, isReplying: true }
          : { ...comment, isReplying: false }
      )
    );
    setSelectedCommentId(commentId);
  };

  const updateReplyDraftText = (commentId: number, replyDraftText: string) => {
    setComments(prev =>
      prev.map(comment =>
        comment.id === commentId ? { ...comment, replyDraftText } : comment
      )
    );
  };

  const cancelReplyDraft = (commentId: number) => {
    setComments(prev =>
      prev.map(comment =>
        comment.id === commentId
          ? { ...comment, isReplying: false, replyDraftText: '' }
          : comment
      )
    );
  };

  const submitCommentMessage = (commentId: number, source: 'draft' | 'reply') => {
    const comment = comments.find(item => item.id === commentId);
    const draftText = source === 'draft'
      ? comment?.draftText.trim()
      : comment?.replyDraftText.trim();

    if (!comment || !draftText) return;

    const submittedAt = createTimeLabel();
    const submittedMessage: CommentMessage = {
      id: `${commentId}-human-${Date.now()}`,
      author: currentUserName,
      authorType: 'human',
      text: draftText,
      time: submittedAt
    };
    const agentReplyTexts = buildAgentReply(comment.type, comment.highlight, draftText);

    setComments(prev =>
      prev.map(item =>
        item.id === commentId
          ? {
              ...item,
              createdAtLabel: 'Just now',
              messages: [...item.messages, submittedMessage],
              draftText: '',
              isDraft: false,
              isReplying: false,
              replyDraftText: '',
              isAwaitingReply: true
            }
          : item
      )
    );
    setSelectedCommentId(commentId);

    const replyTimeoutId = window.setTimeout(() => {
      setComments(prev =>
        prev.map(item => {
          if (item.id !== commentId || !item.isAwaitingReply) {
            return item;
          }

          return {
            ...item,
            isAwaitingReply: false,
            messages: [
              ...item.messages,
              ...agentReplyTexts.map((text, index) => ({
                id: `${commentId}-agent-${Date.now()}-${index}`,
                author: 'Claude 3.5 Sonnet',
                authorType: 'agent' as const,
                text,
                time: 'Just now'
              }))
            ]
          };
        })
      );
      replyTimeoutsRef.current = replyTimeoutsRef.current.filter(id => id !== replyTimeoutId);
    }, 900);

    replyTimeoutsRef.current.push(replyTimeoutId);
  };

  const isCurrentUserMessage = (message: CommentMessage) =>
    message.authorType === 'human' && message.author === currentUserName;

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
                  className={`comment-highlight ${selectedCommentId === comment.id ? 'active' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedCommentId(comment.id);
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
              {isChatLog ? 'Claude & Maya: Feature Discussion' : 'Project Alpha Architecture'}
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
            <div
              className="w-6 h-6 rounded-full bg-stone-200 flex items-center justify-center text-[10px] text-stone-700 border border-white z-20"
              title={isChatLog ? externalCollaboratorName : currentUserName}
            >
              {(isChatLog ? externalCollaboratorName : currentUserName).charAt(0)}
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
                onClick={() => setSelectedCommentId(comment.id)}
                className={`p-4 rounded-xl border bg-white shadow-sm cursor-pointer transition-all comment-card ${
                  selectedCommentId === comment.id || comment.isDraft
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
                    {comment.isDraft && (
                      <span className="text-[10px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded bg-sky-100 text-sky-700 border border-sky-200">
                        Draft
                      </span>
                    )}
                    <span className="text-[10px] text-stone-400">•</span>
                    <span className="text-[10px] text-stone-500">{comment.createdAtLabel}</span>
                  </div>
                  {comment.type === 'comment' && !comment.isDraft && !comment.resolved && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        markCommentResolved(comment.id);
                      }}
                      className="text-[10px] font-medium text-stone-400 hover:text-stone-600 px-2 py-1 rounded-md hover:bg-stone-100 transition-colors"
                    >
                      Resolve
                    </button>
                  )}
                  {comment.resolved && (
                    <span className="text-[10px] font-medium text-emerald-600 flex items-center gap-1">
                      <Check className="w-3 h-3" /> Resolved
                    </span>
                  )}
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
                  {comment.isDraft ? (
                    <div className="px-1">
                      <textarea
                        autoFocus={selectedCommentId === comment.id}
                        value={comment.draftText}
                        placeholder="Write a comment..."
                        className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2 text-sm focus:outline-none focus:border-stone-300 transition-colors resize-none"
                        rows={4}
                        onChange={(e) => updateDraftText(comment.id, e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            submitCommentMessage(comment.id, 'draft');
                          }
                        }}
                      />
                      <div className="flex justify-end gap-2 mt-2">
                        <button 
                          onClick={() => cancelDraftComment(comment.id)}
                          className="px-2 py-1 text-[10px] font-medium text-stone-500 hover:text-stone-800 transition-colors"
                        >
                          Cancel
                        </button>
                        <button 
                          onClick={() => submitCommentMessage(comment.id, 'draft')}
                          disabled={!comment.draftText.trim()}
                          className="px-2 py-1 bg-stone-900 text-white text-[10px] font-medium rounded hover:bg-stone-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Comment
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2.5 px-1">
                      {comment.messages.map((message) => (
                        <div
                          key={message.id}
                          className={`rounded-lg border px-3 py-2.5 ${
                            message.authorType === 'agent'
                              ? 'bg-stone-50 border-stone-200'
                              : 'bg-white border-stone-200'
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1.5">
                            <div className="relative">
                              <div
                                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                                  message.authorType === 'agent'
                                    ? 'bg-white text-stone-500 border border-stone-200'
                                    : 'bg-stone-100 text-stone-700 border border-stone-300'
                                }`}
                              >
                                {message.authorType === 'agent' ? (
                                  <Bot className="w-3 h-3" />
                                ) : (
                                  message.author.charAt(0)
                                )}
                              </div>
                              {isCurrentUserMessage(message) && (
                                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-stone-900 border border-white" />
                              )}
                            </div>
                            <span
                              className={`text-[10px] font-bold uppercase tracking-wider ${
                                message.authorType === 'agent' ? 'text-stone-500' : 'text-stone-600'
                              }`}
                            >
                              {message.author}
                            </span>
                            {isCurrentUserMessage(message) && (
                              <span className="text-[10px] font-medium text-stone-400">you</span>
                            )}
                            <span
                              className={`text-[10px] ${
                                message.authorType === 'agent' ? 'text-stone-400' : 'text-stone-400'
                              }`}
                            >
                              {message.time}
                            </span>
                          </div>
                          <p
                            className={`text-sm leading-relaxed ${
                              message.authorType === 'agent' ? 'text-stone-700' : 'text-stone-700'
                            }`}
                          >
                            {message.text}
                          </p>
                        </div>
                      ))}

                      {comment.isAwaitingReply && (
                        <div className="rounded-lg border border-dashed border-stone-300 bg-stone-50 px-3 py-3">
                          <div className="flex items-center gap-2 mb-1.5">
                            <div className="w-5 h-5 rounded-full bg-white text-stone-500 border border-stone-200 flex items-center justify-center">
                              <Bot className="w-3 h-3" />
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                              Claude 3.5 Sonnet
                            </span>
                          </div>
                          <p className="text-sm text-stone-400 italic">Drafting a reply...</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                {!comment.resolved && !comment.isDraft && (
                  <div className="flex flex-col gap-2 mt-3 pt-3 border-t border-stone-100">
                    {comment.type === 'modify' ? (
                      <div className="flex items-center gap-2">
                          <button
                            onClick={() => markCommentResolved(comment.id)}
                            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded bg-emerald-50 hover:bg-emerald-100 text-xs font-medium text-emerald-700 transition-colors border border-emerald-200"
                          >
                            <Check className="w-3 h-3" /> Accept
                          </button>
                          <button
                            onClick={() => markCommentResolved(comment.id)}
                            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded bg-rose-50 hover:bg-rose-100 text-xs font-medium text-rose-700 transition-colors border border-rose-200"
                          >
                            <X className="w-3 h-3" /> Reject
                          </button>
                      </div>
                    ) : (
                      comment.isReplying ? (
                        <div className="space-y-2">
                          <textarea
                            autoFocus={selectedCommentId === comment.id}
                            value={comment.replyDraftText}
                            placeholder="Reply in thread..."
                            className="w-full bg-stone-50 border border-stone-200 rounded-lg p-2 text-sm focus:outline-none focus:border-stone-300 transition-colors resize-none"
                            rows={3}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => updateReplyDraftText(comment.id, e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                submitCommentMessage(comment.id, 'reply');
                              }
                            }}
                          />
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                cancelReplyDraft(comment.id);
                              }}
                              className="px-2 py-1 text-[10px] font-medium text-stone-500 hover:text-stone-800 transition-colors"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                submitCommentMessage(comment.id, 'reply');
                              }}
                              disabled={!comment.replyDraftText.trim()}
                              className="px-2 py-1 bg-stone-900 text-white text-[10px] font-medium rounded hover:bg-stone-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Reply
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openReplyComposer(comment.id);
                          }}
                          className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-stone-50 hover:bg-stone-100 text-xs font-medium text-stone-600 transition-colors border border-stone-200"
                        >
                          <MessageSquare className="w-3.5 h-3.5" /> Reply in thread
                        </button>
                      )
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
