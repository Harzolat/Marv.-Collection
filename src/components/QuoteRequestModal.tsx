import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { QuoteProjectType, ColorOption, QuoteRequest } from '../types';
import { PINK_SHADES, FABRIC_OPTIONS, SILHOUETTE_OPTIONS } from '../data/products';
import { X, Scissors, Calculator, Check, Upload, ArrowRight, ShieldCheck, FileText, CheckCircle2 } from 'lucide-react';

interface QuoteRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuoteRequestModal: React.FC<QuoteRequestModalProps> = ({ isOpen, onClose }) => {
  const {
    formatPrice,
    submitQuote,
    quotePresetProduct,
    setIsQuoteTrackerOpen,
    currentUser,
  } = useShop();

  if (!isOpen) return null;

  // Form State
  const [projectType, setProjectType] = useState<QuoteProjectType>('bespoke_single');
  const [selectedSilhouette, setSelectedSilhouette] = useState(
    quotePresetProduct ? quotePresetProduct.name : SILHOUETTE_OPTIONS[0].name
  );
  const [selectedFabricId, setSelectedFabricId] = useState(FABRIC_OPTIONS[0].id);
  const [selectedPinkTone, setSelectedPinkTone] = useState<ColorOption>(PINK_SHADES[0]);
  const [customColorName, setCustomColorName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [timeline, setTimeline] = useState<'standard' | 'express' | 'flexible'>('standard');

  // Measurements
  const [unit, setUnit] = useState<'in' | 'cm'>('in');
  const [bust, setBust] = useState('');
  const [waist, setWaist] = useState('');
  const [hips, setHips] = useState('');
  const [height, setHeight] = useState('');
  const [standardSizeChoice, setStandardSizeChoice] = useState('Standard Size M');
  const [measureMethod, setMeasureMethod] = useState<'custom' | 'standard'>('custom');

  // Contact Info - auto prefill if logged in
  const [clientName, setClientName] = useState(currentUser?.name || '');
  const [clientEmail, setClientEmail] = useState(currentUser?.email || '');
  const [clientPhone, setClientPhone] = useState(currentUser?.phone || '');
  const [notes, setNotes] = useState('');

  // Sync if currentUser updates
  useEffect(() => {
    if (currentUser) {
      if (!clientName) setClientName(currentUser.name);
      if (!clientEmail) setClientEmail(currentUser.email);
      if (!clientPhone && currentUser.phone) setClientPhone(currentUser.phone);
    }
  }, [currentUser]);

  // Image Upload
  const [referenceImage, setReferenceImage] = useState<string | null>(null);
  const [imageFileName, setImageFileName] = useState<string | null>(null);

  // Success screen
  const [submittedQuote, setSubmittedQuote] = useState<QuoteRequest | null>(null);

  // When preset product changes
  useEffect(() => {
    if (quotePresetProduct) {
      setSelectedSilhouette(quotePresetProduct.name);
      if (quotePresetProduct.colors.length > 0) {
        setSelectedPinkTone(quotePresetProduct.colors[0]);
      }
    }
  }, [quotePresetProduct]);

  // Live price calculation
  const selectedSilhouetteObj = SILHOUETTE_OPTIONS.find((s) => s.name === selectedSilhouette) || SILHOUETTE_OPTIONS[0];
  const selectedFabric = FABRIC_OPTIONS.find((f) => f.id === selectedFabricId) || FABRIC_OPTIONS[0];
  
  const baseCostPerUnit = Math.round(selectedSilhouetteObj.basePrice * selectedFabric.multiplier);
  let discountMultiplier = 1.0;
  if (quantity >= 25) discountMultiplier = 0.75;
  else if (quantity >= 10) discountMultiplier = 0.82;
  else if (quantity >= 5) discountMultiplier = 0.90;

  const timelineMultiplier = timeline === 'express' ? 1.15 : 1.0;
  const estimatedTotal = Math.round(baseCostPerUnit * quantity * discountMultiplier * timelineMultiplier);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setReferenceImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientEmail) {
      alert('Please provide your name and email address so we can deliver your official bespoke quote.');
      return;
    }

