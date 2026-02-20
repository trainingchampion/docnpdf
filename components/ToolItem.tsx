
import React, { useState } from 'react';
import { PDFTool } from '../types';
import { Zap, ChevronRight } from 'lucide-react';

interface ToolItemProps {
  tool: PDFTool;
  onClick: (tool: PDFTool) => void;
  viewMode?: 'grid' | 'list';
  themeColor?: string;
}

const ToolItem: React.FC<ToolItemProps> = ({ tool, onClick, viewMode = 'grid', themeColor = '#2F00FF' }) => {
  const [isHovered, setIsHovered] = useState(false);

  if (viewMode === 'list') {
    return (
      <div 
        onClick={() => onClick(tool)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={isHovered ? { borderColor: `${themeColor}40`, boxShadow: `0 10px 15px -3px ${themeColor}10` } : {}}
        className="group flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl cursor-pointer transition-all duration-300"
      >
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${tool.iconBgColor} group-hover:scale-105`}>
            {React.cloneElement(tool.icon as React.ReactElement<any>, { size: 20, strokeWidth: 2.5 })}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-[900] text-slate-900 transition-colors" style={isHovered ? { color: themeColor } : {}}>
                {tool.name}
              </span>
              {tool.isPro && <Zap size={12} className="text-amber-500 fill-amber-500" />}
            </div>
            <p className="text-[11px] font-medium text-slate-400 mt-0.5">{tool.description}</p>
          </div>
        </div>
        <ChevronRight size={18} className="text-slate-200 transition-all" style={isHovered ? { color: themeColor, transform: 'translateX(4px)' } : {}} />
      </div>
    );
  }

  return (
    <div 
      onClick={() => onClick(tool)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={isHovered ? { borderColor: `${themeColor}40`, boxShadow: `0 20px 25px -5px ${themeColor}10` } : {}}
      className="group flex flex-col items-center justify-center p-6 bg-white border border-slate-100 rounded-[2.5rem] cursor-pointer transition-all duration-300 text-center h-full"
    >
      <div className={`
        w-16 h-16 mb-4 rounded-2xl flex items-center justify-center transition-all duration-300
        ${tool.iconBgColor} group-hover:scale-110 shadow-sm
      `}>
        {React.cloneElement(tool.icon as React.ReactElement<any>, { size: 28, strokeWidth: 2.5 })}
      </div>
      
      <div className="w-full">
        <div className="flex items-center justify-center gap-1.5 mb-2">
          <span className="text-[13px] font-[1000] text-slate-900 transition-colors uppercase tracking-tight" style={isHovered ? { color: themeColor } : {}}>
            {tool.name}
          </span>
          {tool.isPro && (
            <Zap size={12} className="text-amber-500 fill-amber-500" />
          )}
        </div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest line-clamp-1 opacity-60">
          {tool.description?.split(' ').slice(0, 3).join(' ')}
        </p>
      </div>
    </div>
  );
};

export default ToolItem;
