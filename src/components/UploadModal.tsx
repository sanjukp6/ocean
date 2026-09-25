import React, { useRef, useState } from 'react';
import {
  X,
  UploadCloud,
  FileCheck,
  Cpu,
  Layers,
  HelpCircle,
  AlertTriangle,
  Play,
} from 'lucide-react';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmUpload: (file: File, params: { altitudeM: number; depthM: number }) => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onConfirmUpload,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [altitudeM, setAltitudeM] = useState<number>(5.5);
  const [depthM, setDepthM] = useState<number>(22.0);

  if (!isOpen) return null;

  const handleFileChange = (file: File) => {
    setSelectedFile(file);
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setPreviewUrl(e.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFile) {
      onConfirmUpload(selectedFile, { altitudeM, depthM });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-6 text-slate-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-sky-500/10 border border-sky-500/30 rounded-lg text-sky-400">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Upload Side Scan Sonar File</h3>
              <p className="text-xs text-slate-400">
                Support for .XTF / .JSF binary logs and geocoded waterfall imagery
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          
          {/* Drop area */}
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            onClick={() => fileInputRef.current?.click()}
            className="p-6 border-2 border-dashed border-slate-700 hover:border-sky-500 rounded-xl bg-slate-950/70 text-center cursor-pointer transition-all"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  handleFileChange(e.target.files[0]);
                }
              }}
              accept=".xtf,.jsf,.sl2,.png,.jpg,.jpeg,.tif,.tiff"
              className="hidden"
            />

            {selectedFile ? (
              <div className="space-y-2">
                <FileCheck className="w-8 h-8 mx-auto text-emerald-400" />
                <div className="text-xs font-semibold text-white">{selectedFile.name}</div>
                <div className="text-[11px] text-slate-400">
                  {(selectedFile.size / 1024).toFixed(1)} KB · Ready for preprocessing
                </div>
                {previewUrl && (
                  <div className="h-28 mx-auto rounded overflow-hidden border border-slate-700 mt-2 bg-black">
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <UploadCloud className="w-8 h-8 mx-auto text-sky-400" />
                <div className="text-xs font-medium text-slate-200">
                  Drag & Drop Sonar File or Click to Browse
                </div>
                <p className="text-[11px] text-slate-500">
                  Compatible with EdgeTech, Klein, Lowrance, Humminbird and SideScanSonarEditor formats
                </p>
              </div>
            )}
          </div>

          {/* Sonar Transducer Geometry Parameters */}
          <div className="grid grid-cols-2 gap-3 p-3 bg-slate-950/50 rounded-lg border border-slate-800 text-xs">
            <div>
              <label className="text-slate-400 block mb-1">Towfish Altitude (Ha)</label>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  step="0.1"
                  min="1"
                  max="50"
                  value={altitudeM}
                  onChange={(e) => setAltitudeM(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-200 font-mono focus:outline-none focus:border-sky-500"
                />
                <span className="text-slate-500 font-mono">meters</span>
              </div>
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Water Depth (Z)</label>
              <div className="flex items-center gap-1.5">
                <input
                  type="number"
                  step="0.1"
                  min="2"
                  max="1000"
                  value={depthM}
                  onChange={(e) => setDepthM(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-200 font-mono focus:outline-none focus:border-sky-500"
                />
                <span className="text-slate-500 font-mono">meters</span>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!selectedFile}
              className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                selectedFile
                  ? 'bg-sky-600 hover:bg-sky-500 text-white shadow-lg shadow-sky-600/20'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Ingest & Run Pipeline</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
