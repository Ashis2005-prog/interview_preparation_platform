import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { useQuery } from '@tanstack/react-query'
import { questionsAPI, progressAPI } from '../utils/api'
import { ProgressBar, Badge } from '../components/common/Badge'
import { CheckCircle2, Flame, Star, Trophy, Zap } from 'lucide-react'

export default function DashboardPage() {
  const { user } = useAuth()
  const { dark }  = useTheme()

  const { data: qData } = useQuery({ queryKey: ['questions'], queryFn: () => questionsAPI.getAll({ limit: 100 }) })
  const { data: statsData } = useQuery({ queryKey: ['stats'], queryFn: () => progressAPI.getStats() })
  const { data: actData }   = useQuery({ queryKey: ['activity'], queryFn: () => progressAPI.getActivity() })
  const { data: recData }   = useQuery({ queryKey: ['recommendations'], queryFn: () => questionsAPI.recommendations() })

  const questions = qData?.data?.questions || []
  const stats     = statsData?.data || {}
  const activity  = actData?.data  || []
  const recs      = recData?.data  || []

  const totalQ    = questions.length
  const solved    = stats.totalSolved || 0
  const byDiff    = stats.byDifficulty || { Easy: 0, Medium: 0, Hard: 0 }
  const totalEasy = questions.filter(q => q.difficulty === 'Easy').length
  const totalMed  = questions.filter(q => q.difficulty === 'Medium').length
  const totalHard = questions.filter(q => q.difficulty === 'Hard').length

  const card = `rounded-xl border p-5 ${dark ? 'bg-[#1a1d27] border-[#2e3148]' : 'bg-white border-[#dde1f0]'} shadow-sm`

  const statCards = [
    { label: 'Problems Solved', value: solved, total: totalQ || 12, color: '#6c63ff', icon: CheckCircle2 },
    { label: 'Day Streak', value: stats.streak || 0, total: 30, color: '#f97316', icon: Flame },
    { label: 'Total Score', value: stats.score || 0, total: 2000, color: '#22c55e', icon: Trophy },
    { label: 'XP Earned', value: stats.xp || 0, total: 1000, color: '#eab308', icon: Zap },
  ]

  const maxAct = Math.max(...activity.map(a => a.count), 1)

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-black">Welcome back, <span className="text-[#6c63ff]">{user?.username}</span> 👋</h1>
        <p className={`mt-1 text-sm ${dark ? 'text-[#8b8fa8]' : 'text-[#6b6f8a]'}`}>Ready to ace your next interview?</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statCards.map(st => (
          <div key={st.label} className={card}>
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="text-3xl font-black">{st.value.toLocaleString()}</div>
                <div className={`text-xs mt-0.5 ${dark ? 'text-[#8b8fa8]' : 'text-[#6b6f8a]'}`}>{st.label}</div>
              </div>
              <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: st.color+'20' }}>
                <st.icon size={18} style={{ color: st.color }} />
              </div>
            </div>
            <ProgressBar value={st.value} max={st.total} color={st.color} />
            <div className={`text-xs mt-1.5 ${dark ? 'text-[#8b8fa8]' : 'text-[#6b6f8a]'}`}>{st.value} / {st.total}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Weekly Activity */}
        <div className={`${card} lg:col-span-2`}>
          <h3 className="font-bold mb-4">Weekly Activity</h3>
          <div className="flex items-end gap-2 h-24">
            {activity.map((a, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                <div className="w-full rounded-t transition-all hover:opacity-100" style={{ height: `${(a.count / maxAct) * 80}px`, minHeight: 4, background: i === activity.length - 1 ? '#6c63ff' : '#6c63ff60' }} title={`${a.count} solved`} />
                <span className={`text-[10px] ${dark ? 'text-[#8b8fa8]' : 'text-[#6b6f8a]'}`}>{a.day}</span>
              </div>
            ))}
            {activity.length === 0 && Array.from({length:7},(_,i)=>i).map(i => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                <div className="w-full rounded-t" style={{ height: `${[3,5,2,7,4,8,6][i]/8*80}px`, background: i===6?'#6c63ff':'#6c63ff60' }} />
                <span className={`text-[10px] ${dark ? 'text-[#8b8fa8]' : 'text-[#6b6f8a]'}`}>{['M','T','W','T','F','S','S'][i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Difficulty */}
        <div className={card}>
          <h3 className="font-bold mb-4">Difficulty Progress</h3>
          {[
            { label:'Easy',   solved: byDiff.Easy||0,   total: totalEasy||4, color:'#22c55e' },
            { label:'Medium', solved: byDiff.Medium||0, total: totalMed||6,  color:'#f97316' },
            { label:'Hard',   solved: byDiff.Hard||0,   total: totalHard||2, color:'#ef4444' },
          ].map(d => (
            <div key={d.label} className="mb-4 last:mb-0">
              <div className="flex justify-between text-sm mb-1.5">
                <span className="font-semibold" style={{ color: d.color }}>{d.label}</span>
                <span className={dark?'text-[#8b8fa8]':'text-[#6b6f8a]'}>{d.solved}/{d.total}</span>
              </div>
              <ProgressBar value={d.solved} max={d.total} color={d.color} height={7} />
            </div>
          ))}
        </div>

        {/* AI Recommendations (Heap-based) */}
        <div className={`${card} lg:col-span-2`}>
          <div className="flex items-center gap-2 mb-4">
            <Zap size={16} className="text-[#6c63ff]" />
            <h3 className="font-bold">Heap Recommendations</h3>
            <Badge text="AI-Powered" color="default" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {(recs.length ? recs : [
              {title:'Two Sum',difficulty:'Easy',category:'Arrays'},
              {title:'Valid Parentheses',difficulty:'Easy',category:'Stack'},
              {title:'Maximum Subarray',difficulty:'Medium',category:'DP'},
            ]).map((q, i) => (
              <div key={i} className={`p-3 rounded-lg ${dark ? 'bg-[#242736]' : 'bg-[#f0f2f9]'}`}>
                <div className="text-sm font-semibold mb-1.5 leading-tight">{q.title}</div>
                <div className="flex gap-1.5 flex-wrap">
                  <Badge text={q.difficulty} color={q.difficulty==='Easy'?'green':q.difficulty==='Medium'?'orange':'red'} />
                  <Badge text={q.category} color="blue" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div className={card}>
          <h3 className="font-bold mb-4">Achievements</h3>
          {[
            { icon:'🔥', title:'7-Day Streak', earned: (stats.streak||0) >= 7 },
            { icon:'⚡', title:'Speed Demon',  earned: solved >= 3 },
            { icon:'🏆', title:'Hard Mode',    earned: (byDiff.Hard||0) >= 1 },
            { icon:'🧠', title:'DP Master',    earned: false },
          ].map((a,i) => (
            <div key={i} className={`flex items-center gap-3 p-2.5 rounded-lg mb-2 last:mb-0 ${a.earned ? 'bg-[#ede9ff] dark:bg-[#312e6b]' : dark?'bg-[#242736]':'bg-[#f0f2f9]'} transition-all`} style={{opacity: a.earned?1:0.5}}>
              <span className="text-xl">{a.icon}</span>
              <span className={`text-sm font-semibold ${a.earned?'text-[#6c63ff]':''}`}>{a.title}</span>
              {a.earned && <Badge text="✓" color="default" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
