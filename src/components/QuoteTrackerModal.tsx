import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { QuoteRequest } from '../types';
import { X, Search, FileText, CheckCircle2, Scissors, Download } from 'lucide-react';

interface QuoteTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuoteTrackerModal: React.FC<QuoteTrackerModalProps> = ({ isOpen, onClose }) => {
  const { quotes, formatPrice, setIsQuoteModalOpen } = useShop();
  const [searchId, setSearchId] = useState('');
  const [selectedQuoteId, setSelectedQuoteId] = useState<string | null>(
    quotes.length > 0 ? quotes[0].id : null
  );

  if (!isOpen) return null;

  const filteredQuotes = quotes.filter((q) =>
    searchId.trim()
      ? q.id.toLowerCase().includes(searchId.toLowerCase()) ||
        q.clientName.toLowerCase().includes(searchId.toLowerCase()) ||
        q.garmentSilhouette.toLowerCase().includes(searchId.toLowerCase())
      : true
  );

  const currentQuote = quotes.find((q) => q.id === selectedQuoteId) || filteredQuotes[0];

  const getStatusStep = (status: QuoteRequest['status']): number => {
    switch (status) {
      case 'Under Review':
        return 1;
      case 'Material Sourcing':
        return 2;
      case 'Pattern Drafting':
        return 3;
      case 'Tailor Assigned':
        return 4;
      case 'Approved':
        return 5;
      default:
        return 1;
    }
  };

