
import React from 'react';

export type ToolCategory = 
  | 'Compress'
  | 'Convert Hub'
  | 'Extract & Rewrite Hub'
  | 'Extract Hub'
  | 'Organize Hub'
  | 'View & Edit Hub'
  | 'Organize'
  | 'View & Edit'
  | 'Convert from PDF'
  | 'Convert to PDF'
  | 'e-Sign Hub'
  | 'Security Hub'
  | 'Scan';

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
}

export interface PDFTool {
  id: string;
  name: string;
  category: ToolCategory;
  icon: React.ReactNode;
  iconBgColor: string;
  isActive?: boolean;
  description?: string;
  functional?: boolean;
  isPro?: boolean;
}

export interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
  groundingChunks?: GroundingChunk[];
}

export interface ProcessingFile {
  id: string;
  file: File;
  base64: string;
  status: 'queued' | 'processing' | 'completed' | 'error';
  progress: number;
}

export interface TextBlock {
  id: string;
  type: 'text' | 'heading' | 'note' | 'highlight';
  x: number;
  y: number;
  content: string;
  fontSize: number;
  fontWeight: string;
  fontStyle: string;
  color: string;
  alignment: 'left' | 'center' | 'right';
  width?: number;
  height?: number;
  opacity?: number;
}

export type ViewType = 
  | 'dashboard' 
  | 'doc-editor' 
  | 'sheet-editor' 
  | 'slide-editor' 
  | 'editor' 
  | 'reader' 
  | 'library' 
  | 'vault'
  | 'smart-reader' 
  | 'settings' 
  | 'team'
  | 'history'
  | 'enterprise-admin' 
  | 'idm-studio'
  | 'api-node'
  | 'help-center'
  | 'documentation'
  | 'pricing'
  | 'esign'
  | 'compress'
  | 'extract'
  | 'converter'
  | 'compare'
  | 'quiz-studio'
  | 'translation-studio'
  | 'tone-studio'
  | 'organize-hub'
  | 'organize-studio'
  | 'view-edit-hub'
  | 'security-hub'
  | 'scanner-hub'
  | 'scanner-studio';

export interface WorkspaceTab {
  id: string;
  title: string;
  type: ViewType;
  fileData?: { file: File; base64: string };
  textContent?: string;
  tool?: PDFTool;
  initialBlocks?: TextBlock[];
  initialConfig?: any;
}
