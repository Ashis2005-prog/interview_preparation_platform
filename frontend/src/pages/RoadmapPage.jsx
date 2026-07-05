import { useTheme } from '../context/ThemeContext'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { roadmapAPI } from '../utils/api'
import { Badge } from '../components/common/Badge'
import { CheckCircle2, Lock, BookOpen, Clock } from 'lucide-react'
import toast from 'react-hot-toast'

export default function RoadmapPage() {
  const { dark } = useTheme()
  const qc = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['roadmap'],
    queryFn: () => roadmapAPI.get()
  })

  const completeMutation = useMutation({
    mutationFn: (nodeId) => roadmapAPI.completeNode(nodeId),
    onSuccess: () => { qc.invalidateQueries(['roadmap']); toast.success('Node updated!') }
  })

  const roadmap   = data?.data || {}
  const byLevel   = roadmap.byLevel || {}
  const stats     = roadmap.stats   || {}

  // Fallback data if backend not connected
  const fallbackLevels = {
    0: [{ id:'basics',     label:'Programming Basics',    desc:'Variables, loops, functions', color:'#4ade80', completed:true,  unlocked:true,  estimatedHours:20 }],
    1: [{ id:'ds-arrays',  label:'Arrays & Strings',      desc:'Sliding window, two pointers',color:'#60a5fa', completed:false, unlocked:true,  estimatedHours:15 },
        { id:'ds-linked',  label:'Linked Lists',          desc:'Singly, doubly, circular',    color:'#60a5fa', completed:false, unlocked:true,  estimatedHours:10 }],
    2: [{ id:'ds-stack',   label:'Stacks & Queues',       desc:'LIFO/FIFO operations',        color:'#a78bfa', completed:false, unlocked:false, estimatedHours:8  },
        { id:'algo-sort',  label:'Sorting Algorithms',    desc:'Quick, merge, heap sort',      color:'#fb923c', completed:false, unlocked:false, estimatedHours:8  },
        { id:'algo-search',label:'Binary Search',         desc:'Search on sorted arrays',      color:'#fb923c', completed:false, unlocked:false, estimatedHours:10 }],
    3: [{ id:'ds-tree',    label:'Trees & BST',           desc:'Traversals, BST ops',          color:'#a78bfa', completed:false, unlocked:false, estimatedHours:15 },
        { id:'ds-heap',    label:'Heaps & Priority Queue',desc:'Min/Max heap',                  color:'#f472b6', completed:false, unlocked:false, estimatedHours:10 },
        { id:'ds-graph',   label:'Graphs',                desc:'BFS, DFS, shortest paths',     color:'#f472b6', completed:false, unlocked:false, estimatedHours:20 },
        { id:'ds-trie',    label:'Trie',                  desc:'Prefix trees, autocomplete',   color:'#f472b6', completed:false, unlocked:false, estimatedHours:8  }],
    4: [{ id:'algo-dp',    label:'Dynamic Programming',   desc:'Memoization, tabulation',      color:'#facc15', completed:false, unlocked:false, estimatedHours:30 },
        { id:'algo-greedy',label:'Greedy Algorithms',     desc:'Interval scheduling',          color:'#facc15', completed:false, unlocked:false, estimatedHours:12 },
        { id:'backtrack',  label:'Backtracking',          desc:'N-queens, permutations',       color:'#facc15', completed:false, unlocked:false, estimatedHours:12 }],
    5: [{ id:'system-design',label:'System Design',       desc:'Scalability, databases',       color:'#34d399', completed:false, unlocked:false, estimatedHours:40 },
        { id:'behavioral',  label:'Behavioral',           desc:'STAR method, leadership',      color:'#38bdf8', completed:false, unlocked:false, estimatedHours:10 }],
  }

  const levels = Object.keys(byLevel).length ? byLevel : fallbackLevels
  const totalNodes     = stats.total        || 15
  const completedCount = stats.completed    || 1
  const totalHours     = stats.totalHours   || 183
  const completedHours = stats.completedHours || 20

  const card = `rounded-xl border ${dark?'bg-[#1a1d27] border-[#2e3148]':'bg-white border-[#dde1f0]'} shadow-sm`

  return (
    <div>
      <h2 className="text-2xl font-black mb-1">Learning Roadmap</h2>
      <p className={`text-sm mb-5 ${dark?'text-[#8b8fa8]':'text-[#6b6f8a]'}`}>
        Graph DAG with topological sort — complete prerequisites to unlock next topics
      </p>

      {/* Summary bar */}
      <div className="flex flex-wrap gap-3 mb-8">
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#ede9ff] dark:bg-[#312e6b] text-[#6c63ff] text-sm font-semibold">
          <CheckCircle2 size={14} /> {completedCount}/{totalNodes} Completed
        </div>
        <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${dark?'bg-[#242736] text-[#8b8fa8]':'bg-[#f0f2f9] text-[#6b6f8a]'}`}>
          <Clock size={14} /> {completedHours}/{totalHours}h Studied
        </div>
        <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm ${dark?'bg-[#242736] text-[#8b8fa8]':'bg-[#f0f2f9] text-[#6b6f8a]'}`}>
          Graph-based · Topological Sort (Kahn's BFS)
        </div>
      </div>

      {/* Levels */}
      {Object.entries(levels).sort(([a],[b])=>+a-+b).map(([lvl, nodes]) => (
        <div key={lvl} className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className={`h-px flex-1 ${dark?'bg-[#2e3148]':'bg-[#dde1f0]'}`} />
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${dark?'bg-[#242736] text-[#8b8fa8]':'bg-[#f0f2f9] text-[#6b6f8a]'}`}>
              LEVEL {lvl}
            </span>
            <div className={`h-px flex-1 ${dark?'bg-[#2e3148]':'bg-[#dde1f0]'}`} />
          </div>

          <div className="flex flex-wrap gap-3 justify-center">
            {(Array.isArray(nodes)?nodes:Object.values(nodes)).map(node => (
              <div key={node.id} onClick={() => node.unlocked && completeMutation.mutate(node.id)}
                className={`w-44 p-4 rounded-xl border-2 transition-all duration-200 ${
                  node.completed
                    ? 'shadow-lg'
                    : node.unlocked
                      ? dark?'bg-[#1a1d27] border-[#2e3148] hover:border-[#6c63ff] hover:-translate-y-0.5 cursor-pointer':'bg-white border-[#dde1f0] hover:border-[#6c63ff] hover:-translate-y-0.5 cursor-pointer'
                      : `cursor-not-allowed opacity-40 ${dark?'bg-[#1a1d27] border-[#2e3148]':'bg-white border-[#dde1f0]'}`
                }`}
                style={node.completed ? { background: node.color+'15', borderColor: node.color, boxShadow: `0 4px 20px ${node.color}25` } : {}}>
                <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3 text-lg"
                  style={{ background: node.color+'25' }}>
                  {node.completed ? '✅' : node.unlocked ? <BookOpen size={16} style={{ color: node.color }} /> : <Lock size={14} style={{ color: node.color }} />}
                </div>
                <div className="text-xs font-bold leading-tight mb-1">{node.label}</div>
                <div className={`text-[11px] mb-2 leading-tight ${dark?'text-[#8b8fa8]':'text-[#6b6f8a]'}`}>{node.desc}</div>
                <div className="flex items-center gap-1">
                  <Clock size={10} className={dark?'text-[#8b8fa8]':'text-[#6b6f8a]'} />
                  <span className={`text-[10px] ${dark?'text-[#8b8fa8]':'text-[#6b6f8a]'}`}>{node.estimatedHours}h</span>
                  {node.completed && <Badge text="Done" color="green" />}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
