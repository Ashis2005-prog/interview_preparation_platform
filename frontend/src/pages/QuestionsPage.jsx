import { useState, useEffect, useMemo, useRef } from 'react'
import { useTheme } from '../context/ThemeContext'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { questionsAPI } from '../utils/api'
import { DiffBadge, Badge } from '../components/common/Badge'
import { Search, X, Star, CheckSquare, Square, Filter } from 'lucide-react'
import toast from 'react-hot-toast'

// ── Trie (client-side) ──────────────────────────────────────
class TrieNode { constructor(){this.children={};this.isEnd=false;this.items=[]} }
class Trie {
  constructor(){this.root=new TrieNode()}
  insert(word,item){
    let n=this.root
    for(const c of word.toLowerCase()){if(!n.children[c])n.children[c]=new TrieNode();n=n.children[c]}
    n.isEnd=true
    const id=item._id||item.id
    if(!n.items.find(i=>(i._id||i.id)===id))n.items.push(item)
  }
  search(prefix,limit=8){
    let n=this.root
    for(const c of prefix.toLowerCase()){if(!n.children[c])return[];n=n.children[c]}
    const res=[];this._dfs(n,res,limit);return res
  }
  _dfs(n,res,limit){
    if(res.length>=limit)return
    if(n.isEnd)for(const i of n.items){if(res.length>=limit)break;res.push(i)}
    for(const c of Object.values(n.children)){if(res.length>=limit)break;this._dfs(c,res,limit)}
  }
}