    const newQuote = submitQuote({
      clientName,
      clientEmail,
      clientPhone,
      projectType,
      garmentSilhouette: selectedSilhouette,
      fabricType: selectedFabric.name,
      pinkTone: customColorName
        ? { name: customColorName, hex: '#F43F5E' }
        : selectedPinkTone,
      targetQuantity: quantity,
      estimatedBudget: estimatedTotal,
      measurements: measureMethod === 'custom' ? {
        bust: bust ? `${bust} ${unit}` : undefined,
        waist: waist ? `${waist} ${unit}` : undefined,
        hips: hips ? `${hips} ${unit}` : undefined,
        height: height ? `${height} ${unit}` : undefined,
        unit,
      } : {
        bust: standardSizeChoice,
        unit: 'in'
      },
      notes: notes + (quotePresetProduct ? ` (Referencing product: ${quotePresetProduct.name})` : ''),
      targetTimeline: timeline,
      referenceImageName: imageFileName || undefined,
      referenceImagePreview: referenceImage || undefined,
      relatedProductName: quotePresetProduct?.name,
    });

    setSubmittedQuote(newQuote);
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-gray-950/40 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative bg-white rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl border border-gray-100 max-h-[94vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
        id="bespoke-quote-modal"
      >
        {/* Header */}
        <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-pink-500 text-white flex items-center justify-center shadow-xs">
              <Scissors className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold tracking-tight text-gray-900">
                Atelier Bespoke & Bulk Quote Studio
              </h2>
              <p className="text-[11px] text-gray-400">
                Custom tailoring, noble fabrics & custom pink palette matching
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-900 transition-colors"
            aria-label="Close quote modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-6 sm:p-8 flex-1">
          {submittedQuote ? (
            /* Success confirmation screen */
            <div className="py-6 text-center space-y-6 animate-in zoom-in-95 duration-300">
              <div className="w-16 h-16 rounded-full bg-pink-50 text-pink-500 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-8 h-8 text-pink-500" />
              </div>

              <div>
                <span className="inline-block px-3 py-1 rounded-full bg-pink-50 text-pink-700 text-xs font-bold uppercase tracking-wider mb-2 border border-pink-200">
                  Quote Inquiry Registered • #{submittedQuote.id}
                </span>
                <h3 className="text-2xl font-bold tracking-tight text-gray-900 mb-2">
                  Your Bespoke Inquiry is with Our Master Tailor
                </h3>
                <p className="text-xs text-gray-500 max-w-md mx-auto leading-relaxed">
                  Thank you, <strong className="text-gray-900">{submittedQuote.clientName}</strong>. A detailed quotation summary and swatch confirmation have been logged under reference <strong className="text-pink-600 font-mono">{submittedQuote.id}</strong>.
                </p>
              </div>

              {/* Quote Overview Card */}
              <div className="bg-gray-50 rounded-xl p-5 border border-gray-200 text-left max-w-lg mx-auto text-xs space-y-2.5">
                <div className="flex justify-between border-b border-gray-200 pb-2 font-semibold text-gray-800">
                  <span>Garment Silhouette:</span>
                  <span className="text-pink-600 font-bold">{submittedQuote.garmentSilhouette}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Fabric Specification:</span>
                  <span className="font-medium text-gray-800">{submittedQuote.fabricType}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Selected Pink Tone:</span>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3.5 h-3.5 rounded-full border" style={{ backgroundColor: submittedQuote.pinkTone.hex }} />
                    <span className="font-medium text-gray-800">{submittedQuote.pinkTone.name}</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Units Requested:</span>
                  <span className="font-medium text-gray-800">{submittedQuote.targetQuantity} {submittedQuote.targetQuantity > 1 ? 'pieces' : 'piece'}</span>
                </div>
                <div className="flex justify-between border-t border-gray-200 pt-2 text-sm font-bold text-gray-900">
                  <span>Ballpark Estimate:</span>
                  <span className="text-pink-600 font-bold text-base">{formatPrice(submittedQuote.estimatedBudget)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => {
                    onClose();
                    setIsQuoteTrackerOpen(true);
                  }}
                  className="w-full sm:w-auto px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  <span>View in My Quote Tracker</span>
                </button>
                <button
                  onClick={() => {
                    setSubmittedQuote(null);
                    onClose();
                  }}
                  className="w-full sm:w-auto px-6 py-3 bg-pink-50 hover:bg-pink-100 text-pink-600 border border-pink-200 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  Back to Collection
                </button>
              </div>
            </div>
          ) : (
            /* Main Form */
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Step 1: Project Scope */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                  1. Scope of Inquiry
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'bespoke_single', title: 'Bespoke Piece', desc: '1 Made-to-measure' },
                    { id: 'bridal_event', title: 'Bridal & Gala', desc: 'Party matching sets' },
                    { id: 'bulk_batch', title: 'Bulk / Studio', desc: '5-200+ pieces' },
                    { id: 'custom_fabric', title: 'Color Custom', desc: 'Exact dye match' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setProjectType(item.id as QuoteProjectType)}
                      className={`p-3 rounded-xl text-left border transition-all ${
                        projectType === item.id
                          ? 'border-pink-500 bg-pink-50/70 text-gray-900 shadow-xs'
                          : 'border-gray-200 hover:border-pink-200 text-gray-600 bg-gray-50/50'
                      }`}
                    >
                      <div className="text-xs font-bold text-gray-900 mb-0.5">{item.title}</div>
                      <div className="text-[10px] text-gray-400">{item.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Silhouette & Fabric Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Silhouette */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                    2. Garment Silhouette
                  </label>
                  <select
                    value={selectedSilhouette}
                    onChange={(e) => setSelectedSilhouette(e.target.value)}
                    className="w-full text-xs bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-gray-800 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-200"
                  >
                    {SILHOUETTE_OPTIONS.map((s) => (
                      <option key={s.id} value={s.name}>
                        {s.name} (Base ~${s.basePrice})
                      </option>
                    ))}
                    {quotePresetProduct && (
                      <option value={quotePresetProduct.name}>
                        ★ {quotePresetProduct.name}
                      </option>
                    )}
                  </select>
                </div>

                {/* Fabric Selection */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                    3. Noble Fabric Choice
                  </label>
                  <select
                    value={selectedFabricId}
                    onChange={(e) => setSelectedFabricId(e.target.value)}
                    className="w-full text-xs bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-gray-800 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-200"
                  >
                    {FABRIC_OPTIONS.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.name} ({f.multiplier}x weight)
                      </option>
                    ))}
                  </select>
                  <p className="text-[10px] text-gray-400 mt-1">
                    {selectedFabric.desc}
                  </p>
                </div>
              </div>

              {/* Step 3: Pink Palette Shade Selection */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-700">
                    4. Signature Pink Palette Dye Choice
                  </label>
                  <span className="text-xs text-pink-600 font-bold">
                    {selectedPinkTone.name}
                  </span>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-2">
                  {PINK_SHADES.map((shade) => (
                    <button
                      key={shade.name}
                      type="button"
                      onClick={() => {
                        setSelectedPinkTone(shade);
                        setCustomColorName('');
                      }}
                      className={`p-2 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                        selectedPinkTone.name === shade.name && !customColorName
                          ? 'border-pink-500 ring-2 ring-pink-300 bg-pink-50/50'
                          : 'border-gray-200 hover:border-pink-200 bg-gray-50/30'
                      }`}
                    >
                      <span
                        className="w-6 h-6 rounded-full border border-gray-200 shadow-xs flex items-center justify-center"
                        style={{ backgroundColor: shade.hex }}
                      >
                        {selectedPinkTone.name === shade.name && !customColorName && (
                          <Check className="w-3 h-3 text-white drop-shadow-xs" />
                        )}
                      </span>
                      <span className="text-[10px] font-bold text-gray-700 text-center leading-tight">
                        {shade.name}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Optional Custom Pantone or HEX code */}
                <input
                  type="text"
                  placeholder="Or enter custom Pantone (e.g. Pantone 13-1404 TPX / Pale Dogwood)"
                  value={customColorName}
                  onChange={(e) => setCustomColorName(e.target.value)}
                  className="w-full text-xs bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-pink-500"
                />
              </div>

              {/* Step 4: Sizing & Custom Measurements */}
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-700">
                    5. Sizing & Precision Tailoring
                  </label>
                  <div className="flex gap-1 text-[11px]">
                    <button
                      type="button"
                      onClick={() => setMeasureMethod('custom')}
                      className={`px-2.5 py-1 rounded-md font-bold transition-colors ${
                        measureMethod === 'custom' ? 'bg-pink-500 text-white' : 'text-gray-500 hover:text-gray-800'
                      }`}
                    >
                      Made-to-Measure
                    </button>
                    <button
                      type="button"
                      onClick={() => setMeasureMethod('standard')}
                      className={`px-2.5 py-1 rounded-md font-bold transition-colors ${
                        measureMethod === 'standard' ? 'bg-pink-500 text-white' : 'text-gray-500 hover:text-gray-800'
                      }`}
                    >
                      Standard Sizing
                    </button>
                  </div>
                </div>

                {measureMethod === 'custom' ? (
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-gray-500 mb-2">
                      <span>Enter key body measurements (or leave blank to measure with tailor later):</span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setUnit('in')}
                          className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${unit === 'in' ? 'bg-gray-900 text-white' : 'text-gray-400'}`}
                        >
                          Inches
                        </button>
                        <button
                          type="button"
                          onClick={() => setUnit('cm')}
                          className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${unit === 'cm' ? 'bg-gray-900 text-white' : 'text-gray-400'}`}
                        >
                          Centimeters
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      <div>
                        <span className="text-[10px] text-gray-400 uppercase font-bold">Bust / Chest</span>
                        <input
                          type="text"
                          placeholder={unit === 'in' ? 'e.g. 34' : 'e.g. 86'}
                          value={bust}
                          onChange={(e) => setBust(e.target.value)}
                          className="w-full text-xs bg-white border border-gray-200 rounded-lg p-2 text-gray-800 focus:outline-none focus:border-pink-500"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-400 uppercase font-bold">Natural Waist</span>
                        <input
                          type="text"
                          placeholder={unit === 'in' ? 'e.g. 27' : 'e.g. 68'}
                          value={waist}
                          onChange={(e) => setWaist(e.target.value)}
                          className="w-full text-xs bg-white border border-gray-200 rounded-lg p-2 text-gray-800 focus:outline-none focus:border-pink-500"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-400 uppercase font-bold">Full Hips</span>
                        <input
                          type="text"
                          placeholder={unit === 'in' ? 'e.g. 37' : 'e.g. 94'}
                          value={hips}
                          onChange={(e) => setHips(e.target.value)}
                          className="w-full text-xs bg-white border border-gray-200 rounded-lg p-2 text-gray-800 focus:outline-none focus:border-pink-500"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-400 uppercase font-bold">Height</span>
                        <input
                          type="text"
                          placeholder={unit === 'in' ? 'e.g. 5\'8"' : 'e.g. 172'}
                          value={height}
                          onChange={(e) => setHeight(e.target.value)}
                          className="w-full text-xs bg-white border border-gray-200 rounded-lg p-2 text-gray-800 focus:outline-none focus:border-pink-500"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <select
                      value={standardSizeChoice}
                      onChange={(e) => setStandardSizeChoice(e.target.value)}
                      className="w-full text-xs bg-white border border-gray-200 rounded-lg p-2 text-gray-800"
                    >
                      <option value="Size XS (Bust 32 / Waist 25 / Hips 35)">Size XS (Bust 32 / Waist 25 / Hips 35)</option>
                      <option value="Size S (Bust 34 / Waist 27 / Hips 37)">Size S (Bust 34 / Waist 27 / Hips 37)</option>
                      <option value="Size M (Bust 36 / Waist 29 / Hips 39)">Size M (Bust 36 / Waist 29 / Hips 39)</option>
                      <option value="Size L (Bust 38 / Waist 31 / Hips 41)">Size L (Bust 38 / Waist 31 / Hips 41)</option>
                      <option value="Size XL (Bust 41 / Waist 34 / Hips 44)">Size XL (Bust 41 / Waist 34 / Hips 44)</option>
                    </select>
                  </div>
                )}
              </div>

              {/* Step 5: Quantity & Timeline */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Quantity */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-700">
                      6. Volume / Units
                    </label>
                    {quantity >= 5 && (
                      <span className="text-[10px] text-pink-700 font-bold px-2 py-0.5 bg-pink-50 rounded-full border border-pink-200">
                        {quantity >= 25 ? '25% Bulk Tier Applied' : quantity >= 10 ? '18% Bulk Tier Applied' : '10% Tier Applied'}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center border border-gray-200 rounded-xl bg-gray-50 p-1">
                      <button
                        type="button"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-8 h-8 flex items-center justify-center text-gray-700 hover:text-gray-900 rounded-lg hover:bg-white text-base font-bold"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min="1"
                        max="500"
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-12 text-center text-xs font-bold text-gray-900 bg-transparent focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center text-gray-700 hover:text-gray-900 rounded-lg hover:bg-white text-base font-bold"
                      >
                        +
                      </button>
                    </div>
                    <span className="text-xs text-gray-500">
                      {quantity === 1 ? 'Single bespoke garment' : `${quantity} pieces in collection`}
                    </span>
                  </div>
                </div>

                {/* Timeline */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                    7. Turnaround Timeline
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { id: 'standard', label: 'Standard', time: '3-4 wks' },
                      { id: 'express', label: 'Express', time: '10-14 days (+15%)' },
                      { id: 'flexible', label: 'Flexible', time: '5+ wks' },
                    ].map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setTimeline(t.id as any)}
                        className={`p-2 rounded-xl text-center border transition-all ${
                          timeline === t.id
                            ? 'border-pink-500 bg-pink-50/70 text-gray-900 font-bold'
                            : 'border-gray-200 text-gray-600 hover:border-pink-200'
                        }`}
                      >
                        <div className="text-xs">{t.label}</div>
                        <div className="text-[9px] text-gray-400">{t.time}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Dynamic Live Price Estimate Box */}
              <div className="p-4 bg-pink-50/70 rounded-xl border border-pink-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-pink-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Calculator className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-pink-700 tracking-wider">
                      Real-Time Ballpark Estimate
                    </span>
                    <div className="text-2xl font-bold text-pink-600 tracking-tight">
                      {formatPrice(estimatedTotal)}
                    </div>
                    <div className="text-[10px] text-gray-500">
                      {quantity > 1 ? `~${formatPrice(Math.round(estimatedTotal / quantity))} / piece • ` : ''}
                      Includes drafting, fabric sourcing & bespoke fittings
                    </div>
                  </div>
                </div>

                <div className="text-right text-[11px] text-gray-500 hidden sm:block">
                  <div>Base: {formatPrice(selectedSilhouetteObj.basePrice)}</div>
                  <div>Fabric Multiplier: {selectedFabric.multiplier}x</div>
                  {discountMultiplier < 1.0 && (
                    <div className="text-pink-600 font-bold">Tier Savings: -{Math.round((1 - discountMultiplier) * 100)}%</div>
                  )}
                </div>
              </div>

              {/* Step 6: Reference Moodboard / Sketch Upload */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1.5">
                  8. Reference Sketch or Moodboard Photo (Optional)
                </label>
                <div className="relative border-2 border-dashed border-pink-200 hover:border-pink-400 rounded-xl p-4 text-center transition-colors bg-pink-50/20">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  {referenceImage ? (
                    <div className="flex items-center justify-center gap-3">
                      <img
                        src={referenceImage}
                        alt="Reference preview"
                        className="w-12 h-12 object-cover rounded-lg border border-gray-200"
                      />
                      <div className="text-left text-xs">
                        <div className="font-bold text-gray-800">{imageFileName}</div>
                        <div className="text-[10px] text-pink-600">Attached successfully • Click to replace</div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center gap-1 text-xs text-gray-500">
                      <Upload className="w-5 h-5 text-pink-500 mb-1" />
                      <span>Drag & drop reference image or <strong className="text-pink-600 font-semibold underline">browse files</strong></span>
                      <span className="text-[10px] text-gray-400">JPG, PNG, WEBP up to 10MB</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Step 7: Client Contact Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Vivienne Vance"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full text-xs bg-white border border-gray-200 rounded-lg p-2.5 text-gray-800 focus:outline-none focus:border-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="vance@atelier.com"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    className="w-full text-xs bg-white border border-gray-200 rounded-lg p-2.5 text-gray-800 focus:outline-none focus:border-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Phone / WhatsApp (Optional)
                  </label>
                  <input
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    className="w-full text-xs bg-white border border-gray-200 rounded-lg p-2.5 text-gray-800 focus:outline-none focus:border-pink-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Atelier Project Notes & Special Requests
                </label>
                <textarea
                  rows={2}
                  placeholder="Specify particular event dates, button/hardware preferences, monogramming, lining silk, or questions..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full text-xs bg-white border border-gray-200 rounded-lg p-2.5 text-gray-800 focus:outline-none focus:border-pink-500"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
                  <ShieldCheck className="w-4 h-4 text-pink-500 shrink-0" />
                  <span>No payment required now • Tailor reviews within 24 hours</span>
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3.5 bg-pink-500 hover:bg-pink-600 text-white rounded-xl text-xs sm:text-sm font-bold tracking-widest uppercase flex items-center justify-center gap-2 transition-all duration-200"
                  id="submit-quote-request-btn"
                >
                  <FileText className="w-4 h-4" />
                  <span>Submit Bespoke Quote Request</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
