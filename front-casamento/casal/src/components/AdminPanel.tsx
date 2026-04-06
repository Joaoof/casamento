import React, { useState, useEffect, useRef } from 'react';
import { Gift as GiftType } from '../types';
import GiftForm from './GiftForm';
import {
  PlusCircle, Download, Edit, Trash2, Settings,
  Package, BarChart3, X, List, Users, DollarSign,
  Activity, Heart, Gift, TrendingUp, Bell, Search, 
  RefreshCw, CheckCircle, Clock, Star, Percent,
} from 'lucide-react';
import { exportToPdf } from '../helpers/export.helper';

interface AdminSidebarProps {
  gifts: GiftType[];
  onAddGift: (gift: Omit<GiftType, 'id' | 'createdAt' | 'status'>) => void;
  onUpdateGift: (id: string, gift: Partial<GiftType>) => void;
  onDeleteGift: (id: string) => void;
  giftToEdit: GiftType | null;
  onCancelEdit: () => void;
}

type Tab = 'dashboard' | 'manage' | 'form' | 'analytics'

// ── Mini sparkline SVG ──────────────────────────────────────
const Sparkline: React.FC<{ values: number[]; color: string; height?: number }> = ({
  values, color, height = 32,
}) => {
  const w = 80, h = height
  const max = Math.max(...values, 1)
  const pts = values.map((v, i) => {
    const x = (i / (values.length - 1)) * w
    const y = h - (v / max) * h
    return `${x},${y}`
  }).join(' ')
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none" className="flex-shrink-0">
      <polyline points={pts} stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <polyline points={`0,${h} ${pts} ${w},${h}`} fill={color} opacity="0.12" stroke="none" />
    </svg>
  )
}

// ── Donut chart SVG ─────────────────────────────────────────
const DonutChart: React.FC<{ pct: number; color: string; size?: number }> = ({
  pct, color, size = 72,
}) => {
  const r = (size - 10) / 2
  const circ = 2 * Math.PI * r
  const dash = (pct / 100) * circ
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="flex-shrink-0">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={color} strokeWidth="8" strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round" transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: 'stroke-dasharray 1s ease' }} />
      <text x="50%" y="54%" textAnchor="middle" fill="white"
        fontSize="13" fontWeight="800" style={{ fontFamily: 'Poppins, sans-serif' }}>
        {Math.round(pct)}%
      </text>
    </svg>
  )
}

// ── Bar chart mini ──────────────────────────────────────────
const MiniBarChart: React.FC<{ data: { label: string; value: number; color: string }[] }> = ({ data }) => {
  const max = Math.max(...data.map(d => d.value), 1)
  return (
    <div className="flex items-end gap-1 h-16 w-full">
      {data.map(({ label, value, color }) => (
        <div key={label} className="flex flex-1 flex-col items-center gap-1 min-w-0">
          <div className="w-full rounded-t-sm transition-all duration-700"
            style={{ height: `${(value / max) * 52}px`, background: color, minHeight: 4 }} />
          <span className="text-[8px] truncate w-full text-center" style={{ color: 'rgba(200,220,240,0.5)' }}>{label}</span>
        </div>
      ))}
    </div>
  )
}