  const handleDownloadSummary = (quote: QuoteRequest) => {
    const textContent = `====================================================
ROSE CLOTHING ATELIER & BESPOKE STUDIO
QUOTE INQUIRY CONFIRMATION: #${quote.id}
Generated: ${new Date(quote.createdAt).toLocaleDateString()}
====================================================

CLIENT DETAILS:
- Client Name: ${quote.clientName}
- Email: ${quote.clientEmail}
- Phone: ${quote.clientPhone || 'N/A'}

SPECIFICATIONS:
- Garment Silhouette: ${quote.garmentSilhouette}
- Material / Fabric: ${quote.fabricType}
- Palette Shade: ${quote.pinkTone.name} (${quote.pinkTone.hex})
- Units Requested: ${quote.targetQuantity}
- Turnaround: ${quote.targetTimeline}

MEASUREMENTS:
${quote.measurements ? JSON.stringify(quote.measurements, null, 2) : 'Standard / To be verified in fitting'}

FINANCIAL ESTIMATE:
- Ballpark Total: ${formatPrice(quote.estimatedBudget)}
- Current Status: ${quote.status}

NOTES:
${quote.notes || 'None specified'}

Atelier Concierge: concierge@rose-atelier.com
====================================================`;

    const element = document.createElement('a');
    const file = new Blob([textContent], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `Rose-Atelier-Quote-${quote.id}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-gray-950/40 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative bg-white rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl border border-gray-100 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
        id="quote-tracker-modal"
      >
        {/* Header */}
        <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-pink-500 text-white flex items-center justify-center shadow-xs">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold tracking-tight text-gray-900">
                Bespoke Quote & Tailoring Tracker
              </h2>
              <p className="text-[11px] text-gray-400">
                Track status, fabric sourcing, and pattern progress for your custom inquiries
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                setIsQuoteModalOpen(true);
              }}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-pink-500 hover:bg-pink-600 text-white text-xs font-bold uppercase tracking-wider shadow-xs transition-colors"
            >
              <Scissors className="w-3 h-3" />
              <span>New Quote</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-900 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content area: Split list and detail */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Left Column: Quote List & Search */}
          <div className="w-full md:w-80 border-r border-gray-200 bg-gray-50 flex flex-col overflow-hidden">
            {/* Search Input */}
            <div className="p-3 border-b border-gray-200 bg-white">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by Quote ID or name..."
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-lg text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-pink-500"
                />
              </div>
            </div>

            {/* List */}
            <div className="overflow-y-auto flex-1 p-2 space-y-1.5">
              {filteredQuotes.length === 0 ? (
                <div className="p-6 text-center text-xs text-gray-400">
                  No quotes found matching your query.
                </div>
              ) : (
                filteredQuotes.map((q) => {
                  const isSelected = currentQuote?.id === q.id;
                  return (
                    <button
                      key={q.id}
                      onClick={() => setSelectedQuoteId(q.id)}
                      className={`w-full text-left p-3 rounded-xl border transition-all ${
                        isSelected
                          ? 'bg-white border-pink-400 shadow-xs ring-1 ring-pink-200'
                          : 'bg-white/70 border-gray-200 hover:bg-white text-gray-700'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <span className="font-mono font-bold text-pink-600">#{q.id}</span>
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-pink-50 text-pink-700 border border-pink-200">
                          {q.status}
                        </span>
                      </div>
                      <div className="text-xs font-bold text-gray-900 line-clamp-1">
                        {q.garmentSilhouette}
                      </div>
                      <div className="text-[10px] text-gray-400 flex items-center justify-between mt-1">
                        <span>{q.clientName}</span>
                        <span className="font-bold text-gray-700">{formatPrice(q.estimatedBudget)}</span>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column: Selected Quote Deep Dive */}
          <div className="flex-1 overflow-y-auto p-6 sm:p-8 bg-white flex flex-col justify-between">
            {currentQuote ? (
              <div className="space-y-6">
                {/* Header info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold text-pink-600 bg-pink-50 px-2 py-0.5 rounded-md border border-pink-100">
                        #{currentQuote.id}
                      </span>
                      <span className="text-xs text-gray-400">
                        Registered {new Date(currentQuote.createdAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold tracking-tight text-gray-900 mt-1">
                      {currentQuote.garmentSilhouette}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDownloadSummary(currentQuote)}
                      className="px-3 py-1.5 rounded-lg border border-gray-200 hover:border-pink-300 text-gray-700 hover:text-pink-600 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Summary</span>
                    </button>
                  </div>
                </div>

                {/* Interactive Status Pipeline */}
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="text-xs font-bold uppercase tracking-wider text-gray-600 mb-3 flex items-center justify-between">
                    <span>Atelier Progress Tracker</span>
                    <span className="text-pink-600 font-bold">{currentQuote.status}</span>
                  </div>

                  {/* Steps */}
                  <div className="relative flex items-center justify-between">
                    <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-gray-200 z-0" />
                    
                    {[
                      { step: 1, label: 'Review' },
                      { step: 2, label: 'Sourcing' },
                      { step: 3, label: 'Drafting' },
                      { step: 4, label: 'Tailor' },
                      { step: 5, label: 'Fitting' },
                    ].map((st) => {
                      const activeStep = getStatusStep(currentQuote.status);
                      const isPastOrCurrent = activeStep >= st.step;
                      return (
                        <div key={st.step} className="relative z-10 flex flex-col items-center">
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                              isPastOrCurrent
                                ? 'bg-pink-500 text-white shadow-xs'
                                : 'bg-white border-2 border-gray-300 text-gray-400'
                            }`}
                          >
                            {isPastOrCurrent ? <CheckCircle2 className="w-4 h-4" /> : st.step}
                          </div>
                          <span className="text-[10px] text-gray-500 font-medium mt-1">
                            {st.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  {/* Left Specs */}
                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-2">
                    <h4 className="font-bold text-gray-800 text-[11px] uppercase tracking-wider mb-2">
                      Garment & Fabric Blueprint
                    </h4>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Noble Fabric:</span>
                      <span className="font-medium text-gray-800">{currentQuote.fabricType}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500">Pink Tone:</span>
                      <div className="flex items-center gap-1.5">
                        <span className="w-3 h-3 rounded-full border border-gray-300" style={{ backgroundColor: currentQuote.pinkTone.hex }} />
                        <span className="font-medium text-gray-800">{currentQuote.pinkTone.name}</span>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Units:</span>
                      <span className="font-medium text-gray-800">{currentQuote.targetQuantity} units</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Timeline:</span>
                      <span className="font-medium text-gray-800 capitalize">{currentQuote.targetTimeline}</span>
                    </div>
                  </div>

                  {/* Right Client & Financial */}
                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-2">
                    <h4 className="font-bold text-gray-800 text-[11px] uppercase tracking-wider mb-2">
                      Client & Estimate
                    </h4>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Client Name:</span>
                      <span className="font-medium text-gray-800">{currentQuote.clientName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Email:</span>
                      <span className="font-medium text-gray-800">{currentQuote.clientEmail}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Estimated Total:</span>
                      <span className="font-bold text-pink-600 text-sm">{formatPrice(currentQuote.estimatedBudget)}</span>
                    </div>
                  </div>
                </div>

                {/* Measurements and Notes */}
                {currentQuote.measurements && (
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-xs">
                    <div className="font-bold text-gray-700 text-[11px] uppercase tracking-wider mb-1.5">
                      Submitted Tailoring Measurements
                    </div>
                    <div className="flex flex-wrap gap-4 text-gray-600">
                      {currentQuote.measurements.bust && <span>Bust: <strong>{currentQuote.measurements.bust}</strong></span>}
                      {currentQuote.measurements.waist && <span>Waist: <strong>{currentQuote.measurements.waist}</strong></span>}
                      {currentQuote.measurements.hips && <span>Hips: <strong>{currentQuote.measurements.hips}</strong></span>}
                      {currentQuote.measurements.height && <span>Height: <strong>{currentQuote.measurements.height}</strong></span>}
                      {currentQuote.measurements.inseam && <span>Inseam: <strong>{currentQuote.measurements.inseam}</strong></span>}
                    </div>
                  </div>
                )}

                {currentQuote.notes && (
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-xs">
                    <div className="font-bold text-gray-700 text-[11px] uppercase tracking-wider mb-1">
                      Project Notes
                    </div>
                    <p className="text-gray-600 italic leading-relaxed">
                      "{currentQuote.notes}"
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-gray-400">
                <FileText className="w-10 h-10 text-pink-300 mb-2" />
                <p>Select a quote on the left to track its progress.</p>
              </div>
            )}

            {/* Concierge Contact Footer */}
            <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 mt-4">
              <span>Questions? Call Atelier Concierge at <strong>+1 (800) 555-ROSE</strong></span>
              <span className="text-pink-600 font-bold">Live Mon–Sat 9am–6pm</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