export default function QuestionsPage() {
  const { dark } = useTheme()
  const qc = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['questions'],
    queryFn: () => questionsAPI.getAll({ limit: 100 })
  })
  const questions = data?.data?.questions || []

  const trie = useMemo(() => {
    const t = new Trie()
    for (const q of questions) {
      t.insert(q.title, q)
      t.insert(q.category, q)
      for (const tag of (q.tags||[])) t.insert(tag, q)
    }
    return t
  }, [questions])

  const [search, setSearch]       = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [showSug, setShowSug]     = useState(false)
  const [filters, setFilters]     = useState({ difficulty:'All', status:'All', category:'All' })
  const searchRef = useRef()

  const handleSearch = (val) => {
    setSearch(val)
    if (val.length > 1) {
      const raw = trie.search(val, 10)
      const uniq = [...new Map(raw.map(r => [(r._id||r.id), r])).values()].slice(0,6)
      setSuggestions(uniq)
      setShowSug(true)
    } else { setSuggestions([]); setShowSug(false) }
  }

  const solveMutation = useMutation({
    mutationFn: (id) => questionsAPI.solve(id),
    onSuccess: () => { qc.invalidateQueries(['questions']); qc.invalidateQueries(['stats']) }
  })
  const starMutation = useMutation({
    mutationFn: (id) => questionsAPI.star(id),
    onSuccess: () => qc.invalidateQueries(['questions'])
  })

  const filtered = questions.filter(q => {
    const s = search.toLowerCase()
    const matchSearch = !s || q.title.toLowerCase().includes(s) || q.category.toLowerCase().includes(s) || (q.tags||[]).some(t=>t.includes(s))
    const matchDiff   = filters.difficulty === 'All' || q.difficulty === filters.difficulty
    const matchStatus = filters.status === 'All'
      || (filters.status==='Solved' && q.solved)
      || (filters.status==='Unsolved' && !q.solved)
      || (filters.status==='Starred' && q.starred)
    const matchCat    = filters.category === 'All' || q.category === filters.category
    return matchSearch && matchDiff && matchStatus && matchCat
  })

  const categories = ['All', ...new Set(questions.map(q=>q.category))]
  const card = `rounded-xl border ${dark?'bg-[#1a1d27] border-[#2e3148]':'bg-white border-[#dde1f0]'}`
  const sel  = `px-3 py-2 rounded-lg border text-sm outline-none cursor-pointer font-[Outfit] ${dark?'bg-[#242736] border-[#2e3148] text-[#e8eaf6]':'bg-white border-[#dde1f0] text-[#1a1c2e]'}`

  return (
    <div>
      <h2 className="text-2xl font-black mb-6">Problem Set</h2>

      {/* Search */}
      <div className="relative mb-4" ref={searchRef}>
        <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-sm ${dark?'bg-[#1a1d27] border-[#2e3148]':'bg-white border-[#dde1f0]'}`}>
          <Search size={18} className={dark?'text-[#8b8fa8]':'text-[#6b6f8a]'} />
          <input value={search} onChange={e=>handleSearch(e.target.value)}
            onFocus={()=>suggestions.length&&setShowSug(true)}
            placeholder="Trie-powered: search by name, tag, or category..."
            className="flex-1 bg-transparent outline-none text-sm" style={{color:dark?'#e8eaf6':'#1a1c2e'}} />
          {search && <button onClick={()=>{setSearch('');setSuggestions([]);setShowSug(false)}}><X size={16} className="text-[#8b8fa8]" /></button>}
        </div>
        {showSug && suggestions.length > 0 && (
          <div className={`absolute top-full left-0 right-0 mt-1 rounded-xl border shadow-xl z-50 overflow-hidden ${dark?'bg-[#1a1d27] border-[#2e3148]':'bg-white border-[#dde1f0]'}`}>
            {suggestions.map(s2 => (
              <div key={s2._id||s2.id} onClick={()=>{setSearch(s2.title);setShowSug(false)}}
                className={`flex justify-between items-center px-4 py-2.5 cursor-pointer text-sm transition-colors ${dark?'hover:bg-[#242736]':'hover:bg-[#f0f2f9]'}`}>
                <span>{s2.title}</span>
                <DiffBadge difficulty={s2.difficulty} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <select value={filters.difficulty} onChange={e=>setFilters({...filters,difficulty:e.target.value})} className={sel}>
          {['All','Easy','Medium','Hard'].map(o=><option key={o}>Difficulty: {o}</option>)}
        </select>
        <select value={filters.status} onChange={e=>setFilters({...filters,status:e.target.value})} className={sel}>
          {['All','Solved','Unsolved','Starred'].map(o=><option key={o}>Status: {o}</option>)}
        </select>
        <select value={filters.category} onChange={e=>setFilters({...filters,category:e.target.value})} className={sel}>
          {categories.map(c=><option key={c}>Category: {c}</option>)}
        </select>
        <div className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-sm ${dark?'border-[#2e3148] text-[#8b8fa8]':'border-[#dde1f0] text-[#6b6f8a]'}`}>
          <Filter size={13} /> {filtered.length} problems
        </div>
      </div>

      {/* Table */}
      <div className={`${card} overflow-hidden shadow-sm`}>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className={dark?'bg-[#242736]':'bg-[#f0f2f9]'}>
                {['✓','Title','Category','Difficulty','Company','Tags','★'].map(h=>(
                  <th key={h} className={`px-4 py-3 text-left text-xs font-bold ${dark?'text-[#8b8fa8]':'text-[#6b6f8a]'} whitespace-nowrap`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={7} className={`text-center py-12 text-sm ${dark?'text-[#8b8fa8]':'text-[#6b6f8a]'}`}>Loading problems...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={7} className={`text-center py-12 text-sm ${dark?'text-[#8b8fa8]':'text-[#6b6f8a]'}`}>No problems found</td></tr>
              ) : filtered.map(q => (
                <tr key={q._id||q.id} className={`border-t transition-colors ${dark?'border-[#2e3148] hover:bg-[#242736]':'border-[#f0f2f9] hover:bg-[#f8f9fe]'}`}>
                  <td className="px-4 py-3">
                    <button onClick={()=>solveMutation.mutate(q._id||q.id)}
                      className={`w-5 h-5 rounded flex items-center justify-center border-2 transition-all ${q.solved?'bg-[#22c55e] border-[#22c55e]':'border-[#6b6f8a]'}`}>
                      {q.solved && <span className="text-white text-[10px]">✓</span>}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold whitespace-nowrap">{q.title}</td>
                  <td className="px-4 py-3"><Badge text={q.category} color="blue" /></td>
                  <td className="px-4 py-3"><DiffBadge difficulty={q.difficulty} /></td>
                  <td className={`px-4 py-3 text-xs ${dark?'text-[#8b8fa8]':'text-[#6b6f8a]'}`}>{(q.companies||[]).slice(0,2).join(', ')}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1 flex-wrap">
                      {(q.tags||[]).slice(0,2).map(t=><Badge key={t} text={t} />)}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={()=>starMutation.mutate(q._id||q.id)} className={`transition-colors ${q.starred?'text-[#eab308]':dark?'text-[#4a4f6a] hover:text-[#eab308]':'text-[#c8cce0] hover:text-[#eab308]'}`}>
                      <Star size={16} fill={q.starred?'currentColor':'none'} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
