import React from 'react';
import { 
  FileBox, Sparkles, Layers, Edit3, FileText, Lock, Split, 
  Globe, Files, Database, FileSpreadsheet, Presentation, ImageIcon,
  Type, Scan as ScanIcon, Maximize2, Trash2, FileCheck, EyeOff,
  RotateCcw, Hash, Crop, ShieldAlert, Droplets, Share2,
  FileSearch, CheckSquare, Zap, Camera, Merge, LayoutGrid, 
  Scissors, Trash, FileUp, FileSignature, Unlock, StickyNote,
  Eye, ListOrdered, Eraser, FormInput, ExternalLink, GitCompare,
  Diff, ClipboardCheck, ShieldCheck, Signature, Handshake,
  MessageSquare
} from 'lucide-react';
import { PDFTool } from './types';

export const TOOLS: PDFTool[] = [
  // Compress
  { id: 'compress-pdf', name: 'Compress PDF', category: 'Compress', icon: <FileBox />, iconBgColor: 'bg-red-50 text-red-600', description: 'Shrink your PDF size' },
  
  // Convert Hub
  { id: 'pdf-converter', name: 'All-in-One Converter', category: 'Convert Hub', icon: <Files />, iconBgColor: 'bg-red-50 text-red-600', description: 'Convert to and from PDF' },
  { id: 'word-to-pdf', name: 'Word Node', category: 'Convert Hub', icon: <FileText />, iconBgColor: 'bg-blue-50 text-blue-600', description: 'DOCX to PDF' },
  { id: 'excel-to-pdf', name: 'Sheet Node', category: 'Convert Hub', icon: <FileSpreadsheet />, iconBgColor: 'bg-green-50 text-green-600', description: 'XLSX to PDF' },
  { id: 'ppt-to-pdf', name: 'Slide Node', category: 'Convert Hub', icon: <Presentation />, iconBgColor: 'bg-orange-50 text-orange-600', description: 'PPTX to PDF' },
  { id: 'pdf-ocr', name: 'Smart OCR', category: 'Convert Hub', icon: <ScanIcon />, iconBgColor: 'bg-red-500 text-white', description: 'Text recognition' },

  // Extract & Rewrite Hub
  { id: 'summarizer', name: 'AI Summarizer', category: 'Extract & Rewrite Hub', icon: <Database />, iconBgColor: 'bg-blue-600 text-white', description: 'Summaries and digests', functional: true },
  { id: 'tone-studio', name: 'Style Shifter', category: 'Extract & Rewrite Hub', icon: <Sparkles />, iconBgColor: 'bg-rose-600 text-white', description: 'Tone modulation', functional: true },
  { id: 'refine', name: 'Refinement Lab', category: 'Extract & Rewrite Hub', icon: <Edit3 />, iconBgColor: 'bg-teal-50 text-teal-600', description: 'Clarity and grammar', functional: true },

  // Extract Hub
  { id: 'ai-assistant', name: 'AI Assistant', category: 'Extract Hub', icon: <Zap />, iconBgColor: 'bg-blue-600 text-white', description: 'Data mapping', functional: true, isPro: true },
  { id: 'chat-pdf', name: 'Chat with PDF', category: 'Extract Hub', icon: <Sparkles />, iconBgColor: 'bg-blue-600 text-white', description: 'Chat with docs', functional: true },
  { id: 'question-solver', name: 'Exam Solver', category: 'Extract Hub', icon: <ClipboardCheck />, iconBgColor: 'bg-indigo-600 text-white', description: 'Step-by-step solutions', functional: true, isPro: true },
  { id: 'translate', name: 'Translate', category: 'Extract Hub', icon: <Globe />, iconBgColor: 'bg-blue-600 text-white', description: 'Multilingual conversion', functional: true },
  { id: 'q-gen', name: 'AI Quiz Maker', category: 'Extract Hub', icon: <FileSearch />, iconBgColor: 'bg-blue-600 text-white', description: 'Generate quizzes', functional: true },

  // Organize Hub
  { id: 'merge-pdf', name: 'Merge PDF', category: 'Organize Hub', icon: <Merge />, iconBgColor: 'bg-indigo-50 text-indigo-600', description: 'Combine multiple PDFs' },
  { id: 'split-pdf', name: 'Split PDF', category: 'Organize Hub', icon: <Scissors />, iconBgColor: 'bg-indigo-50 text-indigo-600', description: 'Extract pages' },
  { id: 'rotate-pdf', name: 'Rotate PDF', category: 'Organize Hub', icon: <RotateCcw />, iconBgColor: 'bg-indigo-50 text-indigo-600', description: 'Reorient pages' },
  { id: 'delete-pages', name: 'Delete Pages', category: 'Organize Hub', icon: <Trash />, iconBgColor: 'bg-indigo-50 text-indigo-600', description: 'Remove pages' },
  { id: 'extract-pages', name: 'Extract Pages', category: 'Organize Hub', icon: <FileUp />, iconBgColor: 'bg-indigo-50 text-indigo-600', description: 'Save specific pages' },
  { id: 'organize-pdf', name: 'Organize PDF', category: 'Organize Hub', icon: <LayoutGrid />, iconBgColor: 'bg-indigo-50 text-indigo-600', description: 'Reorder pages' },

  // View & Edit Hub
  { id: 'edit-pdf', name: 'Edit PDF', category: 'View & Edit Hub', icon: <Edit3 />, iconBgColor: 'bg-teal-50 text-teal-600', description: 'Modify text/images' },
  { id: 'annotator', name: 'Annotator', category: 'View & Edit Hub', icon: <StickyNote />, iconBgColor: 'bg-teal-50 text-teal-600', description: 'Markup content' },
  { id: 'reader', name: 'PDF Reader', category: 'View & Edit Hub', icon: <Eye />, iconBgColor: 'bg-teal-50 text-teal-600', description: 'View documents' },
  { id: 'compare-pdf', name: 'File Compare', category: 'View & Edit Hub', icon: <GitCompare />, iconBgColor: 'bg-purple-600 text-white', description: 'See differences', functional: true, isPro: true },
  { id: 'number-pages', name: 'Number Pages', category: 'View & Edit Hub', icon: <ListOrdered />, iconBgColor: 'bg-teal-50 text-teal-600', description: 'Add pagination' },
  { id: 'crop-pdf', name: 'Crop PDF', category: 'View & Edit Hub', icon: <Crop />, iconBgColor: 'bg-teal-50 text-teal-600', description: 'Adjust margins' },
  { id: 'redact-pdf', name: 'Redact PDF', category: 'View & Edit Hub', icon: <Eraser />, iconBgColor: 'bg-teal-50 text-teal-600', description: 'Hide sensitive info' },
  { id: 'watermark', name: 'Watermark PDF', category: 'View & Edit Hub', icon: <Droplets />, iconBgColor: 'bg-teal-50 text-teal-600', description: 'Add branding' },
  { id: 'form-filler', name: 'Form Filler', category: 'View & Edit Hub', icon: <FormInput />, iconBgColor: 'bg-teal-50 text-teal-600', description: 'Complete forms' },
  { id: 'share-pdf', name: 'Share PDF', category: 'View & Edit Hub', icon: <ExternalLink />, iconBgColor: 'bg-teal-50 text-teal-600', description: 'Send link' },

  // e-Sign Hub
  { id: 'sign-pdf', name: 'Sign PDF', category: 'e-Sign Hub', icon: <Signature />, iconBgColor: 'bg-pink-50 text-pink-600', description: 'Sign your documents' },
  { id: 'request-sigs', name: 'Request Signatures', category: 'e-Sign Hub', icon: <Handshake />, iconBgColor: 'bg-yellow-50 text-yellow-600', description: 'Collect signatures', isPro: true },

  // Security Hub
  { id: 'unlock-pdf', name: 'Unlock PDF', category: 'Security Hub', icon: <Unlock />, iconBgColor: 'bg-pink-50 text-pink-600', description: 'Remove password' },
  { id: 'protect-pdf', name: 'Protect PDF', category: 'Security Hub', icon: <Lock />, iconBgColor: 'bg-pink-50 text-pink-600', description: 'Add password' },
  { id: 'flatten-pdf', name: 'Flatten PDF', category: 'Security Hub', icon: <Layers />, iconBgColor: 'bg-pink-50 text-pink-600', description: 'Merge layers' },

  // Scan
  { id: 'pdf-scanner', name: 'PDF Scanner', category: 'Scan', icon: <Camera />, iconBgColor: 'bg-blue-700 text-white', description: 'Scan from mobile' },
];

export const CATEGORIES: { title: string; id: string }[] = [
  { title: 'Compress', id: 'Compress' },
  { title: 'Extract Hub', id: 'Extract Hub' },
  { title: 'Convert Hub', id: 'Convert Hub' },
  { title: 'Extract & Rewrite Hub', id: 'Extract & Rewrite Hub' },
  { title: 'Organize Hub', id: 'Organize Hub' },
  { title: 'View & Edit Hub', id: 'View & Edit Hub' },
  { title: 'e-Sign Hub', id: 'e-Sign Hub' },
  { title: 'Security Hub', id: 'Security Hub' },
  { title: 'Scan', id: 'Scan' },
];