// ── Main Component ──────────────────────────────────────────
const AdminSidebar: React.FC<AdminSidebarProps> = ({
  gifts = [], onAddGift, onUpdateGift, onDeleteGift, giftToEdit, onCancelEdit,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<Tab>('dashboard')
  const [showExportMsg, setShowExportMsg] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'available' | 'reserved'>('all')
  const [sortBy, setSortBy] = useState<'name' | 'price'>('name')
  const [now, setNow] = useState(new Date())
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    tickRef.current = setInterval(() => setNow(new Date()), 1000)
    return () => { if (tickRef.current) clearInterval(tickRef.current) }
  }, [])

  const stats = {
    total: gifts.length,
    available: gifts.filter(g => g.status === 'available').length,
    reserved: gifts.filter(g => g.status === 'reserved').length,
    totalValue: gifts.reduce((s, g) => s + (g.price || 0), 0),
    avgPrice: gifts.length ? gifts.reduce((s, g) => s + (g.price || 0), 0) / gifts.length : 0,
    reservationRate: gifts.length
      ? (gifts.filter(g => g.status === 'reserved').length / gifts.length) * 100 : 0,
    topGift: gifts.length
      ? [...gifts].sort((a, b) => (b.price || 0) - (a.price || 0))[0] : null,
  }

  const filteredGifts = gifts
    .filter(g => g.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter(g => statusFilter === 'all' || g.status === statusFilter)
    .sort((a, b) => sortBy === 'price'
      ? (b.price || 0) - (a.price || 0)
      : a.name.localeCompare(b.name))

  const priceRanges = [
    { label: 'Jan', value: gifts.filter(g => (g.price || 0) < 100).length },
    { label: 'Fev', value: gifts.filter(g => (g.price || 0) >= 100 && (g.price || 0) < 200).length },
    { label: 'Mar', value: gifts.filter(g => (g.price || 0) >= 200 && (g.price || 0) < 300).length },
    { label: 'Abr', value: gifts.filter(g => (g.price || 0) >= 300 && (g.price || 0) < 400).length },
    { label: 'Mai', value: gifts.filter(g => (g.price || 0) >= 400 && (g.price || 0) < 500).length },
    { label: '500+', value: gifts.filter(g => (g.price || 0) >= 500).length },
  ]

  const sparkData = Array.from({ length: 8 }, (_, i) =>
    gifts.filter((_, j) => j % 8 === i).length || Math.floor(Math.random() * 3) + 1
  )

  const handleExport = async () => {
    if (!gifts.length) { alert('Nenhum presente para exportar'); return }
    setIsExporting(true)
    try {
      await exportToPdf(gifts)
      setShowExportMsg(true)
      setTimeout(() => setShowExportMsg(false), 3000)
    } finally { setIsExporting(false) }
  }

  const handleSubmit = async (giftData: Omit<GiftType, 'id' | 'createdAt' | 'status'>) => {
    await onAddGift(giftData)
    setActiveTab('manage')
  }

  const handleUpdate = async (id: string, gift: Partial<GiftType>) => {
    if (window.confirm('Atualizar este presente?')) await onUpdateGift(id, gift)
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Excluir este presente?')) onDeleteGift(id)
  }

  const NAV = [
    { id: 'dashboard' as Tab, label: 'Dashboard', icon: <BarChart3 size={16} />, badge: null },
    { id: 'analytics' as Tab, label: 'Analytics', icon: <Activity size={16} />, badge: null },
    { id: 'manage' as Tab, label: 'Gerenciar', icon: <List size={16} />, badge: stats.total > 0 ? String(stats.total) : null },
    { id: 'form' as Tab, label: 'Novo Item', icon: <PlusCircle size={16} />, badge: null },
  ]

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Lato:wght@300;400;700&family=Open+Sans:wght@300;400;500;600;700&family=Poppins:wght@300;400;500;600;700;800&display=swap');
        
        @keyframes slideAdmin { from { opacity:0; transform:translateX(100%) } to { opacity:1; transform:translateX(0) } }
        @keyframes fadeUp     { from { opacity:0; transform:translateY(10px) } to { opacity:1; transform:translateY(0) } }
        @keyframes pulseGlow  { 0%,100% { box-shadow:0 0 0 0 rgba(74,122,181,0.5) } 50% { box-shadow:0 0 0 8px rgba(74,122,181,0) } }
        
        .adm-font-base { font-family: 'Poppins', 'Inter', 'Open Sans', 'Lato', sans-serif; }
        .adm-panel     { animation: slideAdmin 0.3s cubic-bezier(0.34,1.1,0.64,1) both }
        .adm-fadeup    { animation: fadeUp 0.35s ease both }
        
        /* Ocultar barra de rolagem em abas mobile para visual clean */
        .hide-scroll::-webkit-scrollbar { display: none; }
        .hide-scroll { -ms-overflow-style: none; scrollbar-width: none; }
        
        /* Estilizar rolagem personalizada para a tabela/desktop */
        .custom-scroll::-webkit-scrollbar { width: 4px; height: 4px; }
        .custom-scroll::-webkit-scrollbar-track { background: transparent }
        .custom-scroll::-webkit-scrollbar-thumb { background: rgba(200,220,240,0.2); border-radius: 4px }
        
        .adm-fab { animation: pulseGlow 2.5s infinite }
      `}</style>

      {/* ── FAB (Botão flutuante para abrir) ── */}
      <div className="fixed right-4 bottom-6 md:top-1/2 md:-translate-y-1/2 z-40">
        <button onClick={() => setIsOpen(o => !o)}
          className="adm-fab group flex h-14 w-14 items-center justify-center rounded-full shadow-2xl text-white transition-all duration-300 hover:scale-110"
          style={{ background: 'linear-gradient(135deg,#1B3A6B,#4A7AB5)' }}>
          <Settings size={22} className="group-hover:rotate-90 transition-transform duration-500" />
          {stats.reserved > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-black text-white border-2 border-white"
              style={{ background: '#e07c3a' }}>{stats.reserved}</span>
          )}
        </button>
      </div>

      {/* ── Backdrop ── */}
      {isOpen && (
        <div className="fixed inset-0 z-50 transition-all duration-300 bg-black/60 backdrop-blur-sm"
          onClick={() => { setIsOpen(false); onCancelEdit() }} />
      )}

      {/* ── PAINEL PRINCIPAL ── */}
      {/* CRÍTICO: "inset-0 w-full" força o componente a ocupar 100vw e 100dvh no mobile.
          "md:inset-auto md:right-0 md:w-[900px]" restaura o visual de drawer no desktop.
      */}
      {isOpen && (
        <div className="adm-panel adm-font-base fixed z-[60] flex flex-col md:flex-row shadow-2xl bg-[#0b1628]
                        inset-0 w-full h-[100dvh] md:inset-auto md:right-0 md:top-0 md:w-[900px]">

          {/* ════ HEADER & NAVEGAÇÃO (Horizontal no Mobile, Vertical no Desktop) ════ */}
          <div className="flex flex-col flex-shrink-0 w-full md:w-[220px] md:h-full border-b md:border-b-0 md:border-r border-white/5 z-20 shadow-lg"
            style={{ background: 'linear-gradient(180deg,#080f24 0%,#0d1e3d 100%)' }}>

            {/* Logo / Fechar */}
            <div className="flex items-center justify-between px-4 py-3 md:py-6 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl shadow-lg flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg,#1B3A6B,#4A7AB5)' }}>
                  <Heart size={18} className="text-white" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-white tracking-wide truncate">Admin Panel</p>
                  <p className="text-[10px] uppercase tracking-wider text-white/50 truncate">Luís &amp; Vitoria</p>
                </div>
              </div>
              
              <button onClick={() => { setIsOpen(false); onCancelEdit() }}
                className="md:hidden flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-white/5 text-white/60 hover:bg-white/10 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Relógio (Apenas Desktop) */}
            <div className="hidden md:block px-5 py-4 text-center border-b border-white/5">
              <p className="text-xl font-bold tabular-nums" style={{ color: '#7AAFD4' }}>
                {now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </p>
              <p className="text-[10px] uppercase tracking-widest mt-1 text-white/40">
                {now.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' })}
              </p>
            </div>

            {/* Navegação */}
            <nav className="flex flex-row md:flex-col overflow-x-auto hide-scroll px-2 py-2 md:px-3 md:py-6 gap-2 md:gap-1 flex-shrink-0">
              <p className="hidden md:block px-3 mb-2 text-[10px] font-bold uppercase tracking-widest text-white/30">Menu</p>
              
              {NAV.map(item => (
                <button key={item.id} onClick={() => setActiveTab(item.id)}
                  className="flex-shrink-0 flex items-center gap-2 md:gap-3 rounded-xl px-3 py-2.5 md:px-4 md:py-3.5 text-left transition-all duration-200 border border-transparent"
                  style={{
                    background: activeTab === item.id ? 'rgba(74,122,181,0.15)' : 'transparent',
                    borderColor: activeTab === item.id ? 'rgba(74,122,181,0.3)' : 'transparent',
                    color: activeTab === item.id ? '#ffffff' : 'rgba(255,255,255,0.6)',
                  }}>
                  <div className={activeTab === item.id ? 'text-[#7AAFD4]' : 'text-white/50'}>
                    {item.icon}
                  </div>
                  <span className="text-xs md:text-sm font-medium whitespace-nowrap">{item.label}</span>
                  {item.badge && (
                    <span className="ml-1 md:ml-auto rounded-full px-2 py-0.5 text-[10px] font-bold bg-[#4A7AB5]/30 text-[#7AAFD4]">
                      {item.badge}
                    </span>
                  )}
                </button>
              ))}

              <div className="hidden md:block md:mt-auto pt-6 border-t border-white/5">
                <button onClick={handleExport} disabled={isExporting}
                  className="w-full flex items-center gap-3 rounded-xl px-4 py-3 text-left transition-all hover:bg-white/5 text-white/60 hover:text-white">
                  {isExporting ? <RefreshCw size={16} className="animate-spin" /> : <Download size={16} />}
                  <span className="text-sm font-medium">{isExporting ? 'Gerando...' : 'Exportar PDF'}</span>
                </button>
              </div>
            </nav>
          </div>

          {/* ════ ÁREA DE CONTEÚDO PRINCIPAL ════ */}
          {/* min-w-0 é obrigatório aqui para o Flexbox não estourar a tela no mobile */}
          <div className="flex flex-col flex-1 min-w-0 min-h-0 relative">

            {/* Topbar Secundária (Desktop e Tablet) */}
            <div className="hidden md:flex flex-shrink-0 items-center justify-between px-6 py-4 bg-white/5 border-b border-white/5 backdrop-blur-md">
              <div>
                <h2 className="text-lg font-semibold text-white tracking-wide">
                  {activeTab === 'dashboard' && 'Dashboard Overview'}
                  {activeTab === 'analytics' && 'Analytics Detalhado'}
                  {activeTab === 'manage' && 'Gerenciamento de Presentes'}
                  {activeTab === 'form' && (giftToEdit ? 'Editar Detalhes' : 'Cadastrar Novo')}
                </h2>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 rounded-full px-4 py-2 bg-black/20 border border-white/10">
                  <Bell size={16} className="text-white/40" />
                  {stats.reserved > 0 ? (
                    <span className="text-xs font-bold text-[#e07c3a]">{stats.reserved} Reservas</span>
                  ) : (
                    <span className="text-xs font-medium text-white/40">Atualizado</span>
                  )}
                </div>
                <button onClick={() => { setIsOpen(false); onCancelEdit() }}
                  className="rounded-full p-2.5 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all">
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* ════ SCROLL AREA (A Mágica da Responsividade Acontece Aqui) ════ */}
            <div className="flex-1 overflow-y-auto custom-scroll p-4 md:p-6 pb-6 md:pb-6">

              {/* ══ DASHBOARD ══ */}
              {activeTab === 'dashboard' && (
                <div className="space-y-4 md:space-y-6 adm-fadeup">
                  {/* KPI Cards: Grid de 2 colunas no celular */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
                    {[
                      { label: 'Total', value: stats.total, icon: <Package size={18} />, grad: 'linear-gradient(135deg,#1B3A6B,#3a6ea8)', spark: sparkData, sparkColor: '#7AAFD4' },
                      { label: 'Disponíveis', value: stats.available, icon: <CheckCircle size={18} />, grad: 'linear-gradient(135deg,#0e5c40,#1a9b6c)', spark: sparkData.map(v => v * 1.2 | 0), sparkColor: '#4ade80' },
                      { label: 'Reservados', value: stats.reserved, icon: <Star size={18} />, grad: 'linear-gradient(135deg,#7c2d12,#c0500e)', spark: sparkData.map(v => v * 0.8 | 0), sparkColor: '#fb923c' },
                      { label: 'Valor', value: `R$ ${stats.totalValue.toLocaleString('pt-BR')}`, icon: <DollarSign size={18} />, grad: 'linear-gradient(135deg,#4a1d96,#7c3aed)', spark: sparkData.map(v => v * 1.5 | 0), sparkColor: '#c084fc' },
                    ].map(({ label, value, icon, grad, spark, sparkColor }) => (
                      <div key={label} className="relative overflow-hidden rounded-2xl p-3 md:p-5 text-white shadow-lg flex flex-col justify-between h-full"
                        style={{ background: grad }}>
                        <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10 blur-xl pointer-events-none" />
                        <div className="flex items-start justify-between relative z-10 mb-2 md:mb-4">
                          <div className="bg-black/20 p-2 md:p-2.5 rounded-xl">{icon}</div>
                          <div className="hidden sm:block">
                            <Sparkline values={spark} color={sparkColor} height={28} />
                          </div>
                        </div>
                        <div className="relative z-10">
                          <p className="text-[10px] md:text-[11px] font-semibold uppercase tracking-wider text-white/70 mb-0.5">{label}</p>
                          <p className="text-xl md:text-2xl font-bold truncate">{value}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Gráficos */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-5">
                    <div className="rounded-2xl p-4 md:p-5 bg-white/[0.03] border border-white/5 flex flex-col items-center justify-center">
                      <p className="w-full text-sm font-semibold text-white/80 mb-4 md:mb-6 flex items-center gap-2">
                        <Percent size={16} className="text-[#7AAFD4]" /> Taxa de Reserva
                      </p>
                      <DonutChart pct={stats.reservationRate} color="#4A7AB5" size={120} />
                      <div className="flex w-full justify-around mt-4 md:mt-6 pt-4 border-t border-white/5">
                        <div className="text-center">
                          <p className="text-lg md:text-xl font-bold text-white">{stats.reserved}</p>
                          <p className="text-[9px] md:text-[10px] uppercase tracking-wider text-white/40">Reservados</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg md:text-xl font-bold text-white">{stats.available}</p>
                          <p className="text-[9px] md:text-[10px] uppercase tracking-wider text-white/40">Livres</p>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl p-4 md:p-5 bg-white/[0.03] border border-white/5 lg:col-span-2 overflow-hidden w-full">
                      <p className="text-sm font-semibold text-white/80 mb-4 md:mb-6 flex items-center gap-2">
                        <BarChart3 size={16} className="text-[#7AAFD4]" /> Faixa de Preço
                      </p>
                      <div className="w-full overflow-x-auto hide-scroll pb-2">
                        <div className="min-w-[300px]">
                          <MiniBarChart data={priceRanges.map((p, i) => ({
                            label: p.label, value: p.value, color: ['#4A7AB5', '#7AAFD4', '#1B3A6B', '#3a6ea8', '#5b8fca', '#2d5a9e'][i],
                          }))} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ══ ANALYTICS ══ */}
              {activeTab === 'analytics' && (
                <div className="space-y-4 md:space-y-5 adm-fadeup">
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                    {[
                      { label: 'Ticket Médio', value: `R$ ${stats.avgPrice.toFixed(0)}`, icon: <TrendingUp size={16} />, color: '#4A7AB5' },
                      { label: 'Engajamento', value: `${stats.reservationRate.toFixed(1)}%`, icon: <Activity size={16} />, color: '#4ade80' },
                      { label: 'VIP (> 500)', value: gifts.filter(g => (g.price || 0) >= 500).length, icon: <Star size={16} />, color: '#fb923c' },
                      { label: 'Total Itens', value: stats.total, icon: <Package size={16} />, color: '#c084fc' },
                    ].map(({ label, value, icon, color }) => (
                      <div key={label} className="rounded-2xl p-4 text-center bg-white/[0.03] border border-white/5">
                        <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-2xl"
                          style={{ background: `${color}15`, color }}>
                          {icon}
                        </div>
                        <p className="text-lg md:text-2xl font-bold text-white mb-0.5 truncate">{value}</p>
                        <p className="text-[9px] md:text-[11px] text-white/50 uppercase tracking-wide truncate">{label}</p>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-2xl p-4 md:p-6 bg-white/[0.03] border border-white/5">
                    <h4 className="text-sm font-semibold text-white mb-5">Distribuição Detalhada</h4>
                    <div className="space-y-4 md:space-y-5">
                      {[
                        { label: '< R$ 100', count: gifts.filter(g => (g.price || 0) < 100).length, color: '#4A7AB5' },
                        { label: 'R$ 100 – R$ 300', count: gifts.filter(g => (g.price || 0) >= 100 && (g.price || 0) < 300).length, color: '#7AAFD4' },
                        { label: 'R$ 300 – R$ 500', count: gifts.filter(g => (g.price || 0) >= 300 && (g.price || 0) < 500).length, color: '#7c3aed' },
                        { label: '> R$ 500', count: gifts.filter(g => (g.price || 0) >= 500).length, color: '#fb923c' },
                      ].map(({ label, count, color }) => (
                        <div key={label} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                          <span className="w-full sm:w-32 text-[11px] md:text-xs text-white/70">{label}</span>
                          <div className="flex-1 flex items-center gap-3">
                            <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden">
                              <div className="h-full rounded-full transition-all duration-1000"
                                style={{ width: `${stats.total > 0 ? (count / stats.total) * 100 : 0}%`, background: color }} />
                            </div>
                            <span className="w-8 text-right text-xs md:text-sm font-bold" style={{ color }}>{count}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ══ MANAGE (A Lista Responsiva) ══ */}
              {activeTab === 'manage' && (
                <div className="space-y-4 adm-fadeup flex flex-col h-full min-h-0">
                  
                  {/* Toolbar */}
                  <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
                    <div className="flex flex-1 items-center gap-3 rounded-xl px-4 py-2.5 bg-white/[0.04] border border-white/10">
                      <Search size={16} className="text-white/40 flex-shrink-0" />
                      <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                        placeholder="Buscar presente..."
                        className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/30 min-w-0" />
                    </div>
                    <div className="flex gap-2 sm:gap-3">
                      <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as any)}
                        className="flex-1 sm:flex-none rounded-xl px-3 py-2.5 text-xs sm:text-sm bg-[#121c30] border border-white/10 text-white/80 outline-none appearance-none min-w-0">
                        <option value="all">Status: Todos</option>
                        <option value="available">Status: Livres</option>
                        <option value="reserved">Status: Reservados</option>
                      </select>
                      <button onClick={() => setActiveTab('form')}
                        className="flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 transition-colors shadow-lg flex-shrink-0">
                        <PlusCircle size={16} /> <span className="hidden sm:inline">Novo</span>
                      </button>
                    </div>
                  </div>

                  {/* Tabela com Scroll Horizontal */}
                  <div className="flex-1 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col min-h-0">
                    <div className="overflow-x-auto custom-scroll w-full">
                      {/* O segredo: A tabela interna tem tamanho mínimo para nunca esmagar */}
                      <div className="min-w-[550px] w-full">
                        {/* Header Tabela */}
                        <div className="grid grid-cols-[1fr_90px_100px_90px] gap-4 px-4 md:px-6 py-3 md:py-4 bg-white/[0.02] border-b border-white/5">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Presente</span>
                          <span className="text-[10px] font-bold uppercase tracking-widest text-white/40 text-right">Preço</span>
                          <span className="text-[10px] font-bold uppercase tracking-widest text-white/40 text-center">Status</span>
                          <span className="text-[10px] font-bold uppercase tracking-widest text-white/40 text-center">Ações</span>
                        </div>
                        
                        {/* Linhas Tabela */}
                        <div className="divide-y divide-white/5">
                          {filteredGifts.length > 0 ? filteredGifts.map((gift) => (
                            <div key={gift.id} className="adm-row grid grid-cols-[1fr_90px_100px_90px] gap-4 px-4 md:px-6 py-3 md:py-4 items-center transition-colors">
                              <div className="flex items-center gap-3 min-w-0">
                                <div className="h-8 w-8 md:h-10 md:w-10 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                                  <Gift size={16} className="text-blue-400" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="truncate text-xs md:text-sm font-medium text-white/90">{gift.name}</p>
                                  {gift.reservedBy && (
                                    <p className="truncate text-[10px] md:text-[11px] text-white/40 mt-0.5">Por: {gift.reservedBy}</p>
                                  )}
                                </div>
                              </div>
                              <span className="text-xs md:text-sm font-bold text-[#7AAFD4] text-right truncate">
                                R$ {gift.price?.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
                              </span>
                              <div className="flex justify-center">
                                <span className={`px-2 md:px-3 py-1 rounded-full text-[9px] md:text-[10px] font-bold truncate ${
                                  gift.status === 'available' ? 'bg-green-500/20 text-green-400' : 'bg-orange-500/20 text-orange-400'
                                }`}>
                                  {gift.status === 'available' ? 'Livre' : 'Reservado'}
                                </span>
                              </div>
                              <div className="flex justify-center gap-1.5 md:gap-2">
                                <button onClick={() => handleUpdate(gift.id, gift)}
                                  className="p-1.5 md:p-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors">
                                  <Edit size={14} />
                                </button>
                                <button onClick={() => handleDelete(gift.id)}
                                  className="p-1.5 md:p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors">
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>
                          )) : (
                            <div className="py-12 md:py-20 text-center">
                              <Package size={40} className="mx-auto mb-3 text-white/10" />
                              <p className="text-xs md:text-sm text-white/40">Nenhum presente na lista.</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ══ FORM ══ */}
              {activeTab === 'form' && (
                <div className="adm-fadeup rounded-2xl bg-white/[0.02] border border-white/5 overflow-hidden">
                  <div className="px-4 sm:px-6 py-4 sm:py-6 border-b border-white/5">
                    <h4 className="text-base sm:text-lg font-bold text-white">
                      {giftToEdit ? 'Atualizar Dados do Presente' : 'Cadastrar Novo Presente'}
                    </h4>
                    <p className="text-xs sm:text-sm text-white/40 mt-1">
                      Preencha os dados abaixo.
                    </p>
                  </div>
                  <div className="p-4 sm:p-6">
                    <GiftForm
                      onSubmit={handleSubmit}
                      onCancel={() => { setActiveTab('manage'); onCancelEdit() }}
                      initialData={giftToEdit || {}}
                      isEdit={giftToEdit !== null}
                    />
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* ── Toast Mobile ── */}
      {showExportMsg && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-11/12 max-w-sm z-[80] flex items-center justify-center gap-3 rounded-xl px-5 py-3 text-white shadow-2xl bg-green-600/95 backdrop-blur-md">
          <CheckCircle size={18} />
          <p className="text-sm font-bold tracking-wide text-center">PDF Exportado com Sucesso!</p>
        </div>
      )}
    </>
  )
}

export default AdminSidebar