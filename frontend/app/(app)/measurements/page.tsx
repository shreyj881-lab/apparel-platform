'use client';
import React, { useState, useRef } from 'react';
import { Ruler, User, Upload, FileText, Plus, Trash2, ChevronDown, ChevronUp, Loader2, X, CheckCircle, AlertCircle, MinusCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { AppShell } from '@/components/layout/AppShell';
import { useMannequins, useCreateMannequin, useDeleteMannequin, useSpecSheets, useDeleteSpecSheet, useAnalyzeImage } from '@/hooks/useMeasurements';
import { Mannequin } from '@/lib/measurements-api';

// ── Default mannequin data ───────────────────────────────────────────────────
const FEMALE_DEFAULT = {
  gender: 'female', name: 'Standard Female',
  measurements: {
    'HPS to Ankle Length': '142 cm', 'HPS to Full Length': '147 cm', 'HPS to Floor Length': '150 cm',
    'Chest Round': '86 cm', 'Waist Round': '68 cm', 'Hip Round': '94 cm',
    'Thigh at Crotch': '56 cm', 'Knee (33cm from crotch)': '35 cm',
    'Shoulder': '36 cm', 'Across Front': '32 cm', 'Across Back': '33.5 cm',
    'Full Arm Length': '60 cm', 'Bicep Round': '27 cm',
    'Neck Width': '34 cm', 'Inseam (Full Length)': '77 cm',
  },
};
const MALE_DEFAULT = {
  gender: 'male', name: 'Standard Male',
  measurements: {
    'HPS to Full Length': '154 cm', 'Chest Round': '100.5 cm',
    'Waist Round (Mid Waist)': '90 cm', 'Hip Round': '101.5 cm',
    'Thigh at Crotch': '61 cm', 'Knee (33cm from crotch)': '40 cm',
    'Shoulder': '44 cm', 'Across Front': '40 cm', 'Across Back': '42 cm',
    'Full Arm Length': '62 cm', 'Bicep Round': '35 cm',
    'Neck Width': '40 cm', 'Inseam (Full Length)': '80 cm',
  },
};

// ── Tabs ─────────────────────────────────────────────────────────────────────
type Tab = 'mannequins' | 'analyze' | 'specsheets';

// ── Confidence badge ─────────────────────────────────────────────────────────
function ConfidenceBadge({ level }: { level: string }) {
  if (level === 'High') return <span className="flex items-center gap-1 text-xs text-green-600"><CheckCircle className="h-3 w-3" /> High</span>;
  if (level === 'Medium') return <span className="flex items-center gap-1 text-xs text-yellow-600"><MinusCircle className="h-3 w-3" /> Medium</span>;
  return <span className="flex items-center gap-1 text-xs text-red-500"><AlertCircle className="h-3 w-3" /> Low</span>;
}

// ── Spec Sheet Detail Modal ───────────────────────────────────────────────────
function SpecSheetModal({ sheet, onClose }: { sheet: any; onClose: () => void }) {
  const measurements = sheet.productionMeasurements || {};
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div className="bg-card border border-border rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold">{sheet.title}</h2>
            <div className="flex gap-2 mt-1 flex-wrap">
              {sheet.garmentType && <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs">{sheet.garmentType}</span>}
              {sheet.gender && <span className="px-2 py-0.5 rounded-full bg-muted text-xs capitalize">{sheet.gender}</span>}
              {sheet.fitType && <span className="px-2 py-0.5 rounded-full bg-muted text-xs">{sheet.fitType}</span>}
              {sheet.fabricType && <span className="px-2 py-0.5 rounded-full bg-muted text-xs capitalize">{sheet.fabricType}</span>}
              {sheet.estimatedGsm && <span className="px-2 py-0.5 rounded-full bg-muted text-xs">{sheet.estimatedGsm} GSM</span>}
            </div>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded-lg"><X className="h-4 w-4" /></button>
        </div>

        {sheet.imageUrl && (
          <img src={sheet.imageUrl} alt="Inspiration" className="w-full max-h-48 object-contain rounded-xl border border-border mb-4 bg-muted" />
        )}

        {/* Production Measurements */}
        {Object.keys(measurements).length > 0 && (
          <div className="mb-4">
            <h3 className="font-semibold text-sm mb-2">Production Measurements</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="text-left p-2 font-medium rounded-tl-lg">Point</th>
                    <th className="text-left p-2 font-medium">Value</th>
                    <th className="text-left p-2 font-medium">Confidence</th>
                    <th className="text-left p-2 font-medium rounded-tr-lg">Note</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(measurements).map(([key, val]: any) => (
                    <tr key={key} className="border-t border-border">
                      <td className="p-2 font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</td>
                      <td className="p-2">{val?.value} {val?.unit}</td>
                      <td className="p-2"><ConfidenceBadge level={val?.confidence} /></td>
                      <td className="p-2 text-muted-foreground text-xs">{val?.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Ease */}
        {sheet.ease && Object.keys(sheet.ease).length > 0 && (
          <div className="mb-4">
            <h3 className="font-semibold text-sm mb-2">Ease Values (cm)</h3>
            <div className="grid grid-cols-4 gap-2">
              {Object.entries(sheet.ease).map(([k, v]: any) => (
                <div key={k} className="bg-muted rounded-lg p-2 text-center">
                  <p className="text-xs text-muted-foreground capitalize">{k}</p>
                  <p className="font-semibold">{v}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Notes */}
        <div className="grid grid-cols-1 gap-3">
          {sheet.constructionNotes && (
            <div className="bg-muted/40 rounded-xl p-3">
              <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Construction Notes</p>
              <p className="text-sm">{sheet.constructionNotes}</p>
            </div>
          )}
          {sheet.patternNotes && (
            <div className="bg-muted/40 rounded-xl p-3">
              <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Pattern Notes</p>
              <p className="text-sm">{sheet.patternNotes}</p>
            </div>
          )}
          {sheet.riskAreas && (
            <div className="bg-red-500/10 rounded-xl p-3">
              <p className="text-xs font-semibold text-red-600 uppercase mb-1">Risk Areas</p>
              <p className="text-sm">{sheet.riskAreas}</p>
            </div>
          )}
        </div>

        {sheet.confidenceScore && (
          <div className="mt-4 flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Overall Confidence:</span>
            <span className="font-bold text-primary">{sheet.confidenceScore}%</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function MeasurementsPage() {
  const [tab, setTab] = useState<Tab>('mannequins');

  // Mannequin state
  const { data: mannequins = [], isLoading: loadingMannequins } = useMannequins();
  const createMannequin = useCreateMannequin();
  const deleteMannequin = useDeleteMannequin();
  const [showAddMannequin, setShowAddMannequin] = useState(false);
  const [mannequinForm, setMannequinForm] = useState({ gender: 'female', name: '', measurements: '' });
  const [expandedMannequin, setExpandedMannequin] = useState<string | null>(null);

  // Analyze state
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedMannequin, setSelectedMannequin] = useState('');
  const [analysisTitle, setAnalysisTitle] = useState('');
  const analyzeImage = useAnalyzeImage();
  const fileRef = useRef<HTMLInputElement>(null);

  // Spec Sheets state
  const { data: specSheets = [], isLoading: loadingSheets } = useSpecSheets();
  const deleteSheet = useDeleteSpecSheet();
  const [viewingSheet, setViewingSheet] = useState<any>(null);

  // Seed default mannequins
  const seedDefaults = async () => {
    try {
      await createMannequin.mutateAsync({ ...FEMALE_DEFAULT, isDefault: true } as any);
      await createMannequin.mutateAsync({ ...MALE_DEFAULT, isDefault: true } as any);
      toast.success('Default mannequins loaded!');
    } catch (e: any) { toast.error(e.message); }
  };

  const handleAddMannequin = async () => {
    if (!mannequinForm.name) return toast.error('Enter a name');
    let measurements: any = {};
    try {
      if (mannequinForm.measurements.trim().startsWith('{')) {
        measurements = JSON.parse(mannequinForm.measurements);
      } else {
        mannequinForm.measurements.split('\n').forEach(line => {
          const [k, ...v] = line.split(':');
          if (k && v.length) measurements[k.trim()] = v.join(':').trim();
        });
      }
    } catch { toast.error('Invalid measurements format'); return; }
    await createMannequin.mutateAsync({ gender: mannequinForm.gender as any, name: mannequinForm.name, measurements, isDefault: false });
    setShowAddMannequin(false);
    setMannequinForm({ gender: 'female', name: '', measurements: '' });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setImageFile(f);
    setImagePreview(URL.createObjectURL(f));
    setAnalysisTitle(f.name.replace(/\.[^.]+$/, ''));
  };

  const handleAnalyze = async () => {
    if (!imageFile) return toast.error('Please upload an image first');
    await analyzeImage.mutateAsync({ file: imageFile, mannequinId: selectedMannequin || undefined, title: analysisTitle || undefined });
    setImageFile(null); setImagePreview(null); setAnalysisTitle('');
    setTab('specsheets');
  };

  const tabs: { id: Tab; label: string; icon: any }[] = [
    { id: 'mannequins', label: 'Mannequins', icon: User },
    { id: 'analyze', label: 'Analyze Image', icon: Upload },
    { id: 'specsheets', label: 'Spec Sheets', icon: FileText },
  ];

  return (
    <AppShell>
      <div className="p-6 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Ruler className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Measurements</h1>
            <p className="text-sm text-muted-foreground">AI-powered garment spec sheet generator</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-muted rounded-xl p-1 mb-6 w-fit">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setTab(id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === id ? 'bg-card shadow text-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
              <Icon className="h-4 w-4" />{label}
            </button>
          ))}
        </div>

        {/* ── MANNEQUINS TAB ─────────────────────────────────────────── */}
        {tab === 'mannequins' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-muted-foreground">{mannequins.length} mannequin{(mannequins.length !== 1) ? 's' : ''} stored</p>
              <div className="flex gap-2">
                {mannequins.length === 0 && (
                  <button onClick={seedDefaults} disabled={createMannequin.isPending}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border text-sm hover:bg-muted transition">
                    Load Defaults
                  </button>
                )}
                <button onClick={() => setShowAddMannequin(true)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm hover:bg-primary/90 transition">
                  <Plus className="h-4 w-4" /> Add Mannequin
                </button>
              </div>
            </div>

            {loadingMannequins ? (
              <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
            ) : mannequins.length === 0 ? (
              <div className="text-center py-16 border-2 border-dashed border-border rounded-2xl">
                <User className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground mb-4">No mannequins yet</p>
                <button onClick={seedDefaults} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm">
                  Load Default Mannequins
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {mannequins.map((m: Mannequin) => (
                  <div key={m.id} className="border border-border rounded-xl overflow-hidden">
                    <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/30 transition"
                      onClick={() => setExpandedMannequin(expandedMannequin === m.id ? null : m.id)}>
                      <div className="flex items-center gap-3">
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold ${m.gender === 'female' ? 'bg-pink-100 text-pink-700' : 'bg-blue-100 text-blue-700'}`}>
                          {m.gender === 'female' ? 'F' : 'M'}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{m.name}</p>
                          <p className="text-xs text-muted-foreground capitalize">{m.gender} · {Object.keys(m.measurements).length} measurements</p>
                        </div>
                        {m.isDefault && <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs">Default</span>}
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={e => { e.stopPropagation(); deleteMannequin.mutate(m.id); }}
                          className="p-1.5 rounded-lg hover:bg-red-100 text-muted-foreground hover:text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </button>
                        {expandedMannequin === m.id ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                      </div>
                    </div>
                    {expandedMannequin === m.id && (
                      <div className="border-t border-border p-4 bg-muted/20">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {Object.entries(m.measurements).map(([k, v]) => (
                            <div key={k} className="bg-card rounded-lg p-2">
                              <p className="text-xs text-muted-foreground">{k}</p>
                              <p className="font-medium text-sm">{String(v)}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {showAddMannequin && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
                <div className="bg-card border border-border rounded-2xl w-full max-w-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold">Add Mannequin</h3>
                    <button onClick={() => setShowAddMannequin(false)}><X className="h-4 w-4" /></button>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-medium text-muted-foreground">Gender</label>
                      <select value={mannequinForm.gender} onChange={e => setMannequinForm(p => ({ ...p, gender: e.target.value }))}
                        className="w-full mt-1 rounded-lg border border-border bg-background px-3 py-2 text-sm">
                        <option value="female">Female</option>
                        <option value="male">Male</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground">Name</label>
                      <input value={mannequinForm.name} onChange={e => setMannequinForm(p => ({ ...p, name: e.target.value }))}
                        placeholder="e.g. Standard Female S" className="w-full mt-1 rounded-lg border border-border bg-background px-3 py-2 text-sm" />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground">Measurements (one per line: Key: Value)</label>
                      <textarea value={mannequinForm.measurements} onChange={e => setMannequinForm(p => ({ ...p, measurements: e.target.value }))}
                        rows={8} placeholder={"Chest: 86cm\nWaist: 68cm\nHip: 94cm"}
                        className="w-full mt-1 rounded-lg border border-border bg-background px-3 py-2 text-sm font-mono" />
                    </div>
                    <button onClick={handleAddMannequin} disabled={createMannequin.isPending}
                      className="w-full py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition">
                      {createMannequin.isPending ? 'Saving...' : 'Save Mannequin'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── ANALYZE TAB ───────────────────────────────────────────── */}
        {tab === 'analyze' && (
          <div className="max-w-xl">
            <div className="space-y-4">
              {/* Image Upload */}
              <div>
                <label className="text-sm font-medium mb-2 block">Inspiration Image</label>
                {imagePreview ? (
                  <div className="relative rounded-xl border border-border overflow-hidden">
                    <img src={imagePreview} alt="Preview" className="w-full max-h-64 object-contain bg-muted" />
                    <button onClick={() => { setImageFile(null); setImagePreview(null); }}
                      className="absolute top-2 right-2 p-1 bg-black/60 rounded-full text-white hover:bg-black/80">
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ) : (
                  <div onClick={() => fileRef.current?.click()}
                    className="border-2 border-dashed border-border rounded-xl p-10 text-center cursor-pointer hover:bg-muted/30 transition">
                    <Upload className="h-8 w-8mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">Click to upload garment image</p>
                    <p className="text-xs text-muted-foreground mt-1">JPG, PNG, WEBP · max 10MB</p>
                  </div>
                )}
                <input ref={fileRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
              </div>

              {/* Title */}
              <div>
                <label className="text-sm font-medium mb-1 block">Title (optional)</label>
                <input value={analysisTitle} onChange={e => setAnalysisTitle(e.target.value)}
                  placeholder="e.g. Men's Oversized Hoodie" className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm" />
              </div>

              {/* Mannequin */}
              <div>
                <label className="text-sm font-medium mb-1 block">Reference Mannequin (optional but recommended)</label>
                <select value={selectedMannequin} onChange={e => setSelectedMannequin(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm">
                  <option value="">No reference mannequin</option>
                  {(mannequins as Mannequin[]).map((m: Mannequin) => (
                    <option key={m.id} value={m.id}>{m.name} ({m.gender})</option>
                  ))}
                </select>
                {mannequins.length === 0 && (
                  <p className="text-xs text-amber-600 mt-1">No mannequins yet — <button onClick={() => setTab('mannequins')} className="underline">add one first</button> for better accuracy.</p>
                )}
              </div>

              {/* Analyze Button */}
              <button onClick={handleAnalyze} disabled={!imageFile || analyzeImage.isPending}
                className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 disabled:opacity-50 transition flex items-center justify-center gap-2">
                {analyzeImage.isPending ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Analyzing... (this may take 30–60s)</>
                ) : (
                  <><Ruler className="h-4 w-4" /> Generate Spec Sheet</>
                )}
              </button>

              {analyzeImage.isPending && (
                <div className="bg-muted/40 rounded-xl p-4 text-sm text-muted-foreground text-center">
                  Gemini AI is analyzing the garment — checking silhouette, drape, seams, fabric weight...
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── SPEC SHEETS TAB ───────────────────────────────────────── */}
        {tab === 'specsheets' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-muted-foreground">{specSheets.length} spec sheet{specSheets.length !== 1 ? 's' : ''}</p>
              <button onClick={() => setTab('analyze')}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm">
                <Plus className="h-4 w-4" /> New Analysis
              </button>
            </div>

            {loadingSheets ? (
              <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
            ) : specSheets.length === 0 ? (
              <div className="text-center py-16 border-2 border-dashed border-border rounded-2xl">
                <FileText className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground mb-4">No spec sheets yet</p>
                <button onClick={() => setTab('analyze')} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm">
                  Analyze Your First Garment
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(specSheets as any[]).map((sheet: any) => (
                  <div key={sheet.id} className="border border-border rounded-xl overflow-hidden hover:border-primary/40 transition cursor-pointer group"
                    onClick={() => setViewingSheet(sheet)}>
                    {sheet.imageUrl && (
                      <img src={sheet.imageUrl} alt={sheet.title} className="w-full h-40 object-cover bg-muted" />
                    )}
                    <div className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{sheet.title}</p>
                          <div className="flex gap-1.5 mt-1 flex-wrap">
                            {sheet.garmentType && <span className="px-1.5 py-0.5 rounded bg-primary/10 text-primary text-xs">{sheet.garmentType}</span>}
                            {sheet.gender && <span className="px-1.5 py-0.5 rounded bg-muted text-xs capitalize">{sheet.gender}</span>}
                            {sheet.fitType && <span className="px-1.5 py-0.5 rounded bg-muted text-xs">{sheet.fitType}</span>}
                          </div>
                        </div>
                        <button onClick={e => { e.stopPropagation(); deleteSheet.mutate(sheet.id); }}
                          className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-100 text-muted-foreground hover:text-red-600 transition">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        {sheet.estimatedGsm && <span className="text-xs text-muted-foreground">{sheet.estimatedGsm} GSM</span>}
                        {sheet.confidenceScore && (
                          <span className="text-xs font-medium text-primary">{sheet.confidenceScore}% confidence</span>
                        )}
                        <span className="text-xs text-muted-foreground">{new Date(sheet.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {viewingSheet && <SpecSheetModal sheet={viewingSheet} onClose={() => setViewingSheet(null)} />}
    </AppShell>
  );
}
