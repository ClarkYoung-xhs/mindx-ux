import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  MessageSquare, 
  Share2, 
  Bot, 
  Clock, 
  Sparkles,
  RefreshCw,
  MoreHorizontal,
  Quote,
  Check,
  X,
  Reply,
  Send,
  History,
  Link2,
  ChevronDown,
  Download,
  Copy,
  FileText,
  Eye,
  Users,
  Calendar,
  ChevronRight,
  FilePlus2,
  Tag,
  Shield,
  Plus,
  Globe,
  Lock,
  Pencil
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

interface VersionHistory {
  id: string;
  author: string;
  authorType: 'human' | 'agent';
  timestamp: string;
  date: string;
  changes: string;
  paragraphs: Paragraph[];
}

interface AgentPermission {
  agentId: string;
  agentName: string;
  permission: 'read' | 'edit';
}

interface Collaborator {
  id: string;
  name: string;
  type: 'human' | 'agent';
  isActive: boolean;
  cursorPosition?: number; // Paragraph index where cursor is
  color: string; // For cursor flag color
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

function buildAgentReply(type: CommentThreadType, highlight: string, userText: string): string[] {
  if (type === 'modify') {
    return [`I've reviewed the suggestion about "${highlight}". ${userText ? `Regarding your note: "${userText}" — ` : ''}I'll update the document accordingly.`];
  }
  return [`Thanks for the comment on "${highlight}". ${userText ? `You mentioned: "${userText}" — ` : ''}I'll take this into consideration.`];
}

export default function DocumentEditor() {
  const navigate = useNavigate();
  const currentUserName = 'You';
  const externalCollaboratorName = 'Maya Chen';
  const [isChatLog, setIsChatLog] = useState(false);
  
  // Sidebar states
  const [showCommentsSidebar, setShowCommentsSidebar] = useState(true);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [showCollaboratorsSidebar, setShowCollaboratorsSidebar] = useState(false);
  
  // Modal states
  const [duplicateModalOpen, setDuplicateModalOpen] = useState(false);
  const [labelModalOpen, setLabelModalOpen] = useState(false);
  const [agentPermissionModalOpen, setAgentPermissionModalOpen] = useState(false);
  const [duplicateName, setDuplicateName] = useState('');
  const [documentLabels, setDocumentLabels] = useState<string[]>(['Project Alpha', 'PRD']);
  const [tagInput, setTagInput] = useState('');
  const [usedTags] = useState<string[]>(['PRD', 'Data', 'Design', 'Research', 'Marketing', 'Meeting Notes', 'Finance']);
  const [agentPermissions, setAgentPermissions] = useState<AgentPermission[]>([
    { agentId: 'agent1', agentName: 'Claude Assistant', permission: 'edit' },
    { agentId: 'agent2', agentName: 'Research Bot', permission: 'read' }
  ]);
  
  // Collaborators state
  const [collaborators, setCollaborators] = useState<Collaborator[]>([
    { id: 'user1', name: currentUserName, type: 'human', isActive: true, color: '#3b82f6' },
    { id: 'agent1', name: 'Claude Assistant', type: 'agent', isActive: true, cursorPosition: 8, color: '#8b5cf6' },
    { id: 'agent2', name: 'Research Bot', type: 'agent', isActive: true, cursorPosition: 15, color: '#ec4899' },
    { id: 'agent3', name: 'Data Analyzer', type: 'agent', isActive: false, color: '#10b981' }
  ]);
  
  const [hoveredParagraph, setHoveredParagraph] = useState<number | null>(null);
  
  // Share settings
  const [sharePermission, setSharePermission] = useState<'private' | 'view'>('private');
  const [allowDownload, setAllowDownload] = useState(false);
  const [allowCopy, setAllowCopy] = useState(false);
  const [allowDuplicate, setAllowDuplicate] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  
  // Version history
  const [selectedVersion, setSelectedVersion] = useState<string | null>(null);
  const [versionFilterDate, setVersionFilterDate] = useState<string>('all');
  const [versionFilterAuthor, setVersionFilterAuthor] = useState<string>('all');
  
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: 'm1', sender: externalCollaboratorName, senderType: 'human', text: 'Hey Claude, can you help me draft the architecture for Project Alpha?', time: '10:00 AM' },
    { id: 'm2', sender: 'Claude 3.5 Sonnet', senderType: 'agent', text: 'Of course! I\'d be happy to help. What are the main requirements for the system?', time: '10:01 AM' },
    { id: 'm3', sender: externalCollaboratorName, senderType: 'human', text: 'It needs to be a microservices-based system with an Auth Service, Data Service, and Notification Service.', time: '10:05 AM' },
    { id: 'm4', sender: 'Claude 3.5 Sonnet', senderType: 'agent', text: 'Got it. For the Auth Service, I recommend using OAuth 2.0. The Data Service should probably use PostgreSQL for relational data.', time: '10:07 AM' },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [sharePublishToWeb, setSharePublishToWeb] = useState(false);
  const [shareLinkCopied, setShareLinkCopied] = useState(false);
  const [shareAccessLevel, setShareAccessLevel] = useState<'invited' | 'view' | 'edit'>('invited');
  const [showAccessDropdown, setShowAccessDropdown] = useState(false);
  const [shareInviteMode, setShareInviteMode] = useState(false);
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
      text: 'Each service is independently deployable and communicates through well-defined APIs. This architecture allows for better scalability and maintainability.',
      author: currentUserName,
      authorType: 'human'
    },
    {
      id: 'p6',
      text: '### 2. Auth Service Details',
      author: currentUserName,
      authorType: 'human'
    },
    {
      id: 'p7',
      text: 'The Auth Service implements JWT-based authentication with refresh token rotation. It supports OAuth2.0 for third-party integrations including Google, GitHub, and Microsoft.',
      author: 'Claude 3.5 Sonnet',
      authorType: 'agent'
    },
    {
      id: 'p8',
      text: 'Security features include:\n- Rate limiting on login attempts\n- Multi-factor authentication support\n- Session management with Redis\n- Password hashing using bcrypt with salt rounds of 12',
      author: 'Claude 3.5 Sonnet',
      authorType: 'agent'
    },
    {
      id: 'p9',
      text: '### 3. Data Service Architecture',
      author: currentUserName,
      authorType: 'human'
    },
    {
      id: 'p10',
      text: 'The Data Service handles all business logic and database operations. It implements the repository pattern for data access and uses TypeORM as the ORM layer.',
      author: currentUserName,
      authorType: 'human'
    },
    {
      id: 'p11',
      text: '#### 3.1 Database Schema',
      author: currentUserName,
      authorType: 'human'
    },
    {
      id: 'p12',
      text: 'We will use PostgreSQL for the primary database. We will use Redis for caching to improve performance. The schema is designed to be highly normalized to ensure data integrity.',
      author: 'Claude 3.5 Sonnet',
      authorType: 'agent'
    },
    {
      id: 'p13',
      text: 'Key tables include:\n- **users**: Store user profiles and credentials\n- **workspaces**: Organize user documents and projects\n- **documents**: Store document metadata and content\n- **permissions**: Handle access control and sharing',
      author: 'Claude 3.5 Sonnet',
      authorType: 'agent'
    },
    {
      id: 'p14',
      text: '#### 3.2 Caching Strategy',
      author: currentUserName,
      authorType: 'human'
    },
    {
      id: 'p15',
      text: 'Redis is used for caching frequently accessed data with TTL-based expiration. Cache invalidation follows a write-through pattern to ensure consistency.',
      author: 'Claude 3.5 Sonnet',
      authorType: 'agent'
    },
    {
      id: 'p16',
      text: '### 4. Notification Service',
      author: currentUserName,
      authorType: 'human'
    },
    {
      id: 'p17',
      text: 'The Notification Service manages all outbound communications including emails, SMS, and push notifications. It uses a message queue (RabbitMQ) for reliable delivery.',
      author: 'Claude 3.5 Sonnet',
      authorType: 'agent'
    },
    {
      id: 'p18',
      text: 'Notification templates are stored in the database and support internationalization. The service tracks delivery status and provides retry mechanisms for failed notifications.',
      author: 'Claude 3.5 Sonnet',
      authorType: 'agent'
    },
    {
      id: 'p19',
      text: '### 5. API Gateway',
      author: currentUserName,
      authorType: 'human'
    },
    {
      id: 'p20',
      text: 'An API Gateway sits in front of all microservices to handle routing, rate limiting, and authentication. It uses Kong for its robust plugin ecosystem.',
      author: currentUserName,
      authorType: 'human'
    },
    {
      id: 'p21',
      text: '### 6. Deployment',
      author: currentUserName,
      authorType: 'human'
    },
    {
      id: 'p22',
      text: 'The application will be containerized using Docker and deployed to a Kubernetes cluster. Maya also wants staging approval checkpoints called out before the release section.',
      author: externalCollaboratorName,
      authorType: 'human'
    },
    {
      id: 'p23',
      text: '#### 6.1 CI/CD Pipeline',
      author: currentUserName,
      authorType: 'human'
    },
    {
      id: 'p24',
      text: 'The CI/CD pipeline uses GitHub Actions for automated testing and deployment:\n1. Code push triggers automated tests\n2. Successful tests build Docker images\n3. Images are pushed to container registry\n4. Staging environment is automatically updated\n5. After approval, production deployment is triggered',
      author: 'Claude 3.5 Sonnet',
      authorType: 'agent'
    },
    {
      id: 'p25',
      text: '### 7. Monitoring and Observability',
      author: currentUserName,
      authorType: 'human'
    },
    {
      id: 'p26',
      text: 'We use Prometheus for metrics collection, Grafana for visualization, and ELK stack for log aggregation. Distributed tracing is implemented using Jaeger.',
      author: 'Claude 3.5 Sonnet',
      authorType: 'agent'
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

  const [versionHistory, setVersionHistory] = useState<VersionHistory[]>([
    {
      id: 'v1',
      author: 'Claude 3.5 Sonnet',
      authorType: 'agent',
      timestamp: '2 mins ago',
      date: 'Today',
      changes: 'Updated deployment section with staging approval',
      paragraphs: [...paragraphs]
    },
    {
      id: 'v2',
      author: externalCollaboratorName,
      authorType: 'human',
      timestamp: '15 mins ago',
      date: 'Today',
      changes: 'Added deployment requirements',
      paragraphs: paragraphs.slice(0, -1)
    },
    {
      id: 'v3',
      author: 'Claude 3.5 Sonnet',
      authorType: 'agent',
      timestamp: '1 hour ago',
      date: 'Today',
      changes: 'Expanded database schema section',
      paragraphs: paragraphs.slice(0, 6)
    },
    {
      id: 'v4',
      author: currentUserName,
      authorType: 'human',
      timestamp: '2 hours ago',
      date: 'Today',
      changes: 'Initial architecture draft',
      paragraphs: paragraphs.slice(0, 3)
    }
  ]);

  const [activeCommentId, setActiveCommentId] = useState<number | null>(null);
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
    }
  }, [activeCommentId, comments]);

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
    setActiveCommentId(prev => (prev === commentId ? null : prev));
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
    setActiveCommentId(commentId);
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
    setActiveCommentId(commentId);

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

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (showShareMenu && !(e.target as Element).closest('.share-menu-container')) {
        setShowShareMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showShareMenu]);

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

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleRestoreVersion = (versionId: string) => {
    const version = versionHistory.find(v => v.id === versionId);
    if (version) {
      setParagraphs([...version.paragraphs]);
      setShowVersionHistory(false);
      setSelectedVersion(null);
    }
  };

  const scrollToCollaborator = (collaboratorId: string) => {
    const collaborator = collaborators.find(c => c.id === collaboratorId);
    if (collaborator && collaborator.cursorPosition !== undefined) {
      const paragraphElements = editorRef.current?.querySelectorAll('.paragraph-item');
      if (paragraphElements && paragraphElements[collaborator.cursorPosition]) {
        paragraphElements[collaborator.cursorPosition].scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }
    }
  };

  const displayedParagraphs = selectedVersion 
    ? versionHistory.find(v => v.id === selectedVersion)?.paragraphs || paragraphs
    : paragraphs;

  const filteredVersions = versionHistory.filter(v => {
    if (versionFilterAuthor !== 'all' && v.author !== versionFilterAuthor) return false;
    if (versionFilterDate !== 'all' && v.date !== versionFilterDate) return false;
    return true;
  });

  return (
    <div className="h-screen bg-white text-stone-800 flex flex-col font-sans selection:bg-stone-200 overflow-hidden">
      {/* Header */}
      <header className="h-14 flex items-center justify-between px-4 border-b border-stone-200 bg-white/80 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/dashboard')} className="p-2 rounded-md hover:bg-stone-100 text-stone-500 transition-colors">
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
          
          <button 
            onClick={() => {
              setShowCollaboratorsSidebar(!showCollaboratorsSidebar);
              setShowCommentsSidebar(false);
              setShowVersionHistory(false);
            }}
            className="flex -space-x-2 mr-4 hover:opacity-80 transition-opacity cursor-pointer"
            title="查看协作者"
          >
            <div className="w-6 h-6 rounded-full bg-stone-100 flex items-center justify-center text-[10px] text-stone-600 border border-white z-10">
              <Bot className="w-3 h-3" />
            </div>
            <div
              className="w-6 h-6 rounded-full bg-stone-200 flex items-center justify-center text-[10px] text-stone-700 border border-white z-20"
              title={isChatLog ? externalCollaboratorName : currentUserName}
            >
              {(isChatLog ? externalCollaboratorName : currentUserName).charAt(0)}
            </div>
          </button>



          {/* Version History Button */}
          <button 
            onClick={() => {
              setShowVersionHistory(!showVersionHistory);
              setShowCommentsSidebar(false);
            }}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-stone-100 text-sm font-medium transition-colors ${showVersionHistory ? 'bg-stone-100 text-stone-900' : 'text-stone-600'}`}
          >
            <History className="w-4 h-4" /> 版本历史
          </button>

          {/* Notion-style Share Popover */}
          <div className="relative">
            <button 
              onClick={() => setIsShareOpen(!isShareOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-stone-100 text-sm font-medium text-stone-600 transition-colors"
            >
              <Share2 className="w-4 h-4" /> 分享
            </button>

            {isShareOpen && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => { setIsShareOpen(false); setShareInviteMode(false); }} />
                <div className="absolute right-0 top-full mt-2 w-[420px] bg-white border border-stone-200 rounded-xl shadow-2xl z-40 overflow-hidden" onClick={(e) => e.stopPropagation()}>
                  
                  {shareInviteMode ? (
                    <>
                      {/* Invite sub-page header */}
                      <div className="flex items-center gap-2 px-4 pt-4 pb-2">
                        <button 
                          onClick={() => setShareInviteMode(false)}
                          className="p-1 rounded-md hover:bg-stone-100 transition-colors"
                        >
                          <ArrowLeft className="w-4 h-4 text-stone-500" />
                        </button>
                        <span className="text-sm font-semibold text-stone-900">邀请</span>
                      </div>
                      {/* Invite input */}
                      <div className="px-4 pb-4">
                        <div className="flex items-center gap-2">
                          <input 
                            type="text" 
                            placeholder="Agent 名称或邮件地址，以逗号分隔" 
                            autoFocus
                            className="flex-1 bg-white border-2 border-stone-900 rounded-lg px-3 py-2 text-sm focus:outline-none transition-colors placeholder:text-stone-400"
                          />
                          <button className="px-3 py-2 bg-stone-900 text-white text-sm font-medium rounded-lg hover:bg-stone-800 transition-colors shrink-0">
                            邀请
                          </button>
                        </div>
                      </div>
                      {/* Import contacts */}
                      <div className="flex flex-col items-center justify-center py-10 px-6">
                        <div className="flex items-center gap-4 mb-4">
                          {/* WeChat icon */}
                          <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity">
                            <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="currentColor">
                              <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm3.21 4.127c-3.894 0-7.164 2.58-7.164 5.638 0 3.06 3.27 5.64 7.164 5.64.867 0 1.703-.142 2.478-.4a.712.712 0 0 1 .59.08l1.563.924a.266.266 0 0 0 .136.045c.131 0 .237-.108.237-.241 0-.06-.023-.117-.039-.174l-.32-1.217a.481.481 0 0 1 .176-.546C21.096 19.158 22 17.486 22 15.756c0-3.059-3.27-5.638-7.192-5.638zm-2.335 2.934c.528 0 .956.434.956.97a.963.963 0 0 1-.956.97.963.963 0 0 1-.957-.97c0-.536.428-.97.957-.97zm4.672 0c.528 0 .956.434.956.97a.963.963 0 0 1-.956.97.963.963 0 0 1-.957-.97c0-.536.428-.97.957-.97z"/>
                            </svg>
                          </div>
                          {/* QQ icon */}
                          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity">
                            <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="currentColor">
                              <path d="M21.395 15.035a39.548 39.548 0 0 0-1.066-2.158c-.09-.17-.178-.336-.263-.5a13.157 13.157 0 0 0 .064-1.274c0-4.545-2.558-8.23-5.714-8.23h-.002c-.324 0-.643.039-.955.107A4.357 4.357 0 0 0 12 2.467a4.357 4.357 0 0 0-1.459.513c-.312-.068-.631-.107-.955-.107h-.002c-3.156 0-5.714 3.685-5.714 8.23 0 .433.023.864.064 1.274-.085.164-.173.33-.263.5a39.548 39.548 0 0 0-1.066 2.158c-.378.817-1.456 3.332-.709 3.946.339.278.822-.015 1.376-.588.192-.199.394-.437.604-.71a7.847 7.847 0 0 0 2.087 2.593c-.066.253-.108.49-.108.687 0 .638.223.923.636 1.077-.063.164-.098.336-.098.507 0 .87.768 1.453 2.078 1.453.745 0 1.553-.152 2.185-.552a3.03 3.03 0 0 0 1.344.321 3.03 3.03 0 0 0 1.344-.321c.632.4 1.44.552 2.185.552 1.31 0 2.078-.583 2.078-1.453 0-.17-.035-.343-.098-.507.413-.154.636-.439.636-1.077 0-.197-.042-.434-.108-.687a7.847 7.847 0 0 0 2.087-2.593c.21.273.412.511.604.71.554.573 1.037.866 1.376.588.747-.614-.331-3.13-.709-3.946z"/>
                            </svg>
                          </div>
                        </div>
                        <p className="text-sm font-semibold text-stone-800 mb-1">导入联系人</p>
                        <p className="text-xs text-stone-400 mb-4">关联微信、QQ 快速添加协作成员</p>
                        <button className="px-4 py-1.5 border border-stone-200 rounded-lg text-sm text-stone-700 font-medium hover:bg-stone-50 transition-colors">
                          立即开始
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                  {/* Invite input */}
                  <div className="p-4 border-b border-stone-100">
                    <div className="flex items-center gap-2">
                      <input 
                        type="text" 
                        placeholder="添加用户、Agent或邮箱..." 
                        onFocus={() => setShareInviteMode(true)}
                        className="flex-1 bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-stone-400 focus:bg-white transition-colors placeholder:text-stone-400"
                      />
                      <button className="px-3 py-2 bg-stone-900 text-white text-sm font-medium rounded-lg hover:bg-stone-800 transition-colors shrink-0">
                        邀请
                      </button>
                    </div>
                  </div>

                  {/* Members list */}
                  <div className="p-2 max-h-60 overflow-y-auto">
                    <div className="px-2 py-1 text-xs font-bold text-stone-400 uppercase tracking-wider">协作成员</div>
                    
                    {/* Owner - 我 */}
                    <div className="flex items-center justify-between px-2 py-2 rounded-lg hover:bg-stone-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-stone-600 flex items-center justify-center text-white text-xs font-medium">我</div>
                        <div>
                          <p className="text-sm font-medium text-stone-900">我</p>
                          <p className="text-[11px] text-stone-400">you@example.com</p>
                        </div>
                      </div>
                      <span className="text-xs text-stone-400 font-medium">创建者</span>
                    </div>

                    {/* Human collaborator - Clark */}
                    <div className="flex items-center justify-between px-2 py-2 rounded-lg hover:bg-stone-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-medium">C</div>
                        <div>
                          <p className="text-sm font-medium text-stone-900">Clark</p>
                          <p className="text-[11px] text-stone-400">clark@example.com</p>
                        </div>
                      </div>
                      <select className="text-xs text-stone-600 font-medium bg-transparent border border-stone-200 rounded-md px-2 py-1 focus:outline-none cursor-pointer hover:bg-stone-50">
                        <option>可编辑</option>
                        <option>可查看</option>
                      </select>
                    </div>

                    {/* Human collaborator - Maya */}
                    <div className="flex items-center justify-between px-2 py-2 rounded-lg hover:bg-stone-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-violet-600 flex items-center justify-center text-white text-xs font-medium">M</div>
                        <div>
                          <p className="text-sm font-medium text-stone-900">Maya Chen</p>
                          <p className="text-[11px] text-stone-400">maya@example.com</p>
                        </div>
                      </div>
                      <select className="text-xs text-stone-600 font-medium bg-transparent border border-stone-200 rounded-md px-2 py-1 focus:outline-none cursor-pointer hover:bg-stone-50">
                        <option>可编辑</option>
                        <option>可查看</option>
                      </select>
                    </div>

                    {/* Agent - Claude 3.5 Sonnet (owner: 我) */}
                    <div className="flex items-center justify-between px-2 py-2 rounded-lg hover:bg-stone-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-amber-600 flex items-center justify-center text-white text-xs">
                          <Bot className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-stone-900">Claude 3.5 Sonnet</p>
                          <p className="text-[11px] text-stone-400">Agent｜我</p>
                        </div>
                      </div>
                      <select className="text-xs text-stone-600 font-medium bg-transparent border border-stone-200 rounded-md px-2 py-1 focus:outline-none cursor-pointer hover:bg-stone-50">
                        <option>可编辑</option>
                        <option>可查看</option>
                      </select>
                    </div>

                    {/* Agent - Research Bot (owner: Clark) */}
                    <div className="flex items-center justify-between px-2 py-2 rounded-lg hover:bg-stone-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-emerald-600 flex items-center justify-center text-white text-xs">
                          <Bot className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-stone-900">Research Bot</p>
                          <p className="text-[11px] text-stone-400">Agent｜Clark</p>
                        </div>
                      </div>
                      <select className="text-xs text-stone-600 font-medium bg-transparent border border-stone-200 rounded-md px-2 py-1 focus:outline-none cursor-pointer hover:bg-stone-50">
                        <option>可查看</option>
                        <option>可编辑</option>
                      </select>
                    </div>

                    {/* Agent - Data Analyzer (owner: Maya Chen) */}
                    <div className="flex items-center justify-between px-2 py-2 rounded-lg hover:bg-stone-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-rose-600 flex items-center justify-center text-white text-xs">
                          <Bot className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-stone-900">Data Analyzer</p>
                          <p className="text-[11px] text-stone-400">Agent｜Maya Chen</p>
                        </div>
                      </div>
                      <select className="text-xs text-stone-600 font-medium bg-transparent border border-stone-200 rounded-md px-2 py-1 focus:outline-none cursor-pointer hover:bg-stone-50">
                        <option>可编辑</option>
                        <option>可查看</option>
                      </select>
                    </div>
                  </div>

                  {/* Access permission & Copy link */}
                  <div className="border-t border-stone-100 p-3">
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <button
                          onClick={() => setShowAccessDropdown(!showAccessDropdown)}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg border border-stone-200 hover:bg-stone-50 text-sm text-stone-700 font-medium transition-colors"
                        >
                          {shareAccessLevel === 'invited' && <Lock className="w-3.5 h-3.5 text-stone-500" />}
                          {shareAccessLevel === 'view' && <Eye className="w-3.5 h-3.5 text-stone-500" />}
                          {shareAccessLevel === 'edit' && <Pencil className="w-3.5 h-3.5 text-stone-500" />}
                          <span className="truncate">
                            {shareAccessLevel === 'invited' && '仅限协作成员访问'}
                            {shareAccessLevel === 'view' && '获得链接的任何人都可查看'}
                            {shareAccessLevel === 'edit' && '获得链接的任何人都可编辑'}
                          </span>
                          <ChevronDown className="w-3.5 h-3.5 text-stone-400 ml-auto flex-shrink-0" />
                        </button>
                        {showAccessDropdown && (
                          <div className="absolute bottom-full left-0 right-0 mb-1 bg-white rounded-xl shadow-lg border border-stone-200 py-1 z-50">
                            <button
                              onClick={() => { setShareAccessLevel('invited'); setShowAccessDropdown(false); }}
                              className="w-full flex items-center gap-2.5 px-3 py-2.5 hover:bg-stone-50 transition-colors text-left"
                            >
                              <Lock className="w-4 h-4 text-stone-500" />
                              <span className="text-sm text-stone-700">仅限协作成员访问</span>
                              {shareAccessLevel === 'invited' && <Check className="w-4 h-4 text-stone-900 ml-auto" />}
                            </button>
                            <button
                              onClick={() => { setShareAccessLevel('view'); setShowAccessDropdown(false); }}
                              className="w-full flex items-center gap-2.5 px-3 py-2.5 hover:bg-stone-50 transition-colors text-left"
                            >
                              <Eye className="w-4 h-4 text-stone-500" />
                              <span className="text-sm text-stone-700">获得链接的任何人都可查看</span>
                              {shareAccessLevel === 'view' && <Check className="w-4 h-4 text-stone-900 ml-auto" />}
                            </button>
                            <button
                              onClick={() => { setShareAccessLevel('edit'); setShowAccessDropdown(false); }}
                              className="w-full flex items-center gap-2.5 px-3 py-2.5 hover:bg-stone-50 transition-colors text-left"
                            >
                              <Pencil className="w-4 h-4 text-stone-500" />
                              <span className="text-sm text-stone-700">获得链接的任何人都可编辑</span>
                              {shareAccessLevel === 'edit' && <Check className="w-4 h-4 text-stone-900 ml-auto" />}
                            </button>
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(`https://mindx.app/d/project-alpha`);
                          setShareLinkCopied(true);
                          setTimeout(() => setShareLinkCopied(false), 2000);
                        }}
                        className="flex-shrink-0 px-4 py-2 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-sm font-medium transition-colors"
                      >
                        {shareLinkCopied ? '已复制！' : '复制链接'}
                      </button>
                    </div>
                  </div>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
          
          {/* Comments Button */}
          <button 
            onClick={() => {
              setShowCommentsSidebar(!showCommentsSidebar);
              setShowVersionHistory(false);
            }}
            className={`p-1.5 rounded-md hover:bg-stone-100 transition-colors ${showCommentsSidebar ? 'bg-stone-100 text-stone-900' : 'text-stone-500'}`}
            title="查看评论"
          >
            <MessageSquare className="w-4 h-4" />
          </button>
          
          {/* More Menu Button */}
          <div className="relative">
            <button 
              onClick={() => setShowMoreMenu(!showMoreMenu)}
              className="p-1.5 rounded-md hover:bg-stone-100 text-stone-500 transition-colors"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
            
            {showMoreMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowMoreMenu(false)} />
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute right-0 top-full mt-1 w-48 bg-white border border-stone-200 rounded-lg shadow-xl z-20 overflow-hidden py-1"
                >
                  <button
                    onClick={() => {
                      setShowMoreMenu(false);
                      setDuplicateName('副本-Project Alpha Architecture');
                      setDuplicateModalOpen(true);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-stone-700 hover:bg-stone-50 transition-colors"
                  >
                    <FilePlus2 className="w-4 h-4 text-stone-400" />
                    创建副本
                  </button>
                  <button
                    onClick={() => {
                      setShowMoreMenu(false);
                      setLabelModalOpen(true);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-stone-700 hover:bg-stone-50 transition-colors"
                  >
                    <Tag className="w-4 h-4 text-stone-400" />
                    设置标签
                  </button>
                </motion.div>
              </>
            )}
          </div>
        </div>
      </header>


      {/* Editor & Sidebar */}
      <div className={`flex-1 flex overflow-hidden relative transition-all duration-300 ${
        showCollaboratorsSidebar ? 'mr-80' : 'mr-0'
      }`} onMouseUp={handleMouseUp}>
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
              displayedParagraphs.map((p, index) => {
                // Find collaborators with cursor at this position
                const collaboratorsHere = collaborators.filter(
                  c => c.isActive && c.cursorPosition === index && c.type === 'agent'
                );
                
                return (
                  <div 
                    key={p.id} 
                    className="group relative pl-10 paragraph-item"
                    onMouseEnter={() => setHoveredParagraph(index)}
                    onMouseLeave={() => setHoveredParagraph(null)}
                  >
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
                      className="w-full bg-transparent border-none focus:outline-none text-stone-800 font-sans text-lg leading-relaxed whitespace-pre-wrap relative"
                      contentEditable
                      suppressContentEditableWarning
                      onInput={(e) => {
                        const newText = e.currentTarget.innerText;
                        setParagraphs(prev => prev.map(item => item.id === p.id ? { ...item, text: newText } : item));
                      }}
                    >
                      {highlightText(p.text)}
                      
                      {/* Cursor and Flag */}
                      {collaboratorsHere.length > 0 && (
                        <div className="absolute left-1/3 top-0 bottom-0 pointer-events-none">
                          {collaboratorsHere.map((collaborator, idx) => (
                            <div key={collaborator.id} style={{ marginLeft: `${idx * 24}px` }}>
                              {/* Cursor Line - always visible */}
                              <motion.div
                                initial={{ opacity: 1 }}
                                animate={{ opacity: [1, 0.3, 1] }}
                                transition={{ duration: 1, repeat: Infinity }}
                                className="absolute top-0 w-0.5 h-6"
                                style={{ backgroundColor: collaborator.color }}
                              />
                              {/* Flag - only show on hover */}
                              {hoveredParagraph === index && (
                                <motion.div
                                  initial={{ opacity: 0, y: -10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className="absolute -top-8 -left-2 flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-medium text-white shadow-lg whitespace-nowrap"
                                  style={{ backgroundColor: collaborator.color }}
                                >
                                  <Bot className="w-2.5 h-2.5" />
                                  {collaborator.name}
                                </motion.div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </main>

        {/* Comments Sidebar */}
        {!isChatLog && showCommentsSidebar && (
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
          
          <div className={`flex-1 p-4 space-y-4 ${showCommentsSidebar ? 'overflow-y-auto' : 'overflow-hidden'}`}>
            {comments.map((comment) => (
              <motion.div 
                key={comment.id}
                ref={(el) => {
                  if (el) commentRefs.current.set(comment.id, el);
                  else commentRefs.current.delete(comment.id);
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => setActiveCommentId(comment.id)}
                className={`p-4 rounded-xl border bg-white shadow-sm cursor-pointer transition-all comment-card ${
                  activeCommentId === comment.id || comment.isDraft
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
                        autoFocus={activeCommentId === comment.id}
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
                            autoFocus={activeCommentId === comment.id}
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

        {/* Version History Sidebar */}
        {!isChatLog && showVersionHistory && (
          <aside className="w-80 border-l border-stone-200 bg-stone-50 flex flex-col">
            <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-white">
              <h2 className="text-sm font-medium flex items-center gap-2 text-stone-900">
                <History className="w-4 h-4 text-stone-500" />
                版本历史
              </h2>
              <button
                onClick={() => {
                  setShowVersionHistory(false);
                  setSelectedVersion(null);
                }}
                className="p-1 rounded hover:bg-stone-100 text-stone-500 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Filters */}
            <div className="p-4 border-b border-stone-200 bg-white space-y-3">
              <div>
                <label className="text-xs font-medium text-stone-600 mb-1.5 block">按日期筛选</label>
                <select
                  value={versionFilterDate}
                  onChange={(e) => setVersionFilterDate(e.target.value)}
                  className="w-full px-2 py-1.5 border border-stone-200 rounded text-xs focus:outline-none focus:border-stone-400"
                >
                  <option value="all">全部</option>
                  <option value="Today">今天</option>
                  <option value="Yesterday">昨天</option>
                  <option value="This Week">本周</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-stone-600 mb-1.5 block">按协作人筛选</label>
                <select
                  value={versionFilterAuthor}
                  onChange={(e) => setVersionFilterAuthor(e.target.value)}
                  className="w-full px-2 py-1.5 border border-stone-200 rounded text-xs focus:outline-none focus:border-stone-400"
                >
                  <option value="all">全部</option>
                  <option value={currentUserName}>{currentUserName}</option>
                  <option value={externalCollaboratorName}>{externalCollaboratorName}</option>
                  <option value="Claude 3.5 Sonnet">Claude 3.5 Sonnet</option>
                </select>
              </div>
            </div>

            {/* Version List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {filteredVersions.map((version) => (
                <motion.div
                  key={version.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-3 rounded-lg border bg-white cursor-pointer transition-all ${
                    selectedVersion === version.id
                      ? 'border-stone-400 ring-2 ring-stone-900/5'
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                  onClick={() => setSelectedVersion(version.id)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {version.authorType === 'agent' ? (
                        <div className="w-6 h-6 rounded-full bg-stone-100 flex items-center justify-center">
                          <Bot className="w-3 h-3 text-stone-600" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-stone-200 flex items-center justify-center text-[10px] text-stone-700">
                          {version.author.charAt(0)}
                        </div>
                      )}
                      <div>
                        <div className="text-xs font-medium text-stone-900">{version.author}</div>
                        <div className="text-[10px] text-stone-500">{version.timestamp}</div>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-xs text-stone-600 mb-3">{version.changes}</p>
                  
                  {selectedVersion === version.id && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRestoreVersion(version.id);
                      }}
                      className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 bg-stone-900 text-white rounded-md text-xs font-medium hover:bg-stone-800 transition-colors"
                    >
                      <RefreshCw className="w-3 h-3" />
                      还原到此版本
                    </button>
                  )}
                </motion.div>
              ))}
            </div>
          </aside>
        )}

        {/* Collaborators Sidebar */}
        {!isChatLog && showCollaboratorsSidebar && (
          <aside className="fixed right-0 top-12 h-[calc(100vh-3rem)] w-80 border-l border-stone-200 bg-stone-50 flex flex-col z-30 shadow-lg">
            <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-white">
              <h2 className="text-sm font-medium flex items-center gap-2 text-stone-900">
                <Users className="w-4 h-4 text-stone-500" />
                正在协作
              </h2>
              <button
                onClick={() => setShowCollaboratorsSidebar(false)}
                className="p-1 rounded hover:bg-stone-100 text-stone-500 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Collaborators List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {collaborators.filter(c => c.isActive).map((collaborator) => (
                <motion.div
                  key={collaborator.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  onClick={() => scrollToCollaborator(collaborator.id)}
                  className={`p-3 rounded-lg border bg-white cursor-pointer transition-all hover:border-stone-300 ${
                    collaborator.isActive ? 'shadow-sm' : 'opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Avatar */}
                    {collaborator.type === 'agent' ? (
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white shadow-lg"
                        style={{ backgroundColor: collaborator.color }}
                      >
                        <Bot className="w-5 h-5" />
                      </div>
                    ) : (
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-semibold shadow-lg"
                        style={{ backgroundColor: collaborator.color }}
                      >
                        {collaborator.name.charAt(0)}
                      </div>
                    )}
                    
                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-stone-900 truncate">
                          {collaborator.name}
                        </span>
                        <span className="flex-shrink-0 w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      </div>
                      {collaborator.cursorPosition !== undefined && (
                        <div className="text-xs text-stone-500 mt-0.5 flex items-center gap-1">
                          <span className="inline-block w-1 h-3 bg-stone-400 animate-pulse" />
                          正在编辑
                        </div>
                      )}
                    </div>

                    {/* Jump to cursor button */}
                    {collaborator.cursorPosition !== undefined && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          scrollToCollaborator(collaborator.id);
                        }}
                        className="p-1.5 rounded-md hover:bg-stone-100 text-stone-400 hover:text-stone-600 transition-colors"
                        title="跳转到光标位置"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Active Status Footer */}
            <div className="p-4 border-t border-stone-200 bg-white">
              <div className="text-xs text-stone-500 text-center">
                {collaborators.filter(c => c.isActive).length} 人正在协作
              </div>
            </div>
          </aside>
        )}
      </div>

      {/* Duplicate Modal */}
      {duplicateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setDuplicateModalOpen(false)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md"
          >
            <h2 className="text-lg font-semibold mb-4">创建副本</h2>
            <input
              type="text"
              value={duplicateName}
              onChange={(e) => setDuplicateName(e.target.value)}
              className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:outline-none focus:border-stone-400 mb-4"
              placeholder="副本名称"
            />
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDuplicateModalOpen(false)}
                className="px-4 py-2 text-sm text-stone-600 hover:text-stone-900 transition-colors"
              >
                取消
              </button>
              <button
                onClick={() => {
                  if (duplicateName.trim()) {
                    alert(`已创建副本：${duplicateName}`);
                    // Here you would actually create the duplicate in the backend
                  }
                  setDuplicateModalOpen(false);
                }}
                className="px-4 py-2 bg-stone-900 text-white rounded-lg text-sm font-medium hover:bg-stone-800 transition-colors"
              >
                确认
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Label Modal */}
      {labelModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setLabelModalOpen(false)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md"
          >
            <h2 className="text-lg font-semibold mb-4">设置标签</h2>
            
            {/* Current labels */}
            <div className="mb-4">
              <p className="text-xs font-medium text-stone-600 mb-2">已有标签</p>
              <div className="flex flex-wrap gap-2">
                {documentLabels.map((label, idx) => (
                  <span 
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-stone-100 text-stone-700 rounded-md text-xs"
                  >
                    {label}
                    <button
                      onClick={() => setDocumentLabels(prev => prev.filter((_, i) => i !== idx))}
                      className="hover:text-red-600 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Input for new label */}
            <div className="mb-4">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && tagInput.trim() && !documentLabels.includes(tagInput.trim())) {
                    setDocumentLabels(prev => [...prev, tagInput.trim()]);
                    setTagInput('');
                  }
                }}
                className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:outline-none focus:border-stone-400 text-sm"
                placeholder="输入标签后按回车添加"
              />
            </div>

            {/* Historical tags */}
            <div className="mb-4">
              <p className="text-xs font-medium text-stone-600 mb-2">历史标签</p>
              <div className="flex flex-wrap gap-2">
                {usedTags
                  .filter(tag => !documentLabels.includes(tag))
                  .map((tag, idx) => (
                    <button
                      key={idx}
                      onClick={() => setDocumentLabels(prev => [...prev, tag])}
                      className="px-2.5 py-1 bg-white border border-stone-200 text-stone-600 rounded-md text-xs hover:bg-stone-50 hover:border-stone-300 transition-colors"
                    >
                      {tag}
                    </button>
                  ))}
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setLabelModalOpen(false)}
                className="px-4 py-2 text-sm text-stone-600 hover:text-stone-900 transition-colors"
              >
                取消
              </button>
              <button
                onClick={() => {
                  setLabelModalOpen(false);
                  alert(`标签已更新：${documentLabels.join(', ')}`);
                }}
                className="px-4 py-2 bg-stone-900 text-white rounded-lg text-sm font-medium hover:bg-stone-800 transition-colors"
              >
                确认
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Agent Permission Modal */}
      {agentPermissionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setAgentPermissionModalOpen(false)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md"
          >
            <h2 className="text-lg font-semibold mb-4">Agent权限设置</h2>
            
            {/* Agent list with permissions */}
            <div className="space-y-3 mb-4">
              {agentPermissions.map((agent) => (
                <div key={agent.agentId} className="flex items-center justify-between p-3 border border-stone-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-medium text-stone-900">{agent.agentName}</span>
                  </div>
                  <select
                    value={agent.permission}
                    onChange={(e) => {
                      const newPermission = e.target.value as 'read' | 'edit';
                      setAgentPermissions(prev => 
                        prev.map(a => a.agentId === agent.agentId ? { ...a, permission: newPermission } : a)
                      );
                    }}
                    className="px-3 py-1.5 border border-stone-200 rounded-md text-sm focus:outline-none focus:border-stone-400"
                  >
                    <option value="read">仅读取</option>
                    <option value="edit">可编辑</option>
                  </select>
                </div>
              ))}
            </div>

            {/* Add Agent button */}
            <button
              onClick={() => {
                const newAgentId = `agent${agentPermissions.length + 1}`;
                const newAgentName = prompt('输入Agent名称：');
                if (newAgentName?.trim()) {
                  setAgentPermissions(prev => [...prev, { 
                    agentId: newAgentId, 
                    agentName: newAgentName.trim(), 
                    permission: 'read' 
                  }]);
                }
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed border-stone-300 text-stone-600 rounded-lg text-sm font-medium hover:border-stone-400 hover:text-stone-900 transition-colors"
            >
              <Plus className="w-4 h-4" />
              添加Agent
            </button>

            <div className="flex gap-3 justify-end mt-6">
              <button
                onClick={() => setAgentPermissionModalOpen(false)}
                className="px-4 py-2 text-sm text-stone-600 hover:text-stone-900 transition-colors"
              >
                取消
              </button>
              <button
                onClick={() => {
                  setAgentPermissionModalOpen(false);
                  alert('Agent权限已更新');
                }}
                className="px-4 py-2 bg-stone-900 text-white rounded-lg text-sm font-medium hover:bg-stone-800 transition-colors"
              >
                确认
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
