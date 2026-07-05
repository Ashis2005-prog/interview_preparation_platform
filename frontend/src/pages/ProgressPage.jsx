import { useTheme } from '../context/ThemeContext'
import { useQuery } from '@tanstack/react-query'
import { progressAPI, usersAPI } from '../utils/api'
import { ProgressBar, Badge } from '../components/common/Badge'
import { Trophy, Target, Flame, Clock } from 'lucide-react'

export default function ProgressPage() {
  const { dark } = useTheme()

  const { data: statsData }  = useQuery({ queryKey:['stats'],    queryFn: () => progressAPI.getStats() })
  const { data: actData }    = useQuery({ queryKey:['activity'], queryFn: () => progressAPI.getActivity() })
  const { data: lbData }     = useQuery({ queryKey:['leaderboard'], queryFn: () => usersAPI.leaderboard() })

  const stats      = statsData?.data || {}
  const activity   = actData?.data   || []
  const leaderboard= lbData?.data    || []

  const byDiff = stats.byDifficulty || { Easy:0, Medium:0, Hard:0 }
  const byCat  = stats.byCategory   || {}
  const maxAct = Math.max(...activity.map(a=>a.count), 1)

  const card = `rounded-xl border p-5 ${dark?'bg-[#1a1d27] border-[#2e3148]':'bg-white border-[#dde1f0]'} shadow-sm`

  const summaryCards = [
    { label:'Total Solved',  value: stats.totalSolved||0,  icon: Target,  color:'#6c63ff' },
    { label:'Day Streak',    value: stats.streak||0,        icon: Flame,   color:'#f97316' },
    { label:'Max Streak',    value: stats.maxStreak||0,     icon: Trophy,  color:'#eab308' },
    { label:'Time Studied',  value: `${Math.round((stats.totalTimeSpent||0)/3600)}h`, icon: Clock, color:'#22c55e' },
  ]

  return (
    <div>
      <h2 className="text-2xl font-black mb-6">Your Progress</h2>

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {summaryCards.map(s => (
          <div key={s.label} className={card}>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{background:s.color+'20'}}>
                <s.icon size={18} style={{color:s.color}} />
              </div>
              <div className="text-2xl font-black">{s.value}</div>
            </div>
            <div className={`text-xs ${dark?'text-[#8b8fa8]':'text-[#6b6f8a]'}`}>{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
        {/* Weekly activity chart */}
        <div className={card}>
          <h3 className="font-bold mb-5">Weekly Activity</h3>
          <div className="flex items-end gap-2" style={{height:100}}>
            {(activity.length ? activity : Array.from({length:7},(_,i)=>({count:[3,5,2,7,4,8,6][i],day:['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][i]}))).map((a,i)=>(
              <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                <div className="w-full rounded-t-md transition-all" title={`${a.count} problems`}
                  style={{height:`${(a.count/maxAct)*80}px`,minHeight:4,background:i===6?'#6c63ff':'rgba(108,99,255,0.4)'}} />
                <span className={`text-[10px] ${dark?'text-[#8b8fa8]':'text-[#6b6f8a]'}`}>{a.day?.slice(0,3)||a.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Difficulty */}
        <div className={card}>
          <h3 className="font-bold mb-5">Difficulty Breakdown</h3>
          {[
            {label:'Easy',   solved:byDiff.Easy||0,   total:4,  color:'#22c55e'},
            {label:'Medium', solved:byDiff.Medium||0, total:6,  color:'#f97316'},
            {label:'Hard',   solved:byDiff.Hard||0,   total:2,  color:'#ef4444'},
          ].map(d=>(
            <div key={d.label} className="mb-4 last:mb-0">
              <div className="flex justify-between text-sm mb-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{background:d.color}} />
                  <span className="font-semibold">{d.label}</span>
                </div>
                <span className={dark?'text-[#8b8fa8]':'text-[#6b6f8a]'}>{d.solved}/{d.total}</span>
              </div>
              <ProgressBar value={d.solved} max={d.total} color={d.color} height={8} />
            </div>
          ))}
        </div>

        {/* Category coverage */}
        <div className={card}>
          <h3 className="font-bold mb-5">Category Coverage</h3>
          {Object.keys(byCat).length ? Object.entries(byCat).map(([cat,count])=>(
            <div key={cat} className="flex items-center gap-3 mb-3 last:mb-0">
              <div className="flex-1">
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium">{cat}</span>
                  <span className={dark?'text-[#8b8fa8]':'text-[#6b6f8a]'}>{count}</span>
                </div>
                <ProgressBar value={count} max={5} color="#6c63ff" height={5} />
              </div>
            </div>
          )) : (
            [['Arrays',2,5],['Strings',1,4],['Trees',1,3],['Dynamic Programming',2,4],['Graphs',1,3]].map(([cat,s,t])=>(
              <div key={cat} className="flex items-center gap-3 mb-3 last:mb-0">
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">{cat}</span>
                    <span className={dark?'text-[#8b8fa8]':'text-[#6b6f8a]'}>{s}/{t}</span>
                  </div>
                  <ProgressBar value={s} max={t} color="#6c63ff" height={5} />
                </div>
              </div>
            ))
          )}
        </div>

        {/* Leaderboard */}
        <div className={card}>
          <h3 className="font-bold mb-5">🏆 Leaderboard</h3>
          {(leaderboard.length ? leaderboard : [
            {username:'alice_dev',score:2400,streak:15},
            {username:'bob_code',score:1980,streak:8},
            {username:'carol_eng',score:1650,streak:12},
            {username:'dave_tech',score:1200,streak:5},
            {username:'eve_prog',score:980,streak:3},
          ]).map((u,i)=>(
            <div key={i} className={`flex items-center gap-3 py-2.5 ${i<(leaderboard.length||5)-1?`border-b ${dark?'border-[#2e3148]':'border-[#f0f2f9]'}`:''}`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black ${i===0?'bg-[#eab308] text-white':i===1?'bg-[#9ca3af] text-white':i===2?'bg-[#b45309] text-white':dark?'bg-[#242736] text-[#8b8fa8]':'bg-[#f0f2f9] text-[#6b6f8a]'}`}>
                {i+1}
              </div>
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#6c63ff] to-[#8b5cf6] flex items-center justify-center text-xs font-bold text-white">
                {u.username[0].toUpperCase()}
              </div>
              <div className="flex-1">
                <div className="text-sm font-semibold">{u.username}</div>
                <div className={`text-xs ${dark?'text-[#8b8fa8]':'text-[#6b6f8a]'}`}>🔥 {u.streak} day streak</div>
              </div>
              <div className="text-sm font-bold text-[#6c63ff]">{u.score.toLocaleString()} pts</div>
            </div>
          ))}
        </div>
      </div>

      {/* Achievements */}
      <div className={card}>
        <h3 className="font-bold mb-5">Achievements</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            {icon:'🔥',title:'7-Day Streak',desc:'7 consecutive days',earned:(stats.streak||0)>=7},
            {icon:'⚡',title:'Speed Demon', desc:'3 problems in a day', earned:(stats.totalSolved||0)>=3},
            {icon:'🏆',title:'Hard Mode',   desc:'First hard problem',  earned:(byDiff.Hard||0)>=1},
            {icon:'🧠',title:'DP Master',   desc:'Solve 5 DP problems',  earned:(byCat['Dynamic Programming']||0)>=5},
            {icon:'🌟',title:'Rising Star',  desc:'100+ total score',    earned:(stats.score||0)>=100},
            {icon:'🎯',title:'On Target',    desc:'10 problems solved',  earned:(stats.totalSolved||0)>=10},
            {icon:'🗺️',title:'Explorer',    desc:'Complete 5 roadmap nodes',earned:false},
            {icon:'🤖',title:'AI Learner',  desc:'10 AI chat sessions',  earned:false},
          ].map((a,i)=>(
            <div key={i} className={`flex flex-col items-center text-center p-4 rounded-xl transition-all ${a.earned?'bg-[#ede9ff] dark:bg-[#312e6b]':dark?'bg-[#242736]':'bg-[#f0f2f9]'}`} style={{opacity:a.earned?1:0.5}}>
              <span className="text-2xl mb-2">{a.icon}</span>
              <div className={`text-xs font-bold mb-0.5 ${a.earned?'text-[#6c63ff]':''}`}>{a.title}</div>
              <div className={`text-[10px] ${dark?'text-[#8b8fa8]':'text-[#6b6f8a]'}`}>{a.desc}</div>
              {a.earned && <div className="mt-1.5"><Badge text="Earned" color="default" /></div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
